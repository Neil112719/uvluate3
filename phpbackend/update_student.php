<?php
require 'database.php';
require 'cors.php';

// Get the JSON data from the request
$data = json_decode(file_get_contents("php://input"), true);

// Check if the necessary data (id_number) is provided
if (!isset($data['id_number'])) {
    echo json_encode(['status' => 'error', 'message' => 'Student ID is required']);
    exit();
}

// Initialize the set of fields to update
$fieldsToUpdate = [];
$params = [];

// Build the update query dynamically based on the fields provided
$query = "UPDATE users SET ";

// Optional fields to be updated only if provided
if (isset($data['fname'])) {
    $fieldsToUpdate[] = "fname = ?";
    $params[] = $data['fname'];
}

if (isset($data['mname'])) {
    $fieldsToUpdate[] = "mname = ?";
    $params[] = $data['mname'];
}

if (isset($data['lname'])) {
    $fieldsToUpdate[] = "lname = ?";
    $params[] = $data['lname'];
}

if (isset($data['suffix'])) {
    $fieldsToUpdate[] = "suffix = ?";
    $params[] = $data['suffix'];
}

if (isset($data['email'])) {
    $fieldsToUpdate[] = "email = ?";
    $params[] = $data['email'];
}

if (isset($data['department'])) {
    $fieldsToUpdate[] = "department = ?";
    $params[] = $data['department'];
}

if (isset($data['program'])) {
    $fieldsToUpdate[] = "program = ?";
    $params[] = $data['program'];
}

if (isset($data['section'])) {
    $fieldsToUpdate[] = "section = ?";
    $params[] = $data['section'];
}

if (isset($data['year'])) {
    $fieldsToUpdate[] = "year = ?";
    $params[] = $data['year'];
}

if (isset($data['password']) && !empty($data['password'])) {
    $fieldsToUpdate[] = "password = ?";
    $params[] = password_hash($data['password'], PASSWORD_BCRYPT);  // Hash the new password
}

if (isset($data['usertype'])) {
    $fieldsToUpdate[] = "usertype = ?";
    $params[] = $data['usertype'];
}

// If no fields to update, return an error
if (empty($fieldsToUpdate)) {
    echo json_encode(['status' => 'error', 'message' => 'No data to update']);
    exit();
}

// Join the fields to update and prepare the query
$query .= implode(", ", $fieldsToUpdate) . " WHERE id_number = ?";
$params[] = $data['id_number'];  // Add the id_number for the WHERE clause

// Prepare and execute the update query
try {
    $stmt = $conn->prepare($query);
    $stmt->bind_param(str_repeat("s", count($params)), ...$params);
    $stmt->execute();

    // Check if any rows were affected
    if ($stmt->affected_rows > 0) {
        echo json_encode(['status' => 'success', 'message' => 'Student updated successfully']);
    } else {
        echo json_encode(['status' => 'error', 'message' => 'No changes made or student not found']);
    }
} catch (Exception $e) {
    echo json_encode(['status' => 'error', 'message' => 'Error updating student: ' . $e->getMessage()]);
}

// Close the connection
$conn->close();
?>
