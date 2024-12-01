<?php
    header("Access-Control-Allow-Origin: http://localhost:3000"); // Allow only requests from your frontend
    header("Access-Control-Allow-Credentials: true");
    header("Access-Control-Allow-Headers: Content-Type, Authorization");
    header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS"); // Allow necessary methods

    // Handle preflight OPTIONS request
    if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
        // Respond OK to preflight request
        header("HTTP/1.1 200 OK");
        exit;
    }
?>
