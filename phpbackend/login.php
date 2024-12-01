<?php
session_start();
require 'cors.php';
require 'database.php';
require 'vendor/autoload.php'; // Autoload PHPMailer
use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

// Decode the incoming JSON data
$data = json_decode(file_get_contents("php://input"), true);

// Check if id_number and password are provided
if (!isset($data['id_number']) || !isset($data['password'])) {
    echo json_encode(['status' => 'error', 'message' => 'ID number or password not provided']);
    exit;
}

$id_number = $data['id_number'];
$password = $data['password'];

// Prepare and execute the SQL query to find user
$sql = "SELECT * FROM users WHERE id_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $id_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Verify password
    if (password_verify($password, $user['password'])) {

        // Generate a new OTP for the user
        $otp = rand(100000, 999999);

        // Update OTP, OTP generation time, and last sent timestamp in the database
        $updateQuery = $conn->prepare("UPDATE users SET otp = ?, otp_generated = NOW(), last_sent = NOW() WHERE id_number = ?");
        $updateQuery->bind_param("is", $otp, $id_number);
        if (!$updateQuery->execute()) {
            echo json_encode(['status' => 'error', 'message' => 'Failed to update OTP in the database']);
            exit;
        }

        // Send OTP using PHPMailer
        $mail = new PHPMailer(true);
        try {
            $mail->isSMTP();
            $mail->Host = 'smtp.gmail.com';
            $mail->SMTPAuth = true;
            $mail->Username = 'phantomantonneil@gmail.com';
            $mail->Password = 'kqcm juio hkke txye'; // Use an app-specific password
            $mail->SMTPSecure = PHPMailer::ENCRYPTION_SMTPS;
            $mail->Port = 465;

            $mail->setFrom('phantomantonneil@gmail.com', 'UVluate');
            $mail->addAddress($user['email']);

            $mail->isHTML(true);
            $mail->Subject = 'Your OTP Code';
            $mail->Body = "Your OTP code is: <b>$otp</b>. It will expire in 5 minutes.";

            $mail->send();
            echo json_encode(['status' => 'otp_required']);
        } catch (Exception $e) {
            echo json_encode(['status' => 'mail_error', 'message' => $mail->ErrorInfo]);
        }
    } else {
        echo json_encode(['status' => 'invalid_credentials']);
    }
} else {
    echo json_encode(['status' => 'user_not_found']);
}

$conn->close();
?>
