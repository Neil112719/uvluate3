<?php
require 'cors.php'; // Include CORS headers to avoid CORS issues
require 'database.php'; // Include database connection

header('Content-Type: application/json');

// Decode the incoming JSON data
$data = json_decode(file_get_contents('php://input'), true);

// Extract the fields from request data
$id_number = $data['id_number'];
$fname = $data['fname'];
$lname = $data['lname'];
$mname = isset($data['mname']) ? $data['mname'] : null; // Optional field
$suffix = isset($data['suffix']) ? $data['suffix'] : null; // Optional field
$email = $data['email'];
$department = $data['department'];
$usertype = $data['usertype'];
$password = isset($data['password']) ? $data['password'] : null; // Optional field, only for updating if provided

// Validate the required fields
if (empty($id_number) || empty($fname) || empty($lname) || empty($email) || empty($department) || empty($usertype)) {
    echo json_encode(['success' => false, 'message' => 'Required fields are missing.']);
    exit;
}

try {
    // Prepare the update SQL query dynamically
    $updateFields = [
        'fname' => $fname,
        'lname' => $lname,
        'email' => $email,
        'department' => $department,
        'usertype' => $usertype,
    ];

    if (!empty($mname)) {
        $updateFields['mname'] = $mname;
    }
    if (!empty($suffix)) {
        $updateFields['suffix'] = $suffix;
    }
    if (!empty($password)) {
        // Hash the password before updating
        $hashed_password = password_hash($password, PASSWORD_BCRYPT);
        $updateFields['password'] = $hashed_password;
    }

    // Construct the SQL query with placeholders
    $setFields = [];
    foreach ($updateFields as $key => $value) {
        $setFields[] = "$key = ?";
    }

    $sql = "UPDATE users SET " . implode(", ", $setFields) . " WHERE id_number = ?";
    $stmt = $conn->prepare($sql);

    if (!$stmt) {
        throw new Exception("Prepare statement failed: " . $conn->error);
    }

    // Create an array of parameters for binding
    $types = str_repeat('s', count($updateFields)) . 's'; // All fields are strings
    $params = array_values($updateFields);
    $params[] = $id_number;

    // Bind the parameters dynamically
    $stmt->bind_param($types, ...$params);

    // Execute the statement
    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Faculty member updated successfully.']);
    } else {
        throw new Exception("Execute failed: " . $stmt->error);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . $e->getMessage()]);
}

$conn->close();
?>
