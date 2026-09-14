<?php
// =====================================================================
// a04_auth.php — طبقة الجلسة والهوية المُصادَق عليها (Stage A.5)
//
// مسؤولية مختلفة تماماً عن a03_helpers.php: a03 يفترض أن user_id موثوق
// أصلاً ويكتفي بالبحث عن بياناته ("بما أن هذا المستخدم صحيح، من هو؟")،
// بينما هذا الملف مسؤول عن السؤال المعاكس والأهم أمنياً: "من الذي يقوم
// فعلياً بهذا الطلب؟" — عبر جلسة PHP حقيقية على الخادم، وليس عبر أي
// user_id/university_id/entity_id وارد من العميل كمعطى ثقة.
//
// لهذا هو ملف مستقل بدل الإضافة إلى a03_helpers.php: a03 يُستدعى اليوم
// من 34 ملفاً لا علاقة لها بالجلسات إطلاقاً، وربط بدء الجلسة (بآثاره
// الجانبية العامة: إصدار كوكي، قفل ملف الجلسة) بذلك الاستدعاء البريء
// سيُفاجئ تلك الملفات. أي ملف API يحتاج مصادقة حقيقية يُضيف
// require_once('a04_auth.php') صراحةً كاختيار واعٍ.
//
// لا يُستدعى مباشرة كصفحة — require_once فقط من ملفات API أخرى، بعد
// require_once('a01_connect.php') وإنشاء $conn (يحتاجه get_user_role_key
// وget_university_id_for_user من a03_helpers.php، اللذين يُطلبان هنا).
// =====================================================================

require_once __DIR__ . '/a03_helpers.php';

// ===== بدء جلسة مؤمَّنة (يُنفَّذ مرة واحدة فوراً عند تحميل هذا الملف) =====
// httponly: يمنع وصول جافاسكربت للكوكي (يحبط XSS-based session theft).
// samesite=Lax: يمنع CSRF عبر التنقّل من مواقع أخرى، مع السماح بطلبات
//   fetch/XHR بنفس الموقع أو عبر أصل مسموح به فعلياً (يُتحكم بذلك عبر
//   CORS في a02_cors.php، وليس عبر SameSite).
// secure: يُفعَّل تلقائياً فقط عند HTTPS — بيئة XAMPP المحلية تعمل بـ
//   HTTP، فتفعيله دائماً كان سيمنع الكوكي من العمل محلياً بالكامل.
function session_bootstrap() {
    if (session_status() === PHP_SESSION_ACTIVE) {
        return;
    }
    $isHttps = (($_SERVER['HTTPS'] ?? '') !== '') && (($_SERVER['HTTPS'] ?? '') !== 'off');
    session_set_cookie_params([
        'lifetime' => 0,
        'path'     => '/',
        'domain'   => '',
        'secure'   => $isHttps,
        'httponly' => true,
        'samesite' => 'Lax',
    ]);
    session_name('RIS_SESSID');
    session_start();
}

session_bootstrap();

// ===== إرجاع user_id المُصادَق عليه من الجلسة، أو null بلا إنهاء الطلب =====
// (للاستخدام في نقاط قد تحتاج فرعاً بين "مسجّل دخول" و"زائر" دون رفض قسري)
function get_authenticated_user_id($conn) {
    if (empty($_SESSION['user_id'])) {
        return null;
    }
    $userId = (int) $_SESSION['user_id'];
    // إعادة تحقّق دفاعية: الحساب قد يكون عُطِّل/حُذف بعد بدء الجلسة
    if (get_user_role_key($conn, $userId) === null) {
        return null;
    }
    return $userId;
}

// ===== تفرض وجود جلسة صالحة، وإلا تُنهي الطلب بـ 401 =====
function require_authenticated_user($conn) {
    $userId = get_authenticated_user_id($conn);
    if ($userId === null) {
        http_response_code(401);
        jsonResponse(['status' => 'error', 'message' => 'unauthenticated']);
    }
    return $userId;
}

// ===== تفرض جلسة صالحة + دور منصّة محدد (مثال: super_admin)، وإلا 403 =====
function require_platform_permission($conn, $requiredRoleKey) {
    $userId = require_authenticated_user($conn);
    $roleKey = get_user_role_key($conn, $userId);
    if ($roleKey !== $requiredRoleKey) {
        http_response_code(403);
        jsonResponse(['status' => 'error', 'message' => 'forbidden']);
    }
    return $userId;
}

// ===== university_id للمستخدم المُصادَق عليه حالياً عبر الجلسة =====
// (غلاف رفيع فوق get_university_id_for_user الموجودة أصلاً في a03 —
// الفرق الوحيد أن userId هنا مُستمَد من الجلسة وليس من معطى وارد)
function get_authenticated_university_id($conn) {
    $userId = require_authenticated_user($conn);
    return get_university_id_for_user($conn, $userId);
}

// ===== تفرض عضوية جامعة صالحة، وتتحقق (اختيارياً) من تطابقها مع قيمة
// university_id فعلية مقروءة من قاعدة البيانات لسجل مستهدف — لا تُستخدم
// أبداً مع قيمة واردة مباشرة من العميل بلا تحقق مسبق =====
function require_university_access($conn, $claimedUniversityId = null) {
    $universityId = get_authenticated_university_id($conn);
    if ($universityId === null) {
        http_response_code(403);
        jsonResponse(['status' => 'error', 'message' => 'no_university_membership']);
    }
    if ($claimedUniversityId !== null && (int) $claimedUniversityId !== $universityId) {
        http_response_code(403);
        jsonResponse(['status' => 'error', 'message' => 'cross_tenant_access_denied']);
    }
    return $universityId;
}
