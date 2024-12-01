<?php
require 'database.php'; // Include the database connection

// Define admin credentials
$id_number = 'Admin';
$plain_password = 'Admin';
$hashed_password = password_hash($plain_password, PASSWORD_BCRYPT);

// Check if the admin already exists
$query = "SELECT * FROM users WHERE id_number = ?";
$stmt = $conn->prepare($query);
$stmt->bind_param('s', $id_number);
$stmt->execute();
$result = $stmt->get_result();
$admin = $result->fetch_assoc();

if ($admin) {
    echo "Admin account already exists.";
} else {
    // Create the admin user
    $insertQuery = "INSERT INTO users (id_number, password, fname, lname, email, usertype) 
                    VALUES (?, ?, ?, ?, ?, ?)";
    $insertStmt = $conn->prepare($insertQuery);
    $fname = 'System';
    $lname = 'Admin';
    $email = 'antonneilandales18@gmail.com'; // Change this to a real email address if needed
    $usertype = 1; // Assuming 1 represents Admin

    $insertStmt->bind_param('sssssi', $id_number, $hashed_password, $fname, $lname, $email, $usertype);

    if ($insertStmt->execute()) {
        echo "Admin account created successfully.";
    } else {
        echo "Error creating admin account: " . $insertStmt->error;
    }

    $insertStmt->close();
}

// Close the connection
$conn->close();
?>
