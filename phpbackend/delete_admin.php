<?php
require 'database.php';
require 'cors.php';

// Decode the incoming JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Check if id_number is provided
if (!isset($data['id_number'])) {
    echo json_encode(['success' => false, 'message' => 'ID number not provided.']);
    exit;
}

$id_number = $data['id_number'];

// Prepare and execute the SQL query to delete the admin
$query = $conn->prepare("DELETE FROM users WHERE id_number = ?");
$query->bind_param("s", $id_number);

if ($query->execute()) {
    echo json_encode(['success' => true, 'message' => 'Admin deleted successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to delete admin.']);
}

$conn->close();
?>
