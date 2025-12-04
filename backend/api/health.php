<?php
header('Content-Type: application/json; charset=UTF-8');
require_once __DIR__ . '/_cors.php';

require_once '../config.php';
require_once '../database.php';
require_once '../logger.php';

$method = $_SERVER['REQUEST_METHOD'];

if ($method === 'GET') {
    try {
        // Intentar conectar a la base de datos
        $db = Database::getConnection();
        $stmt = $db->query('SELECT 1');
        $dbStatus = $stmt ? 'healthy' : 'error';
        
        Logger::info('Health check realizado - Status: OK');
        
        http_response_code(200);
        echo json_encode([
            'status' => 'healthy',
            'timestamp' => date('c'),
            'database' => $dbStatus,
            'api_version' => '1.0.0',
            'environment' => 'production'
        ]);
    } catch (Exception $e) {
        Logger::error('Health check fallido: ' . $e->getMessage());
        
        http_response_code(503);
        echo json_encode([
            'status' => 'unhealthy',
            'timestamp' => date('c'),
            'database' => 'error',
            'error' => 'Database connection failed'
        ]);
    }
} else {
    http_response_code(405);
    echo json_encode(['error' => 'Método no permitido']);
}
?>
