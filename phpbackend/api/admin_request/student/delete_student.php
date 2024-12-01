<?php
require '../../../cors.php'; // Include CORS headers to handle cross-origin requests
require '../../../database.php'; // Include the database connection

// Set the response header to JSON
header('Content-Type: application/json');

// Check if the request method is POST
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get the input data
    $input = json_decode(file_get_contents('php://input'), true);

    // Check if 'id_number' is provided
    if (isset($input['id_number'])) {
        $id_number = $input['id_number'];

        // Prepare the SQL DELETE query
        $query = "DELETE FROM users WHERE id_number = ?";
        $stmt = $conn->prepare($query);

        // Check if statement is prepared successfully
        if ($stmt) {
            // Bind parameters and execute
            $stmt->bind_param("s", $id_number);
            if ($stmt->execute()) {
                // Check if a record was deleted
                if ($stmt->affected_rows > 0) {
                    echo json_encode(['status' => 'success', 'message' => 'Student deleted successfully.']);
                } else {
                    echo json_encode(['status' => 'error', 'message' => 'Student not found.']);
                }
            } else {
                echo json_encode(['status' => 'error', 'message' => 'Failed to execute delete statement.']);
            }
            $stmt->close();
        } else {
            echo json_encode(['status' => 'error', 'message' => 'Failed to prepare the SQL query.']);
        }
    } else {
        echo json_encode(['status' => 'error', 'message' => 'Required field "id_number" is missing.']);
    }
} else {
    echo json_encode(['status' => 'error', 'message' => 'Invalid request method.']);
}

// Close the database connection
$conn->close();
?>
