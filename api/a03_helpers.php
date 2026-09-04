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
