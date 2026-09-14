<?php
header('Content-Type: application/json; charset=utf-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET');

require_once('a01_connect.php');

 $conn = new mysqli($host, $username, $password, $db_name);

if ($conn->connect_error) {
    echo json_encode(['status' => 'error', 'message' => 'DB connection failed']);
    exit;
}

 $conn->set_charset('utf8mb4');

 $type = $_GET['type'] ?? '';

// ===== جلب الجامعات =====
if ($type === 'universities') {
    $sql = "SELECT id, name_ar, name_en FROM ref_universities 
            WHERE is_active = TRUE 
            ORDER BY sort_order ASC, name_ar ASC";
    $result = $conn->query($sql);
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    echo json_encode(['status' => 'success', 'data' => $data]);
} 

// ===== جلب الكليات (كلها أو تابعة لجامعة معينة) =====
elseif ($type === 'colleges') {
    $uniId = (int)($_GET['university_id'] ?? 0);
    
    if ($uniId > 0) {
        $stmt = $conn->prepare("SELECT id, name_ar, name_en FROM ref_colleges 
                                WHERE university_id = ? AND is_active = TRUE 
                                ORDER BY sort_order ASC, name_ar ASC");
        $stmt->bind_param('i', $uniId);
        $stmt->execute();
        $result = $stmt->get_result();
    } else {
        $result = $conn->query("SELECT id, name_ar, name_en FROM ref_colleges 
                                WHERE is_active = TRUE 
                                ORDER BY sort_order ASC, name_ar ASC");
    }
    
    $data = [];
    while ($row = $result->fetch_assoc()) {
        $data[] = $row;
    }
    
    echo json_encode(['status' => 'success', 'data' => $data]);
    
    if (isset($stmt)) $stmt->close();
}

else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid type']);
}

 $conn->close();