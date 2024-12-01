<?php
// Include CORS headers to handle cross-origin requests
require '../../../cors.php';

// Include the database connection
require '../../../database.php';

// Set the appropriate headers for credentials and JSON response
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] == 'POST') {

    // Get the raw POST data (as JSON)
    $inputData = json_decode(file_get_contents('php://input'), true);

    // Sanitize input data
    $fname = filter_var($inputData['fname'], FILTER_SANITIZE_STRING);
    $lname = filter_var($inputData['lname'], FILTER_SANITIZE_STRING);
    $mname = filter_var($inputData['mname'], FILTER_SANITIZE_STRING);
    $suffix = filter_var($inputData['suffix'], FILTER_SANITIZE_STRING);
    $id_number = filter_var($inputData['id_number'], FILTER_SANITIZE_STRING);
    $email = filter_var($inputData['email'], FILTER_SANITIZE_EMAIL);
    $department = filter_var($inputData['department'], FILTER_SANITIZE_NUMBER_INT);
    $program = filter_var($inputData['program'], FILTER_SANITIZE_NUMBER_INT);
    $section = filter_var($inputData['section'], FILTER_SANITIZE_NUMBER_INT);
    $year = filter_var($inputData['year'], FILTER_SANITIZE_NUMBER_INT);
    $password = filter_var($inputData['password'], FILTER_SANITIZE_STRING); // password should be auto-generated

    // Validation (basic example)
    if (empty($fname) || empty($lname) || empty($id_number) || empty($email) || empty($department) || empty($program) || empty($section) || empty($year)) {
        echo json_encode(['error' => 'All fields are required']);
        exit();
    }

    // Hash the password (use stronger hashing like bcrypt in real applications)
    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    // Prepare the SQL query to insert the student data into the database
    $query = "INSERT INTO users (fname, mname, lname, suffix, id_number, email, department, program, section, year, password, usertype) 
              VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    // Assuming '5' is the usertype for a student
    $usertype = 5; // Set to 5 for a student

    if ($stmt = $conn->prepare($query)) {
        // Bind parameters to the query
        $stmt->bind_param("ssssssssiiis", $fname, $mname, $lname, $suffix, $id_number, $email, $department, $program, $section, $year, $hashedPassword, $usertype);

        // Execute the query
        if ($stmt->execute()) {
            echo json_encode(['success' => 'Student registered successfully']);
        } else {
            echo json_encode(['error' => 'Failed to register student. Please try again.']);
        }

        // Close the prepared statement
        $stmt->close();
    } else {
        echo json_encode(['error' => 'Database error: Unable to prepare statement']);
    }

    // Close the database connection
    $conn->close();

} else {
    // Invalid request method
    echo json_encode(['error' => 'Invalid request method']);
}
?>
