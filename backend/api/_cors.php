<?php
// Simple CORS helper for APIs in backend/api
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

// Handle preflight
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    // short-circuit for preflight requests
    http_response_code(200);
    exit;
}

?>
