<?php
require '../../vendor/autoload.php';
require '../../cors.php';
require '../../database.php';
require './debugger,php';
use MongoDB\Client;

// Start the session
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// Set content type to JSON
header('Content-Type: application/json');

// Decode the incoming JSON payload
$data = json_decode(file_get_contents('php://input'), true);

// Debugging: Log incoming data
error_log('Received payload: ' . print_r($data, true));

// Validate the incoming data
if (!isset($data['department_name']) || !isset($data['password'])) {
    error_log('Missing required fields in payload');
    echo json_encode([
        'success' => false,
        'message' => 'Missing required fields',
        'provided_fields' => array_keys($data),
    ]);
    exit;
}

$department_name = htmlspecialchars($data['department_name'], ENT_QUOTES, 'UTF-8');
$password = $data['password'];

// Debugging: Check session data
if (!isset($_SESSION['id_number'])) {
    error_log('Session not found or expired');
    echo json_encode([
        'success' => false,
        'message' => 'Session not found or expired',
        'session_id' => session_id(),
        'session_data' => $_SESSION,
    ]);
    exit;
}

$id_number = $_SESSION['id_number'];

// Debugging: Check MongoDB connection
try {
    $client = new Client('mongodb://localhost:27017');
    $collection = $client->uvluate->departments;
    error_log('MongoDB connection successful');
} catch (Exception $e) {
    error_log('MongoDB connection error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database connection failed',
        'error' => $e->getMessage(),
    ]);
    exit;
}

// Debugging: Validate user credentials
try {
    $query = "SELECT * FROM users WHERE id_number = ? AND usertype = '1'";
    $stmt = $pdo->prepare($query);
    $stmt->execute([$id_number]);
    $user = $stmt->fetch();

    if (!$user || !password_verify($password, $user['password'])) {
        error_log('Invalid credentials for user ID: ' . $id_number);
        echo json_encode([
            'success' => false,
            'message' => 'Invalid credentials',
        ]);
        exit;
    }
    error_log('User credentials validated successfully for ID: ' . $id_number);
} catch (Exception $e) {
    error_log('SQL error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Database query failed',
        'error' => $e->getMessage(),
    ]);
    exit;
}

// Add the new department
try {
    $newDepartment = ['name' => $department_name, 'programs' => []];
    $result = $collection->insertOne($newDepartment);

    if ($result->getInsertedCount() > 0) {
        error_log('Department added successfully: ' . $department_name);
        echo json_encode([
            'success' => true,
            'message' => 'Department added successfully',
            'department_name' => $department_name,
        ]);
    } else {
        error_log('Failed to insert department: ' . $department_name);
        echo json_encode([
            'success' => false,
            'message' => 'Failed to add department',
        ]);
    }
} catch (Exception $e) {
    error_log('MongoDB insertion error: ' . $e->getMessage());
    echo json_encode([
        'success' => false,
        'message' => 'Failed to add department',
        'error' => $e->getMessage(),
    ]);
}
?>
