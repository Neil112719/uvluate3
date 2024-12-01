<?php
require 'database.php';
require 'cors.php';
require 'vendor/autoload.php'; // Autoload PHPMailer

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Set the default time zone
date_default_timezone_set('Asia/Manila'); // Adjust this to your local time zone

// Decode the incoming JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Check if id_number is provided
if (!isset($data['id_number'])) {
    echo json_encode(['success' => false, 'message' => 'ID number not provided']);
    exit;
}

$id_number = $data['id_number'];

// Check existing OTP and last sent time
$query = $conn->prepare("SELECT email, otp, otp_generated, last_sent FROM users WHERE id_number = ?");
$query->bind_param("s", $id_number);
$query->execute();
$result = $query->get_result();
$user = $result->fetch_assoc();

if ($user) {
    // Get the current time
    $currentTime = time();
    $formattedCurrentTime = date("Y-m-d H:i:s", $currentTime);
    $otpGeneratedTime = $user['otp_generated'] ? strtotime($user['otp_generated']) : null;
    $lastSentTime = $user['last_sent'] ? strtotime($user['last_sent']) : null;

    // Log current time, last_sent, and time differences for debugging
    error_log("Current Time: " . $formattedCurrentTime);
    error_log("Last Sent Time: " . ($lastSentTime !== null ? date("Y-m-d H:i:s", $lastSentTime) : 'NULL'));
    if ($lastSentTime !== null) {
        error_log("Time difference (seconds): " . ($currentTime - $lastSentTime));
    }

    // Check if 1-minute cooldown has passed
    if ($lastSentTime !== null && ($currentTime - $lastSentTime) < 60) {
        // Cooldown period has not expired
        echo json_encode(['success' => false, 'message' => 'You must wait at least 1 minute before requesting a new OTP.']);
        exit;
    }

    // Generate a new OTP or use an existing valid OTP
    if ($otpGeneratedTime !== null && ($currentTime - $otpGeneratedTime) < 300) { // OTP expires after 5 minutes
        // Resend existing OTP since it is still valid
        $otp = $user['otp'];
    } else {
        // Generate a new OTP since the previous one has expired or doesn't exist
        $otp = rand(100000, 999999);
        $updateQuery = $conn->prepare("UPDATE users SET otp = ?, otp_generated = NOW() WHERE id_number = ?");
        $updateQuery->bind_param("is", $otp, $id_number);
        if (!$updateQuery->execute()) {
            error_log("Failed to update OTP and OTP generated time: " . $conn->error);
            echo json_encode(['success' => false, 'message' => 'Failed to update OTP in the database']);
            exit;
        }
    }

    // Update last sent timestamp
    $updateLastSentQuery = $conn->prepare("UPDATE users SET last_sent = NOW() WHERE id_number = ?");
    if ($updateLastSentQuery) {
        $updateLastSentQuery->bind_param("s", $id_number);
        if (!$updateLastSentQuery->execute()) {
            error_log("Error updating last_sent: " . $conn->error);
            echo json_encode(['success' => false, 'message' => 'Failed to update last_sent timestamp']);
            exit;
        }
    } else {
        error_log("Error preparing last_sent update query: " . $conn->error);
    }

    // Send OTP using PHPMailer
    if (sendOtpEmail($user['email'], $otp)) {
        echo json_encode(['success' => true, 'message' => 'OTP sent successfully']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to send OTP email']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

function sendOtpEmail($email, $otp) {
    $mail = new PHPMailer(true);
    try {
        // Server settings
        $mail->SMTPDebug = 0; // Set to 0 for production, 2 or 3 for debugging
        $mail->Debugoutput = 'html'; // Output format for debugging

        // SMTP server configuration
        $mail->isSMTP();
        $mail->Host = 'smtp.gmail.com';
        $mail->SMTPAuth = true;
        $mail->Username = 'phantomantonneil@gmail.com'; // Gmail address
        $mail->Password = 'kqcm juio hkke txye'; // Use an app-specific password
        $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS; // Use SSL encryption
        $mail->Port = 465;

        // Set the sender and recipient details
        $mail->setFrom('phantomantonneil@gmail.com', 'UVluate');
        $mail->addAddress($email); // Add recipient

        // Content
        $mail->isHTML(true);
        $mail->Subject = 'Your OTP Code';
        $mail->Body    = "Your OTP code is <b>$otp</b>. It will expire in 5 minutes.";

        $mail->send();
        return true;
    } catch (Exception $e) {
        error_log("Mailer Error: " . $mail->ErrorInfo);
        return false;
    }
}

$conn->close();
?>
