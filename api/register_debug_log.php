<?php
// Simple debug endpoint for registration issues
// Usage: POST to /roomsyncapp/api/?route=auth/register-debug (temporary)

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type');
header('Content-Type: application/json');

require_once __DIR__ . '/config.php';

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit();
}

$route = explode('/', trim($_GET['route'] ?? '', '/'));
$action = $route[0] ?? null;
$id = $route[1] ?? null;

if ($action !== 'auth' || $id !== 'register-debug') {
  echo json_encode(['success'=>false,'message'=>'Invalid route']);
  exit;
}

$input = json_decode(file_get_contents('php://input'), true);

try {
  $required = ['firstName','lastName','email','password','phone','studentId','course','yearLevel'];
  $missing = [];
  foreach ($required as $f) {
    if (empty($input[$f])) $missing[] = $f;
  }

  $emailOk = isset($input['email']) && filter_var($input['email'], FILTER_VALIDATE_EMAIL);

  $response = [
    'success' => true,
    'received' => $input,
    'missing' => $missing,
    'emailValid' => $emailOk,
    'yearLevelType' => isset($input['yearLevel']) ? gettype($input['yearLevel']) : null,
    'yearLevelValue' => $input['yearLevel'] ?? null,
  ];

  echo json_encode($response);
} catch (Throwable $e) {
  echo json_encode(['success'=>false,'message'=>$e->getMessage()]);
}

