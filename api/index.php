<?php
/**
 * RoomSync API - Dormitories Endpoint
 * Handles all dormitory-related requests
 */

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

// Handle preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

$request_method = $_SERVER['REQUEST_METHOD'];
$request_uri = explode('/', trim($_GET['route'] ?? '', '/'));
$action = $request_uri[0] ?? null;
$id = $request_uri[1] ?? null;

try {
    switch ($request_method) {
        case 'GET':
            if ($action === 'dormitories') {
                if ($id) {
                    getDormitoryById($conn, $id);
                } else {
                    getAllDormitories($conn);
                }
            } elseif ($action === 'rooms') {
                if ($id) {
                    getRoomsByDormitory($conn, $id);
                } else {
                    getAllRooms($conn);
                }
            } elseif ($action === 'amenities') {
                getAmenities($conn);
            } elseif ($action === 'owners') {
                getOwners($conn);
            } else {
                sendResponse(false, null, 'Invalid endpoint', 'Route not found');
            }
            break;

        case 'POST':
            if ($action === 'test-connection') {
                testDatabaseConnection($conn);
            } elseif ($action === 'auth' && $id === 'register') {
                registerStudent($conn);
            } elseif ($action === 'auth' && $id === 'login') {
                loginUser($conn);
            } elseif ($action === 'auth' && $id === 'register-debug') {
                // debug: echo what payload is received
                $input = json_decode(file_get_contents('php://input'), true);
                $required = ['firstName','lastName','email','password','phone','studentId','course','yearLevel'];
                $missing = [];
                foreach ($required as $f) {
                    if (empty($input[$f])) $missing[] = $f;
                }
                $emailOk = isset($input['email']) && filter_var($input['email'], FILTER_VALIDATE_EMAIL);

                $resp = [
                    'success' => true,
                    'received' => $input,
                    'missing' => $missing,
                    'emailValid' => $emailOk,
                    'yearLevelType' => isset($input['yearLevel']) ? gettype($input['yearLevel']) : null,
                    'yearLevelValue' => $input['yearLevel'] ?? null,
                ];

                header('Content-Type: application/json');
                echo json_encode($resp);
                exit();
            } else {
                sendResponse(false, null, 'Invalid endpoint', 'Route not found');
            }
            break;

        default:
            http_response_code(405);
            sendResponse(false, null, 'Method not allowed', 'HTTP ' . $request_method . ' not supported');
    }
} catch (Exception $e) {
    handleError($e);
}

/**
 * Get all dormitories with amenities
 */
function getAllDormitories($conn) {
    try {
        $includeAll = isset($_GET['all']) && $_GET['all'] === 'true';
        $query = "
            SELECT 
                d.*,
                o.first_name as owner_first_name,
                o.last_name as owner_last_name,
                o.phone as owner_phone,
                COUNT(DISTINCT a.amenity_id) as amenities_count,
                GROUP_CONCAT(a.name SEPARATOR ', ') as amenities
            FROM dormitories d
            LEFT JOIN users o ON d.owner_id = o.user_id
            LEFT JOIN dormitory_amenities da ON d.dormitory_id = da.dormitory_id
            LEFT JOIN amenities a ON da.amenity_id = a.amenity_id
            " . ($includeAll ? "" : "WHERE d.status = 'Active' AND d.registration_status = 'Verified'") . "
            GROUP BY d.dormitory_id
            ORDER BY d.created_at DESC
        ";

        $result = $conn->query($query);
        
        if (!$result) {
            throw new Exception("Query failed: " . $conn->error);
        }

        $dormitories = [];
        while ($row = $result->fetch_assoc()) {
            $row['images_json'] = $row['images_json'] ? json_decode($row['images_json'], true) : [];
            $row['amenities_list'] = $row['amenities'] ? explode(', ', $row['amenities']) : [];
            $dormitories[] = $row;
        }

        sendResponse(true, $dormitories);
    } catch (Exception $e) {
        handleError($e);
    }
}

/**
 * Get dormitory by ID with all details
 */
function getDormitoryById($conn, $dormitory_id) {
    try {
        $dormitory_id = intval($dormitory_id);

        // Get dormitory details
        $query = "
            SELECT 
                d.*,
                o.first_name as owner_first_name,
                o.last_name as owner_last_name,
                o.phone as owner_phone,
                o.email as owner_email,
                GROUP_CONCAT(a.name SEPARATOR ', ') as amenities
            FROM dormitories d
            LEFT JOIN users o ON d.owner_id = o.user_id
            LEFT JOIN dormitory_amenities da ON d.dormitory_id = da.dormitory_id
            LEFT JOIN amenities a ON da.amenity_id = a.amenity_id
            WHERE d.dormitory_id = ?
            GROUP BY d.dormitory_id
        ";

        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("i", $dormitory_id);
        $stmt->execute();
        $result = $stmt->get_result();

        if ($result->num_rows === 0) {
            sendResponse(false, null, 'Not found', 'Dormitory not found');
        }

        $dormitory = $result->fetch_assoc();
        $dormitory['images_json'] = $dormitory['images_json'] ? json_decode($dormitory['images_json'], true) : [];
        $dormitory['amenities_list'] = $dormitory['amenities'] ? explode(', ', $dormitory['amenities']) : [];

        // Get rooms
        $rooms_query = "
            SELECT r.*, 
                   COUNT(CASE WHEN t.is_active = TRUE THEN 1 END) as current_occupants
            FROM rooms r
            LEFT JOIN tenants t ON r.room_id = t.room_id
            WHERE r.dormitory_id = ?
            GROUP BY r.room_id
            ORDER BY r.room_number
        ";

        $rooms_stmt = $conn->prepare($rooms_query);
        $rooms_stmt->bind_param("i", $dormitory_id);
        $rooms_stmt->execute();
        $rooms_result = $rooms_stmt->get_result();

        $rooms = [];
        while ($room = $rooms_result->fetch_assoc()) {
            $room['images_json'] = $room['images_json'] ? json_decode($room['images_json'], true) : [];
            $rooms[] = $room;
        }

        $dormitory['rooms'] = $rooms;

        // Get reviews
        $reviews_query = "
            SELECT 
                rr.*,
                u.first_name,
                u.last_name
            FROM ratings_reviews rr
            LEFT JOIN users u ON rr.reviewer_id = u.user_id
            WHERE rr.dormitory_id = ? AND rr.is_approved = TRUE
            ORDER BY rr.posted_at DESC
            LIMIT 10
        ";

        $reviews_stmt = $conn->prepare($reviews_query);
        $reviews_stmt->bind_param("i", $dormitory_id);
        $reviews_stmt->execute();
        $reviews_result = $reviews_stmt->get_result();

        $reviews = [];
        while ($review = $reviews_result->fetch_assoc()) {
            $reviews[] = $review;
        }

        $dormitory['reviews'] = $reviews;

        sendResponse(true, $dormitory);
    } catch (Exception $e) {
        handleError($e);
    }
}

/**
 * Get all rooms by dormitory
 */
function getRoomsByDormitory($conn, $dormitory_id) {
    try {
        $dormitory_id = intval($dormitory_id);

        $query = "
            SELECT r.*, 
                   COUNT(CASE WHEN t.is_active = TRUE THEN 1 END) as current_occupants,
                   GROUP_CONCAT(CONCAT(t.name, '|', t.course, '|', t.year_level) SEPARATOR '||') as tenant_info
            FROM rooms r
            LEFT JOIN tenants t ON r.room_id = t.room_id
            WHERE r.dormitory_id = ?
            GROUP BY r.room_id
            ORDER BY r.room_number
        ";

        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("i", $dormitory_id);
        $stmt->execute();
        $result = $stmt->get_result();

        $rooms = [];
        while ($row = $result->fetch_assoc()) {
            $row['images_json'] = $row['images_json'] ? json_decode($row['images_json'], true) : [];
            $rooms[] = $row;
        }

        sendResponse(true, $rooms);
    } catch (Exception $e) {
        handleError($e);
    }
}

/**
 * Get all rooms
 */
function getAllRooms($conn) {
    try {
        $query = "
            SELECT r.*, 
                   d.name as dormitory_name,
                   COUNT(CASE WHEN t.is_active = TRUE THEN 1 END) as current_occupants
            FROM rooms r
            LEFT JOIN dormitories d ON r.dormitory_id = d.dormitory_id
            LEFT JOIN tenants t ON r.room_id = t.room_id
            WHERE r.room_status = 'Available'
            GROUP BY r.room_id
            ORDER BY r.dormitory_id, r.room_number
        ";

        $result = $conn->query($query);

        if (!$result) {
            throw new Exception("Query failed: " . $conn->error);
        }

        $rooms = [];
        while ($row = $result->fetch_assoc()) {
            $row['images_json'] = $row['images_json'] ? json_decode($row['images_json'], true) : [];
            $rooms[] = $row;
        }

        sendResponse(true, $rooms);
    } catch (Exception $e) {
        handleError($e);
    }
}

/**
 * Get all amenities
 */
function getAmenities($conn) {
    try {
        $query = "
            SELECT * FROM amenities 
            WHERE is_active = TRUE
            ORDER BY category, name
        ";

        $result = $conn->query($query);

        if (!$result) {
            throw new Exception("Query failed: " . $conn->error);
        }

        $amenities = [];
        while ($row = $result->fetch_assoc()) {
            $amenities[] = $row;
        }

        sendResponse(true, $amenities);
    } catch (Exception $e) {
        handleError($e);
    }
}

/**
 * Get all owners
 */
function getOwners($conn) {
    try {
        $query = "
            SELECT 
                u.user_id,
                u.first_name,
                u.last_name,
                u.email,
                u.phone,
                COALESCE(COUNT(d.dormitory_id), 0) as dormitories_count,
                u.created_at,
                u.updated_at
            FROM users u
            LEFT JOIN dormitories d ON u.user_id = d.owner_id
            WHERE u.role = 'owner'
            GROUP BY u.user_id
            ORDER BY u.created_at DESC
        ";

        $result = $conn->query($query);
        if (!$result) {
            throw new Exception("Query failed: " . $conn->error);
        }

        $owners = [];
        while ($row = $result->fetch_assoc()) {
            $row['name'] = trim($row['first_name'] . ' ' . $row['last_name']);
            $owners[] = $row;
        }

        sendResponse(true, $owners);
    } catch (Exception $e) {
        handleError($e);
    }
}

/**
 * Test database connection
 */
function testDatabaseConnection($conn) {
    try {
        $query = "
            SELECT 
                COUNT(*) as users_count,
                (SELECT COUNT(*) FROM dormitories) as dorms_count,
                (SELECT COUNT(*) FROM rooms) as rooms_count,
                (SELECT COUNT(*) FROM amenities) as amenities_count
            FROM users
        ";

        $result = $conn->query($query);

        if (!$result) {
            throw new Exception("Query failed: " . $conn->error);
        }

        $stats = $result->fetch_assoc();
        
        $test_data = [
            'connection' => 'success',
            'database' => DB_NAME,
            'host' => DB_HOST,
            'stats' => $stats,
            'timestamp' => date('Y-m-d H:i:s')
        ];

        sendResponse(true, $test_data, null, 'Database connection successful');
    } catch (Exception $e) {
        handleError($e);
    }
}

/**
 * Register new student
 */
function registerStudent($conn) {
    try {
        // Get POST data
        $input = json_decode(file_get_contents('php://input'), true);
        
        // Validate required fields
        $required = ['firstName', 'lastName', 'email', 'password', 'phone', 'studentId', 'course', 'yearLevel'];
        foreach ($required as $field) {
            if (empty($input[$field])) {
                sendResponse(false, null, 'Missing field: ' . $field, 'All fields are required');
                return;
            }
        }

        $firstName = trim($input['firstName']);
        $lastName = trim($input['lastName']);
        $email = trim($input['email']);
        $password = trim($input['password']);
        $phone = trim($input['phone']);
        $studentId = trim($input['studentId']);
        $course = trim($input['course']);
        $yearLevel = trim($input['yearLevel']);
        $profilePicture = $input['profilePicture'] ?? null;

        // Validate email format
        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(false, null, 'Invalid email format', 'Please provide a valid email address');
            return;
        }

        // Check if email already exists
        $check_query = "SELECT user_id FROM users WHERE email = ?";
        $check_stmt = $conn->prepare($check_query);
        if (!$check_stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $check_stmt->bind_param("s", $email);
        $check_stmt->execute();
        $result = $check_stmt->get_result();

        if ($result->num_rows > 0) {
            sendResponse(false, null, 'Email already registered', 'This email is already in use');
            return;
        }

        // Hash password
        $hashedPassword = password_hash($password, PASSWORD_BCRYPT);

        // Insert user (FORCE student role - never trust client payload)
        $insert_query = "
            INSERT INTO users (first_name, last_name, email, password_hash, phone, role, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, 'student', NOW(), NOW())
        ";

        $insert_stmt = $conn->prepare($insert_query);
        if (!$insert_stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $insert_stmt->bind_param("sssss", $firstName, $lastName, $email, $hashedPassword, $phone);
        
        if (!$insert_stmt->execute()) {
            throw new Exception("Execute failed: " . $conn->error);
        }

        $user_id = $conn->insert_id;

        // Insert student profile
        $profile_query = "
            INSERT INTO student_profiles (user_id, student_id_number, course, year_level, bio, created_at, updated_at)
            VALUES (?, ?, ?, ?, '', NOW(), NOW())
        ";

        $profile_stmt = $conn->prepare($profile_query);
        if (!$profile_stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $profile_stmt->bind_param("isss", $user_id, $studentId, $course, $yearLevel);
        
        if (!$profile_stmt->execute()) {
            throw new Exception("Execute failed: " . $conn->error);
        }

        $response_data = [
            'user_id' => $user_id,
            'email' => $email,
            'firstName' => $firstName,
            'lastName' => $lastName,
            'role' => 'student',
            'message' => 'Registration successful'
        ];

        sendResponse(true, $response_data, null, 'Student account created successfully');
        
    } catch (Exception $e) {
        handleError($e);
    }
}

/**
 * Login user by email/password
 */
function loginUser($conn) {
    try {
        $input = json_decode(file_get_contents('php://input'), true);
        if (!$input || empty($input['email']) || empty($input['password'])) {
            sendResponse(false, null, 'Email and password are required', 'Missing login credentials');
            return;
        }

        $email = trim($input['email']);
        $password = trim($input['password']);

        if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            sendResponse(false, null, 'Invalid email format', 'Please provide a valid email address');
            return;
        }

        $query = "SELECT user_id, first_name, last_name, email, password_hash, role FROM users WHERE email = ? LIMIT 1";
        $stmt = $conn->prepare($query);
        if (!$stmt) {
            throw new Exception("Prepare failed: " . $conn->error);
        }

        $stmt->bind_param("s", $email);
        $stmt->execute();
        $result = $stmt->get_result();

        if (!$result || $result->num_rows === 0) {
            sendResponse(false, null, 'Invalid credentials', 'Incorrect email or password');
            return;
        }

        $user = $result->fetch_assoc();
        if (!password_verify($password, $user['password_hash'])) {
            sendResponse(false, null, 'Invalid credentials', 'Incorrect email or password');
            return;
        }

        unset($user['password_hash']);

        $response_data = [
            'user_id' => $user['user_id'],
            'firstName' => $user['first_name'],
            'lastName' => $user['last_name'],
            'email' => $user['email'],
            'role' => $user['role'],
        ];

        sendResponse(true, $response_data, null, 'Login successful');
    } catch (Exception $e) {
        handleError($e);
    }
}

$conn->close();
?>
