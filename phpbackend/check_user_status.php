<?php
require 'database.php'; // Ensure this file is included to define $pdo
require 'cors.php';

header('Content-Type: application/json');

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);
$id_number = $data['id_number'];
$new_password = $data['new_password'];
$new_email = $data['new_email'] ?? null; // Email is optional

// Validate inputs
if (empty($id_number) || empty($new_password)) {
    echo json_encode(['success' => false, 'message' => 'ID Number and New Password are required.']);
    exit;
}

// Hash the new password
$hashed_password = password_hash($new_password, PASSWORD_BCRYPT);

// Start transaction to ensure both password change and force_password_change update succeed together
try {
    $pdo->beginTransaction();

    // Update the password in the database
    $stmt = $pdo->prepare("UPDATE users SET password = ? WHERE id_number = ?");
    $stmt->execute([$hashed_password, $id_number]);

    // Update the email if provided
    if ($new_email) {
        $stmt = $pdo->prepare("UPDATE users SET email = ? WHERE id_number = ?");
        $stmt->execute([$new_email, $id_number]);
    }

    // Set force_password_change to false since the user has updated their password
    $stmt = $pdo->prepare("UPDATE users SET force_password_change = 0 WHERE id_number = ?");
    $stmt->execute([$id_number]);

    // Commit the transaction
    $pdo->commit();

    echo json_encode(['success' => true, 'message' => 'Password (and/or email) updated successfully.']);
} catch (PDOException $e) {
    // If anything fails, roll back the transaction
    $pdo->rollBack();
    error_log('Error updating password/email: ' . $e->getMessage()); // Log error to server
    echo json_encode(['success' => false, 'message' => 'Error updating password/email. Please contact support.']);
}
?>
