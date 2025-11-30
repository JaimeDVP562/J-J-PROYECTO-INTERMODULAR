<?php
// Simple JWT helper (HMAC SHA256). Minimal implementation for demo purposes.
require_once __DIR__ . '/../config.php';

function base64url_encode($data) {
    return rtrim(strtr(base64_encode($data), '+/', '-_'), '=');
}

function base64url_decode($data) {
    $pad = 4 - (strlen($data) % 4);
    if ($pad < 4) $data .= str_repeat('=', $pad);
    return base64_decode(strtr($data, '-_', '+/'));
}

function jwt_encode(array $payload, $exp_seconds = 3600) {
    $header = ['alg' => 'HS256', 'typ' => 'JWT'];
    $payload['iat'] = time();
    $payload['exp'] = time() + $exp_seconds;
    $segments = [];
    $segments[] = base64url_encode(json_encode($header));
    $segments[] = base64url_encode(json_encode($payload));
    $signing_input = implode('.', $segments);
    $signature = hash_hmac('sha256', $signing_input, JWT_SECRET, true);
    $segments[] = base64url_encode($signature);
    return implode('.', $segments);
}

function jwt_decode($jwt) {
    $parts = explode('.', $jwt);
    if (count($parts) !== 3) return false;
    list($b64header, $b64payload, $b64sig) = $parts;
    $header = json_decode(base64url_decode($b64header), true);
    $payload = json_decode(base64url_decode($b64payload), true);
    $signature = base64url_decode($b64sig);
    if (!$header || !$payload || !$signature) return false;
    if (empty($header['alg']) || $header['alg'] !== 'HS256') return false;
    $signing_input = $b64header . '.' . $b64payload;
    $expected = hash_hmac('sha256', $signing_input, JWT_SECRET, true);
    if (!hash_equals($expected, $signature)) return false;
    if (isset($payload['exp']) && time() > $payload['exp']) return false;
    return $payload;
}

function get_bearer_token() {
    $headers = null;
    if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    if (!$headers) return null;
    if (preg_match('/Bearer\s+(.*)$/i', $headers, $matches)) {
        return $matches[1];
    }
    return null;
}

function require_jwt_or_401() {
    $token = get_bearer_token();
    if (!$token) {
        http_response_code(401);
        echo json_encode(['error' => 'Authorization header missing']);
        exit;
    }
    $payload = jwt_decode($token);
    if (!$payload) {
        http_response_code(401);
        echo json_encode(['error' => 'Invalid or expired token']);
        exit;
    }
    return $payload;
}

?>
