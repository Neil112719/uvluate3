<?php
require 'database.php';
require 'cors.php';

header('Content-Type: application/json');

// Get the data from the POST request
$data = json_decode(file_get_contents('php://input'), true);

$id_number = $data['id_number'];
$fname = $data['fname'];
$lname = $data['lname'];
$mname = !empty($data['mname']) ? $data['mname'] : null;
$suffix = !empty($data['suffix']) ? $data['suffix'] : null;
$email = $data['email'];
$department = !empty($data['department']) ? intval($data['department']) : null; // Department is expected as an integer
$program = $data['program'];
$section = $data['section'];
$year = intval($data['year']);
$usertype = $data['usertype'] ?? 5;

// Validate required fields
if (empty($id_number) || empty($fname) || empty($lname) || empty($email) || empty($department) || empty($program) || empty($section) || empty($year)) {
    echo json_encode(['success' => false, 'message' => 'All required fields must be provided.']);
    exit;
}

// Insert into database
try {
    $stmt = $conn->prepare("INSERT INTO users (id_number, fname, lname, mname, suffix, email, department, program, section, year, usertype) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)");
    $stmt->bind_param("sssssssssis", $id_number, $fname, $lname, $mname, $suffix, $email, $department, $program, $section, $year, $usertype);

    if ($stmt->execute()) {
        echo json_encode(['success' => true, 'message' => 'Student created successfully.']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to create student.']);
    }

    $stmt->close();
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error creating student: ' . $e->getMessage()]);
}

$conn->close();
?>
