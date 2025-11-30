<?php
header('Content-Type: application/json; charset=UTF-8');
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST');
header('Access-Control-Allow-Headers: Content-Type');

require_once '../config.php';
require_once '../auth/jwt.php';
require_once '../database.php';

$BODY = json_decode(file_get_contents('php://input'), true);
if (!is_array($BODY) || empty($BODY['username']) || empty($BODY['password'])) {
    http_response_code(400);
    echo json_encode(['error' => 'JSON inválido o faltan credenciales']);
    exit;
}

$username = $BODY['username'];
$password = $BODY['password'];

// Try DB-backed users first (if table exists)
try {
    $db = Database::getConnection();
    $stmt = $db->prepare('SELECT id, username, password_hash, role FROM users WHERE username = :u LIMIT 1');
    $stmt->execute([':u' => $username]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
        // Accept modern PHP password_hash() values via password_verify.
        // Additionally accept MD5-hashed passwords as a fallback for quick
        // classroom/dev imports (the schema.sql includes an MD5 example).
        $isValid = false;
        if (password_verify($password, $user['password_hash'])) {
            $isValid = true;
        } elseif (strlen($user['password_hash']) === 32 && md5($password) === $user['password_hash']) {
            // legacy/dev MD5 match
            $isValid = true;
        }

        if ($isValid) {
            $payload = ['sub' => $user['username'], 'role' => $user['role']];
            $token = jwt_encode($payload, 60*60*4);
            echo json_encode(['token' => $token]);
            exit;
        } else {
            http_response_code(401);
            echo json_encode(['error' => 'Credenciales inválidas']);
            exit;
        }
    }
} catch (Exception $e) {
    // ignore DB errors and fallback to demo credential
}

// Fallback demo credentials (kept for backward compatibility)
if ($username === 'admin' && $password === 'admin') {
    $token = jwt_encode(['sub' => 'admin', 'role' => 'admin'], 60*60*4);
    echo json_encode(['token' => $token]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas']);
}

?>
