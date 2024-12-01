<?php
require 'cors.php';
require 'database.php';

header('Content-Type: application/json');

// Query to get faculty members with usertype and department information
$sql = "SELECT id_number, fname, lname, mname, suffix, email, department, usertype FROM users WHERE usertype IN (2, 3, 4,6)";
$result = $conn->query($sql);

$faculty = [];

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        // Ensure the department and usertype are cast to integers
        $row['department'] = intval($row['department']);
        $row['usertype'] = intval($row['usertype']);

        // Append the row to the faculty array
        $faculty[] = $row;
    }

    echo json_encode(['success' => true, 'faculty' => $faculty]);
} else {
    echo json_encode(['success' => false, 'message' => 'No faculty members found.']);
}

$conn->close();
?>
