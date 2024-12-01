<?php
session_start();
require 'cors.php';
require 'database.php';

header('Content-Type: application/json');

// Decode the incoming request payload
$data = json_decode(file_get_contents("php://input"), true);

// Validate the input
if (!isset($data['id_number']) || !isset($data['otp'])) {
    echo json_encode(['success' => false, 'message' => 'ID number or OTP not provided']);
    exit;
}

$id_number = $data['id_number'];
$otp = $data['otp'];

// Fetch the user record
$sql = "SELECT otp, otp_generated, usertype, fname, mname, lname, suffix FROM users WHERE id_number = ?";
$stmt = $conn->prepare($sql);
$stmt->bind_param("s", $id_number);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows > 0) {
    $user = $result->fetch_assoc();

    // Validate OTP within 5 minutes
    $currentTime = new DateTime();
    $otpGeneratedTime = new DateTime($user['otp_generated']);
    $timeDifference = $currentTime->getTimestamp() - $otpGeneratedTime->getTimestamp();

    if ((int)$user['otp'] === (int)$otp && $timeDifference <= 300) {
        // Use the PHPSESSID as the session token
        $session_token = session_id(); // Get the PHPSESSID value

        // Store the session token in both session and database
        $_SESSION['id_number'] = $id_number;
        $_SESSION['session_token'] = $session_token;

        $updateQuery = $conn->prepare("UPDATE users SET session_token = ? WHERE id_number = ?");
        $updateQuery->bind_param("ss", $session_token, $id_number);
        $updateQuery->execute();

        // Return success response with session token
        $username = $user['fname'] . ' ' . ($user['mname'] ?? '') . ' ' . $user['lname'] . ' ' . ($user['suffix'] ?? '');
        echo json_encode([
            'success' => true,
            'message' => 'OTP verified successfully.',
            'usertype' => $user['usertype'],
            'username' => trim($username),
            'id_number' => $id_number,
            'session_token' => $session_token // Return PHPSESSID to the frontend
        ]);
    } else {
        echo json_encode(['success' => false, 'message' => 'Invalid or expired OTP']);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'User not found']);
}

$conn->close();
?>
