<?php
require 'database.php'; // Database connection
require 'cors.php'; // CORS settings

header('Content-Type: application/json');

// Query to get students with user type 5 or 7
$query = "SELECT id_number, fname, lname, mname, suffix, email, department, program, section, year, usertype FROM users WHERE usertype IN (5, 7)";

try {
    $result = $conn->query($query);

    if ($result->num_rows > 0) {
        $students = [];
        while ($row = $result->fetch_assoc()) {
            $students[] = $row;
        }
        echo json_encode(['success' => true, 'students' => $students]);
    } else {
        echo json_encode(['success' => false, 'message' => 'No students found.']);
    }
} catch (Exception $e) {
    echo json_encode(['success' => false, 'message' => 'Error fetching students: ' . $e->getMessage()]);
}

$conn->close();
?>
