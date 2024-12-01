<?php
require 'database.php'; // Ensure this file is included to define $conn
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
$usertype = $data['usertype'];
$password = $data['password'] ?? null;

// Validate inputs
if (empty($id_number) || empty($fname) || empty($lname) || empty($email) || !isset($usertype)) {
    echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
    exit;
}

// Start transaction to ensure both the updates succeed together
$conn->begin_transaction();

try {
    // Update the user information in the database
    $updateSql = "UPDATE users SET fname = ?, lname = ?, mname = ?, suffix = ?, email = ?, usertype = ? WHERE id_number = ?";
    $stmt = $conn->prepare($updateSql);
    $stmt->bind_param("sssssis", $fname, $lname, $mname, $suffix, $email, $usertype, $id_number);
    $stmt->execute();

    // If password is provided, update it as well
    if (!empty($password)) {
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $updatePasswordSql = "UPDATE users SET password = ? WHERE id_number = ?";
        $passwordStmt = $conn->prepare($updatePasswordSql);
        $passwordStmt->bind_param("ss", $hashed_password, $id_number);
        $passwordStmt->execute();
    }

    // Commit the transaction
    $conn->commit();

    echo json_encode(['success' => true, 'message' => 'Admin updated successfully.']);
} catch (Exception $e) {
    // If something goes wrong, rollback the transaction
    $conn->rollback();
    echo json_encode(['success' => false, 'message' => 'Error updating admin: ' . $e->getMessage()]);
}

$conn->close();
?>
