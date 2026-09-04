<?php
ob_start();
error_reporting(E_ALL);
ini_set('display_errors', '0');
ini_set('log_errors', '1');

header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    ob_end_flush();
    exit;
}

// دالة مساعدة لطباعة JSON والخروج بأمان
function jsonResponse($data) {
    ob_end_clean();
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

require_once('a03_helpers.php');

try {

    // ✅ يدعم الآن multipart/form-data (بدل JSON+base64 القديم) لتمكين رفع
    // ملفات (CV لمقدّم الخدمة). حقل "profile" يصل كـ JSON string واحد ضمن
    // الـ FormData، فيُفكّ هنا مرة واحدة ثم يُعامَل بنفس منطق $profile السابق
    // بلا أي تغيير لاحق — هذا يحافظ على التوافق الكامل مع كل الأدوار القديمة.
    $profileRaw = $_POST['profile'] ?? '';
    $profile = json_decode($profileRaw, true);
    if (!is_array($profile)) {
        $profile = [];
    }

    $data = [
        'role'          => $_POST['role'] ?? '',
        'email'         => $_POST['email'] ?? '',
        'password'      => $_POST['password'] ?? '',
        'profile_table' => $_POST['profile_table'] ?? '',
        'profile'       => $profile,
    ];

    $role         = trim($data['role'] ?? '');
    $email        = trim($data['email'] ?? '');
    $userPassword = $data['password'] ?? '';
    $profileTable = trim($data['profile_table'] ?? '');
    $profile      = $data['profile'] ?? [];

    $allowed_tables = [
        'undergrad'        => 'profiles_undergrad',
        'grad'             => 'profiles_grad',
        'faculty'          => 'profiles_faculty',
        'researcher'       => 'profiles_researcher',
        'reviewer'         => 'profiles_reviewer',
        'university'       => 'profiles_entity',
        'college'          => 'profiles_entity',
        'research_center'  => 'profiles_entity',
        'ministry'         => 'profiles_entity',
        'employee'         => 'profiles_system',
        'service_provider' => 'profiles_service_provider',
    ];

    if (!isset($allowed_tables[$role])) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid user role']);
    }

    if ($profileTable !== $allowed_tables[$role]) {
        jsonResponse(['status' => 'error', 'message' => 'Profile table mismatch']);
    }

    if (empty($email) || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
        jsonResponse(['status' => 'error', 'message' => 'Invalid email format']);
    }

    if (strlen($userPassword) < 8) {
        jsonResponse(['status' => 'error', 'message' => 'Password must be at least 8 characters']);
    }

    $name = '';
    switch ($role) {
        case 'undergrad':
        case 'grad':
        case 'researcher':
        case 'reviewer':
        case 'employee':
        case 'service_provider':
            $name = trim($profile['full_name'] ?? '');
            break;
        case 'faculty':
            $name = trim($profile['name'] ?? '');
            break;
        case 'university':
        case 'college':
        case 'research_center':
        case 'ministry':
            $name = trim($profile['entity_name'] ?? '');
            break;
    }

    if (empty($name)) {
        jsonResponse(['status' => 'error', 'message' => 'Name is required']);
    }

    // ===== مقدّم خدمة فقط: CV إلزامي من الباك إند + خدمة واحدة على الأقل =====
    $spServiceSlugs = [];
    if ($role === 'service_provider') {
        if (!isset($_FILES['cv']) || $_FILES['cv']['error'] != 0) {
            jsonResponse(['status' => 'error', 'message' => 'cv_required']);
        }
        $cvOriginalName = $_FILES['cv']['name'];
        $cvExt = strtolower(pathinfo($cvOriginalName, PATHINFO_EXTENSION));
        if (!in_array($cvExt, ['pdf', 'doc', 'docx'], true)) {
            jsonResponse(['status' => 'error', 'message' => 'invalid_cv_file_type']);
        }
        if ($_FILES['cv']['size'] > 10 * 1024 * 1024) {
            jsonResponse(['status' => 'error', 'message' => 'cv_file_size_exceeded']);
        }
        if ($_FILES['cv']['size'] === 0) {
            jsonResponse(['status' => 'error', 'message' => 'cv_file_empty']);
        }

        $slugsRaw = $_POST['service_slugs'] ?? '[]';
        $slugsDecoded = json_decode($slugsRaw, true);
        if (!is_array($slugsDecoded)) {
            $slugsDecoded = [];
        }
        $allowedSlugs = get_allowed_service_slugs();
        foreach ($slugsDecoded as $s) {
            $s = trim((string) $s);
            if (in_array($s, $allowedSlugs, true) && !in_array($s, $spServiceSlugs, true)) {
                $spServiceSlugs[] = $s;
            }
        }
        if (empty($spServiceSlugs)) {
            jsonResponse(['status' => 'error', 'message' => 'at_least_one_service_required']);
        }
    }

    require_once('a01_connect.php');

    $conn = new mysqli($host, $username, $password, $db_name);

    if ($conn->connect_error) {
        jsonResponse(['status' => 'error', 'message' => 'Database connection failed']);
    }
    $conn->set_charset('utf8mb4');

    // === جلب role_id ===
    $stmt = $conn->prepare('SELECT id FROM roles WHERE `key` = ? AND is_active = TRUE LIMIT 1');
    if (!$stmt) jsonResponse(['status' => 'error', 'message' => 'DB error (roles)', 'debug' => $conn->error]);
    
    $stmt->bind_param('s', $role);
    $stmt->execute();
    $result = $stmt->get_result();

    if ($result->num_rows === 0) {
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Role not available']);
    }

    $roleId = (int) $result->fetch_assoc()['id'];
    $stmt->close();

    // === التحقق من البريد ===
    $stmt = $conn->prepare('SELECT id FROM users WHERE email = ? AND deleted_at IS NULL LIMIT 1');
    if (!$stmt) jsonResponse(['status' => 'error', 'message' => 'DB error (email check)', 'debug' => $conn->error]);
    
    $stmt->bind_param('s', $email);
    $stmt->execute();
    $stmt->store_result();

    if ($stmt->num_rows > 0) {
        $stmt->close();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Email already registered']);
    }
    $stmt->close();

    $hashedPassword = password_hash($userPassword, PASSWORD_DEFAULT);
    $regIp = $_SERVER['REMOTE_ADDR'] ?? '';

    $conn->begin_transaction();

    // === أ: إدراج المستخدم ===
    $stmt = $conn->prepare(
        'INSERT INTO users (role_id, email, password_hash, registration_step, registration_ip, is_active) 
         VALUES (?, ?, ?, ?, ?, FALSE)'
    );
    if (!$stmt) {
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Prepare users failed', 'debug' => $conn->error]);
    }

    $regStep = 3;
    $stmt->bind_param('issis', $roleId, $email, $hashedPassword, $regStep, $regIp);
    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Insert users failed', 'debug' => $err]);
    }

    $userId = $conn->insert_id;
    $stmt->close();

    // === ب: جلب أعمدة الجدول الفعللي مرة واحدة (أداء أفضل) ===
    $colsRes = $conn->query("SHOW COLUMNS FROM `$profileTable`");
    if (!$colsRes) {
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => "Table $profileTable not found", 'debug' => $conn->error]);
    }

    $validColumns = [];
    while ($colRow = $colsRes->fetch_assoc()) {
        $validColumns[] = $colRow['Field'];
    }
    $colsRes->free();

    // === ج: إدراج الملف الشخصي بأمان تام ===
    $columns      = ['`user_id`'];
    $placeHolders = ['?'];
    $params       = [$userId];
    $types        = 'i';

    foreach ($profile as $col => $val) {
        // 1. تجاهل أي حقل غير صالح اسمه
        if (!preg_match('/^[a-zA-Z_][a-zA-Z0-9_]*$/', $col)) continue;
        
        // 2. تجاهل أي حقل غير موجود في الجدول
        if (!in_array($col, $validColumns)) continue;

        $columns[] = '`' . $col . '`';

        if ($val === '' || $val === null) {
            $placeHolders[] = 'NULL';
        } elseif (is_numeric($val) && strpos((string)$val, '.') === false) {
            $placeHolders[] = '?';
            $params[]      = (int) $val;
            $types        .= 'i';
        } else {
            $placeHolders[] = '?';
            $params[]      = (string) $val;
            $types        .= 's';
        }
    }

    $sql = 'INSERT INTO `' . $profileTable . '` (' . implode(', ', $columns) . ') 
            VALUES (' . implode(', ', $placeHolders) . ')';

    $stmt = $conn->prepare($sql);
    if (!$stmt) {
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Prepare profile failed', 'debug' => $conn->error . ' | SQL: ' . $sql]);
    }

    if (!empty($params)) {
        $refs = [];
        foreach ($params as $i => &$v) {
            $refs[$i] = &$v;
        }
        unset($v);
        $stmt->bind_param($types, ...$refs);
    }

    if (!$stmt->execute()) {
        $err = $stmt->error;
        $stmt->close();
        $conn->rollback();
        $conn->close();
        jsonResponse(['status' => 'error', 'message' => 'Insert profile failed', 'debug' => $err . ' | SQL: ' . $sql]);
    }
    $stmt->close();

    // === ج2: مقدّم خدمة فقط — رفع CV + ربط الخدمات المختارة (داخل نفس المعاملة) ===
    if ($role === 'service_provider') {
        $cvUploadDir = '../uploads/cvs/';
        if (!is_dir($cvUploadDir)) {
            mkdir($cvUploadDir, 0755, true);
        }
        $cvSafeName = 'cv_' . $userId . '_' . time() . '_' . preg_replace('/[^a-zA-Z0-9._-]/', '_', $cvOriginalName);
        $cvTargetPath = $cvUploadDir . $cvSafeName;
        if (!move_uploaded_file($_FILES['cv']['tmp_name'], $cvTargetPath)) {
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'cv_upload_failed']);
        }
        $cvRelPath = 'uploads/cvs/' . $cvSafeName;
        $cvSize = (int) $_FILES['cv']['size'];

        $stmtCv = $conn->prepare(
            'UPDATE profiles_service_provider SET cv_file_name = ?, cv_file_path = ?, cv_file_size = ? WHERE user_id = ?'
        );
        if (!$stmtCv) {
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'Prepare cv update failed', 'debug' => $conn->error]);
        }
        $stmtCv->bind_param('ssii', $cvOriginalName, $cvRelPath, $cvSize, $userId);
        if (!$stmtCv->execute()) {
            $err = $stmtCv->error;
            $stmtCv->close();
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'Update cv failed', 'debug' => $err]);
        }
        $stmtCv->close();

        $stmtSvc = $conn->prepare('INSERT INTO service_provider_services (user_id, service_slug) VALUES (?, ?)');
        if (!$stmtSvc) {
            $conn->rollback();
            $conn->close();
            jsonResponse(['status' => 'error', 'message' => 'Prepare service_slugs failed', 'debug' => $conn->error]);
        }
        foreach ($spServiceSlugs as $slug) {
            $stmtSvc->bind_param('is', $userId, $slug);
            if (!$stmtSvc->execute()) {
                $err = $stmtSvc->error;
                $stmtSvc->close();
                $conn->rollback();
                $conn->close();
                jsonResponse(['status' => 'error', 'message' => 'Insert service_slugs failed', 'debug' => $err]);
            }
        }
        $stmtSvc->close();
    }

    // === د: تسجيل العملية ===
    $logEvent = 'success';
    $stmt = $conn->prepare(
        'INSERT INTO registration_logs (user_id, role_id, event_type, step_number, ip_address) 
         VALUES (?, ?, ?, ?, ?)'
    );
    if ($stmt) {
        $stmt->bind_param('iisss', $userId, $roleId, $logEvent, $regStep, $regIp);
        $stmt->execute();
        $stmt->close();
    }

    $conn->commit();

    jsonResponse([
        'status'  => 'success',
        'message' => 'Registration successful, pending approval',
        'user_id' => $userId
    ]);

} catch (Throwable $e) { // ✅ Throwable يلتقط Fatal Errors أيضاً وليس Exception فقط
    if (isset($conn) && $conn->ping()) {
        $conn->rollback();
        $conn->close();
    }

    error_log('REG FATAL: ' . $e->getMessage() . ' in ' . $e->getFile() . ':' . $e->getLine());

    jsonResponse([
        'status'  => 'error',
        'message' => 'Registration failed. Please try again.',
        'debug'   => $e->getMessage(),
        'file'    => basename($e->getFile()),
        'line'    => $e->getLine()
    ]);
}