<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/_cors.php';

require_once '../config.php';
require_once '../auth/jwt.php';
require_once '../database.php';
require_once '../logger.php';

$BODY = json_decode(file_get_contents('php://input'), true);
if (!is_array($BODY) || empty($BODY['username']) || empty($BODY['password'])) {
    http_response_code(400);
    Logger::warning('Login fallido: datos incompletos para usuario ' . ($BODY['username'] ?? 'desconocido'));
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
            // Token payload: include id, email (we use username field here), and role
            $payload = [
                'sub' => (int)$user['id'],
                'email' => $user['username'],
                'role' => $user['role']
            ];
            // 1 hour expiration (60 * 60)
            $token = jwt_encode($payload, 60*60);
            Logger::success('Login exitoso para usuario: ' . $username . ' (rol: ' . $user['role'] . ')');
            echo json_encode(['token' => $token]);
            exit;
        } else {
            http_response_code(401);
            Logger::warning('Login fallido: credenciales inválidas para usuario ' . $username);
            echo json_encode(['error' => 'Credenciales inválidas']);
            exit;
        }
    }
} catch (Exception $e) {
    // ignore DB errors and fallback to demo credential
    Logger::error('Error en autenticación DB: ' . $e->getMessage());
}

// Fallback demo credentials (kept for backward compatibility)
    if ($username === 'admin' && $password === 'admin') {
    // Mirror the DB-backed token shape: sub (id), email (username) and role
    $token = jwt_encode(['sub' => 0, 'email' => 'admin', 'role' => 'admin'], 60*60);
    Logger::success('Login exitoso (fallback demo) para usuario: ' . $username);
    echo json_encode(['token' => $token]);
} else {
    http_response_code(401);
    Logger::warning('Login fallido: credenciales demo inválidas para usuario ' . $username);
    echo json_encode(['error' => 'Credenciales inválidas']);
}

?>

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
            // Token payload: include id, email (we use username field here), and role
            $payload = [
                'sub' => (int)$user['id'],
                'email' => $user['username'],
                'role' => $user['role']
            ];
            // 1 hour expiration (60 * 60)
            $token = jwt_encode($payload, 60*60);
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
    // Mirror the DB-backed token shape: sub (id), email (username) and role
    $token = jwt_encode(['sub' => 0, 'email' => 'admin', 'role' => 'admin'], 60*60);
    echo json_encode(['token' => $token]);
} else {
    http_response_code(401);
    echo json_encode(['error' => 'Credenciales inválidas']);
}

?>
