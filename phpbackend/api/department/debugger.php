<?php
// Enable error reporting for development
ini_set('display_errors', 1); // Display errors in the browser
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

// Set a custom error log file
$logFile = '..\..\debug\php_error.log';
ini_set('log_errors', 1);
ini_set('error_log', $logFile);

// Test error logging
error_log("Custom error logging is set up.");
?>