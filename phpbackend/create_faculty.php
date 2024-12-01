<?php
require 'database.php'; // Include the database connection
require 'cors.php';

header('Content-Type: application/json');

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);
$id_number = $data['id_number'];
$fname = $data['fname'];
$lname = $data['lname'];
$mname = $data['mname'] ?? null;
$suffix = $data['suffix'] ?? null;
$email = $data['email'];
$department = $data['department'];
$usertype = $data['usertype'];
$password = $data['password'];

// Validate inputs
if (empty($id_number) || empty($fname) || empty($lname) || empty($email) || empty($department) || empty($usertype)) {
    echo json_encode(['success' => false, 'message' => 'Missing required fields']);
    exit;
}

// Hash the password
$hashed_password = password_hash($password, PASSWORD_BCRYPT);

try {
    // Insert new faculty member into the database
    $sql = "INSERT INTO users (id_number, fname, lname, mname, suffix, email, department, usertype, password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('sssssssis', $id_number, $fname, $lname, $mname, $suffix, $email, $department, $usertype, $hashed_password);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Faculty member created successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Error creating faculty member']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Server error: ' . $e->getMessage()]);
}

$conn->close();
?>
