<?php
/**
 * Database Configuration
 * RoomSync API - Database Connection
 */

// Database credentials
define('DB_HOST', 'localhost');
define('DB_USER', 'root');
define('DB_PASS', '');
define('DB_NAME', 'roomsync_db');
define('DB_PORT', 3306);

// Create connection
$conn = new mysqli(DB_HOST, DB_USER, DB_PASS, DB_NAME, DB_PORT);

// Check connection
if ($conn->connect_error) {
    die(json_encode([
        'success' => false,
        'error' => 'Database connection failed',
        'message' => $conn->connect_error
    ]));
}

// Set charset to UTF-8
$conn->set_charset("utf8mb4");

// Enable error reporting for development
mysqli_report(MYSQLI_REPORT_ERROR | MYSQLI_REPORT_STRICT);

// Helper function to send JSON response
function sendResponse($success, $data = null, $error = null, $message = null) {
    $response = [
        'success' => $success
    ];
    
    if ($data !== null) {
        $response['data'] = $data;
    }
    
    if ($error !== null) {
        $response['error'] = $error;
    }
    
    if ($message !== null) {
        $response['message'] = $message;
    }
    
    header('Content-Type: application/json');
    echo json_encode($response);
    exit();
}

// Helper function to handle errors
function handleError($exception) {
    sendResponse(false, null, 'Database Error', $exception->getMessage());
}
?>
