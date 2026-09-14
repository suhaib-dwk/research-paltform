<?php
// =====================================================================
// a03_helpers.php — دوال مساعدة مشتركة لكل ملفات الـ API الجديدة
// (لوحة تحكم حقيقية: Activity, Account, Messages, Researches, Reviews,
//  Tasks, Stats, Settings, employee/UsersPage, Dashboard)
//
// لا يُستدعى مباشرة كصفحة — require_once فقط من ملفات API أخرى.
// لا يُعدَّل login.php للحفاظ على استقرار مسار الدخول الحرج؛ هذا الملف
// يوحّد نفس منطق profileMap الموجود هناك ليُعاد استخدامه من كل مكان آخر.
// =====================================================================

// ===== خريطة الملف الشخصي لكل دور: الجدول + أعمدة full_name/phone/email/avatar =====
// ⚠️ مطابقة تماماً لجداول profiles_* الفعلية بقاعدة البيانات (تم التحقق من DESCRIBE لكل جدول).
// عمود avatar_path يُضاف عبر migration منفصل (db_avatar_migration.sql) لكل هذه الجداول.
function get_profile_contact_fields($roleKey) {
    $map = [
        'undergrad'       => ['table' => 'profiles_undergrad',  'name_col' => 'full_name',   'phone_col' => 'phone', 'email_col' => 'personal_email', 'avatar_col' => 'avatar_path'],
        'grad'            => ['table' => 'profiles_grad',       'name_col' => 'full_name',   'phone_col' => 'phone', 'email_col' => 'personal_email', 'avatar_col' => 'avatar_path'],
        'faculty'         => ['table' => 'profiles_faculty',    'name_col' => 'name',        'phone_col' => 'phone', 'email_col' => 'uni_email',       'avatar_col' => 'avatar_path'],
        'researcher'      => ['table' => 'profiles_researcher', 'name_col' => 'full_name',   'phone_col' => 'phone', 'email_col' => 'email',           'avatar_col' => 'avatar_path'],
        'reviewer'        => ['table' => 'profiles_reviewer',   'name_col' => 'full_name',   'phone_col' => null,    'email_col' => 'email',           'avatar_col' => 'avatar_path'],
        'university'      => ['table' => 'profiles_entity',     'name_col' => 'entity_name', 'phone_col' => 'phone', 'email_col' => 'official_email',  'avatar_col' => 'avatar_path'],
        'college'         => ['table' => 'profiles_entity',     'name_col' => 'entity_name', 'phone_col' => 'phone', 'email_col' => 'official_email',  'avatar_col' => 'avatar_path'],
        'research_center' => ['table' => 'profiles_entity',     'name_col' => 'entity_name', 'phone_col' => 'phone', 'email_col' => 'official_email',  'avatar_col' => 'avatar_path'],
        'ministry'        => ['table' => 'profiles_entity',     'name_col' => 'entity_name', 'phone_col' => 'phone', 'email_col' => 'official_email',  'avatar_col' => 'avatar_path'],
        'employee'        => ['table' => 'profiles_system',     'name_col' => 'full_name',   'phone_col' => 'phone', 'email_col' => 'email',           'avatar_col' => 'avatar_path'],
        'service_provider'=> ['table' => 'profiles_service_provider', 'name_col' => 'full_name', 'phone_col' => 'phone', 'email_col' => 'email',      'avatar_col' => 'avatar_path'],
    ];
    return $map[$roleKey] ?? null;
}

// ===== الخدمات الثماني المسموح لمقدّم خدمة الاختصاص بها عند التسجيل =====
// (استبعاد 'review' — له نظام reviewer منفصل، و'ai-assistant' — أداة فورية بلا طلبات بشرية تُدار)
function get_allowed_service_slugs() {
    return [
        'translation',
        'proofreading',
        'consultation',
        'journal-selection',
        'journal-evaluation',
        'template',
        'correspondence',
        'publication',
    ];
}

// ===== خريطة slug → اسم جدول الطلبات، يستخدمها accept_service_request.php /
// submit_service_result.php / get_provider_dashboard.php =====
function get_service_table_map() {
    return [
        'translation'         => 'translation_requests',
        'proofreading'        => 'proofreading_requests',
        'consultation'        => 'consultation_requests',
        'journal-selection'   => 'journal_selection_requests',
        'journal-evaluation'  => 'journal_evaluation_requests',
        'template'            => 'template_requests',
        'correspondence'      => 'correspondence_requests',
        'publication'         => 'publication_requests',
    ];
}

// ===== خريطة دور الحساب → (جدول الملف الشخصي + عمود الاسم)، لاشتقاق اسم
// العرض عند تسجيل الدخول أو عند جلب هوية الجلسة الحالية (me.php). نفس
// الخريطة كانت مكررة داخل login.php حرفياً؛ استُخرجت هنا Stage A.5 ليُعاد
// استخدامها من كلا الملفين بدل نسخة ثانية قد تنحرف عن الأولى لاحقاً. =====
function get_login_profile_name_map() {
    return [
        'undergrad'        => ['table' => 'profiles_undergrad', 'col' => 'full_name'],
        'grad'             => ['table' => 'profiles_grad',      'col' => 'full_name'],
        'faculty'          => ['table' => 'profiles_faculty',   'col' => 'name'],
        'researcher'       => ['table' => 'profiles_researcher','col' => 'full_name'],
        'reviewer'         => ['table' => 'profiles_reviewer',  'col' => 'full_name'],
        'university'       => ['table' => 'profiles_entity',    'col' => 'entity_name'],
        'college'          => ['table' => 'profiles_entity',    'col' => 'entity_name'],
        'research_center'  => ['table' => 'profiles_entity',    'col' => 'entity_name'],
        'ministry'         => ['table' => 'profiles_entity',    'col' => 'entity_name'],
        'employee'         => ['table' => 'profiles_system',    'col' => 'full_name'],
        'service_provider' => ['table' => 'profiles_service_provider', 'col' => 'full_name'],
    ];
}

// ===== جلب role_key لمستخدم عبر id (يُستخدم للتحقق من الصلاحيات في كل endpoint حساس) =====
function get_user_role_key($conn, $userId) {
    $stmt = $conn->prepare("SELECT r.key AS role_key FROM users u JOIN roles r ON u.role_id = r.id WHERE u.id = ? AND u.deleted_at IS NULL LIMIT 1");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $res = $stmt->get_result();
    $row = $res->fetch_assoc();
    $stmt->close();
    return $row ? $row['role_key'] : null;
}

// ===== تسجيل حدث نشاط موحّد بجدول activity_log (يُستدعى من كل endpoint عند نجاح عمليته) =====
function log_activity($conn, $userId, $eventType, $service, $textAr, $textEn, $refTable = null, $refId = null) {
    $ip = $_SERVER['REMOTE_ADDR'] ?? null;
    $stmt = $conn->prepare(
        "INSERT INTO activity_log (user_id, event_type, service, text_ar, text_en, ref_table, ref_id, ip_address)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)"
    );
    if (!$stmt) return false;
    // الترتيب: user_id(i), event_type(s), service(s), text_ar(s), text_en(s), ref_table(s), ref_id(i), ip_address(s) = 8 قيم
    $stmt->bind_param('isssssis', $userId, $eventType, $service, $textAr, $textEn, $refTable, $refId, $ip);
    $ok = $stmt->execute();
    $stmt->close();
    return $ok;
}

// ===== تنسيق "منذ 3 ساعات" / "3 hours ago" من تاريخ MySQL =====
function time_ago($datetime, $isAr) {
    $ts = strtotime($datetime);
    if (!$ts) return $isAr ? 'الآن' : 'just now';
    $diff = time() - $ts;
    if ($diff < 60) return $isAr ? 'الآن' : 'just now';
    if ($diff < 3600) {
        $m = (int) floor($diff / 60);
        return $isAr ? "منذ {$m} دقيقة" : "{$m} min ago";
    }
    if ($diff < 86400) {
        $h = (int) floor($diff / 3600);
        return $isAr ? "منذ {$h} ساعة" : "{$h} hours ago";
    }
    $d = (int) floor($diff / 86400);
    if ($d < 30) return $isAr ? "منذ {$d} يوم" : "{$d} days ago";
    return date('Y-m-d', $ts);
}

// ===== جلب university_id لمستخدم عبر عضويته بجدول university_users =====
// (Stage A: مستخدم واحد ينتمي لجامعة واحدة كحد أقصى — مفروض بقيد UNIQUE
// حقيقي uniq_uu_user على مستوى قاعدة البيانات، لذا LIMIT 1 هنا آمن فعليًا
// وليس مجرد اصطلاح استعلام).
function get_university_id_for_user($conn, $userId) {
    $stmt = $conn->prepare("SELECT university_id FROM university_users WHERE user_id = ? LIMIT 1");
    $stmt->bind_param('i', $userId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $row ? (int) $row['university_id'] : null;
}

// ===== هل يملك هذا المستخدم صلاحية تغيير profile_status لهذه الجامعة؟ =====
// دالة مستقلة عمدًا (لا شرط مضمَّن) ليسهل استبدال منطقها لاحقًا بقواعد RBAC
// أدق لكل انتقال حالة (تقديم/مراجعة/اعتماد) دون تعديل نقاط الاستدعاء.
function can_change_profile_status($conn, $userId, $universityId) {
    $stmt = $conn->prepare(
        "SELECT ur.key AS role_key FROM university_users uu
         JOIN university_roles ur ON ur.id = uu.university_role_id
         WHERE uu.user_id = ? AND uu.university_id = ? LIMIT 1"
    );
    $stmt->bind_param('ii', $userId, $universityId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();
    return $row && $row['role_key'] === 'admin';
}

// ===== جلب ملف الجامعة البحثية كاملاً (البيانات الأساسية + الفرعية) =====
// يُستخدم من get_university_profile.php و ai_readiness_assessment.php معًا
// لتجنّب تكرار منطق الـ JOIN بين الملفين.
//
// Stage A: يحل university_id أولاً عبر العضوية، ثم يستعلم كل مصادر البيانات
// (universities + university_profiles + الجداول الفرعية الأربعة) عبر
// university_id بدل user_id. التوقيع وشكل القيمة المُعادة لم يتغيّرا —
// كلا المستدعيَين لا يحتاجان أي تعديل.
function get_university_profile_data($conn, $userId) {
    $universityId = get_university_id_for_user($conn, $userId);

    $decodeArr = function ($json) {
        if (!$json) return [];
        $arr = json_decode($json, true);
        return is_array($arr) ? $arr : [];
    };

    // ===== لا توجد عضوية جامعة بعد (حالة نادرة/انتقالية) — نُرجع القيم الافتراضية =====
    if (!$universityId) {
        return [
            'user_id' => $userId, 'entity_name' => null, 'entity_type' => null,
            'website' => null, 'official_email' => null, 'phone' => null, 'address' => null,
            'arabic_name' => null, 'country' => null, 'type' => null, 'official_domains' => null,
            'research_strategy' => null, 'priority_areas' => [], 'research_goals' => [],
            'profile_status' => 'draft', 'campuses' => [], 'colleges' => [], 'departments' => [], 'research_centers' => [],
        ];
    }

    // ===== البيانات الأساسية: profiles_entity (عبر user_id، دون تغيير) +
    // universities + university_profiles (كلاهما الآن عبر university_id) =====
    $stmt = $conn->prepare(
        "SELECT pe.entity_type, pe.website, pe.official_email, pe.phone, pe.address,
                u.name AS entity_name, u.arabic_name, u.country, u.type, u.official_domains,
                up.research_strategy, up.priority_areas, up.research_goals, up.profile_status
         FROM profiles_entity pe
         JOIN universities u ON u.id = ?
         LEFT JOIN university_profiles up ON up.university_id = u.id
         WHERE pe.user_id = ?
         LIMIT 1"
    );
    $stmt->bind_param('ii', $universityId, $userId);
    $stmt->execute();
    $row = $stmt->get_result()->fetch_assoc();
    $stmt->close();

    $profile = [
        'user_id' => $userId,
        'entity_name' => $row['entity_name'] ?? null,
        'entity_type' => $row['entity_type'] ?? null,
        'website' => $row['website'] ?? null,
        'official_email' => $row['official_email'] ?? null,
        'phone' => $row['phone'] ?? null,
        'address' => $row['address'] ?? null,
        'arabic_name' => $row['arabic_name'] ?? null,
        'country' => $row['country'] ?? null,
        'type' => $row['type'] ?? null,
        'official_domains' => $row['official_domains'] ?? null,
        'research_strategy' => $row['research_strategy'] ?? null,
        'priority_areas' => $decodeArr($row['priority_areas'] ?? null),
        'research_goals' => $decodeArr($row['research_goals'] ?? null),
        'profile_status' => $row['profile_status'] ?? 'draft',
        'campuses' => [],
        'colleges' => [],
        'departments' => [],
        'research_centers' => [],
    ];

    // ===== الحرم الجامعي (Stage A.5: استبعاد الصفوف المحذوفة ناعماً) =====
    $stmt = $conn->prepare("SELECT id, name, location FROM university_campuses WHERE university_id = ? AND deleted_at IS NULL ORDER BY sort_order, id");
    $stmt->bind_param('i', $universityId);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($r = $res->fetch_assoc()) { $profile['campuses'][] = $r; }
    $stmt->close();

    // ===== الكليات (Stage A.5: استبعاد الصفوف المحذوفة ناعماً) =====
    $stmt = $conn->prepare("SELECT id, campus_id, name FROM university_colleges WHERE university_id = ? AND deleted_at IS NULL ORDER BY sort_order, id");
    $stmt->bind_param('i', $universityId);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($r = $res->fetch_assoc()) { $profile['colleges'][] = $r; }
    $stmt->close();

    // ===== الأقسام (Stage A.5: استبعاد الصفوف المحذوفة ناعماً) =====
    $stmt = $conn->prepare("SELECT id, college_id, name FROM university_departments WHERE university_id = ? AND deleted_at IS NULL ORDER BY sort_order, id");
    $stmt->bind_param('i', $universityId);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($r = $res->fetch_assoc()) { $profile['departments'][] = $r; }
    $stmt->close();

    // ===== المراكز البحثية (Stage A.5: استبعاد الصفوف المحذوفة ناعماً) =====
    $stmt = $conn->prepare("SELECT id, parent_unit_type, parent_unit_id, name, research_areas FROM university_research_centers WHERE university_id = ? AND deleted_at IS NULL ORDER BY sort_order, id");
    $stmt->bind_param('i', $universityId);
    $stmt->execute();
    $res = $stmt->get_result();
    while ($r = $res->fetch_assoc()) {
        $r['research_areas'] = $decodeArr($r['research_areas']);
        $profile['research_centers'][] = $r;
    }
    $stmt->close();

    return $profile;
}
