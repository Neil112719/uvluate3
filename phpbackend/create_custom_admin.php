<?php
require 'database.php';
require 'cors.php';

// Decode the incoming JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Check if required fields are provided
if (!isset($data['id_number']) || !isset($data['fname']) || !isset($data['lname']) || !isset($data['email']) || !isset($data['password'])) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields.']);
    exit;
}

$id_number = $data['id_number'];
$fname = $data['fname'];
$lname = $data['lname'];
$email = $data['email'];
$password = password_hash($data['password'], PASSWORD_BCRYPT);

// Optional fields
$mname = isset($data['mname']) && !empty($data['mname']) ? $data['mname'] : null;
$suffix = isset($data['suffix']) && !empty($data['suffix']) ? $data['suffix'] : null;

// Prepare and execute the SQL query to insert the new admin
$query = $conn->prepare(
    "INSERT INTO users (id_number, fname, mname, lname, suffix, email, password, usertype) VALUES (?, ?, ?, ?, ?, ?, ?, 1)"
);
$query->bind_param("sssssss", $id_number, $fname, $mname, $lname, $suffix, $email, $password);

if ($query->execute()) {
    echo json_encode(['success' => true, 'message' => 'Admin created successfully.']);
} else {
    echo json_encode(['success' => false, 'message' => 'Failed to create admin.']);
}

$conn->close();
?>
