<?php
// Include MongoDB Composer autoloader
require '../../vendor/autoload.php'; // Adjust path as necessary
require '../../cors.php'; // Adjust path if needed
// MongoDB connection settings
$uri = 'mongodb://localhost:27017';
$databaseName = 'uvluate';
$departmentCollection = 'departments';

// Create MongoDB client
$client = new MongoDB\Client($uri);
$database = $client->selectDatabase($databaseName);

// Access the department collection
$departmentCollection = $database->selectCollection($departmentCollection);

// Set the response header to JSON
header('Content-Type: application/json');

// Fetch all departments from MongoDB
$departments = $departmentCollection->find()->toArray();

// Prepare data structure to return
$departmentsData = [];

foreach ($departments as $department) {
    $departmentsData[] = [
        'id' => $department['id'],
        'name' => $department['name'],
        'programs' => $department['programs'],  // Assuming each department contains a 'programs' array
        'sections' => $department['sections']   // Assuming each department contains a 'sections' array
    ];
}

// Return the department data as JSON
echo json_encode($departmentsData);

?>
