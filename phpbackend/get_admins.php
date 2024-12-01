<?php
require 'database.php'; // Ensure this file is included to define $conn
require 'cors.php';

header('Content-Type: application/json');

// Query to fetch users with usertype 0 (Deactivated) and 1 (Admin)
$sql = "SELECT id_number, fname, lname, mname, suffix, email, usertype FROM users WHERE usertype IN (0, 1)";
$result = $conn->query($sql);

if ($result->num_rows > 0) {
    $admins = [];
    while ($row = $result->fetch_assoc()) {
        // Include usertype in the response
        $admins[] = $row;
    }
    echo json_encode(['success' => true, 'admins' => $admins]);
} else {
    echo json_encode(['success' => false, 'message' => 'No admins found']);
}

$conn->close();
?>
