<?php
// Include Composer autoloader and CORS handler
require '../../vendor/autoload.php'; // Adjust path as necessary
require '../../cors.php'; // Adjust path if needed

use MongoDB\Client;

// MongoDB connection settings
$uri = 'mongodb://localhost:27017';
$databaseName = 'uvluate';
$departmentCollection = 'departments';

// Create MongoDB client
$client = new Client($uri);
$database = $client->selectDatabase($databaseName);

// Access the department collection
$departmentCollection = $database->selectCollection($departmentCollection);

// Seeding data
$data = [
    "department" => [
        "name" => "COED",
        "programs" => [
            [
                "program_name" => "Engineering",
                "courses" => [
                    [
                        "code" => "EEEM2",
                        "course_name" => "Engineering Mechanics"
                    ],
                    [
                        "code" => "EESM2",
                        "course_name" => "Strength of Materials"
                    ]
                ]
            ],
            [
                "program_name" => "Mechanical",
                "courses" => [
                    [
                        "code" => "MEEM2",
                        "course_name" => "Engineering Mechanics"
                    ],
                    [
                        "code" => "MESM2",
                        "course_name" => "Strength of Materials"
                    ]
                ]
            ]
        ],
        "sections" => [
            [
                "section_name" => "Section A"
            ],
            [
                "section_name" => "Section B"
            ]
        ]
    ]
];

// Insert the data into the MongoDB collection
$result = $departmentCollection->insertOne($data['department']);

// Return a success or failure message
if ($result->getInsertedCount() > 0) {
    echo json_encode(["message" => "Department, Programs, Courses, and Sections added successfully."]);
} else {
    echo json_encode(["message" => "Failed to add department."]);
}
?>
