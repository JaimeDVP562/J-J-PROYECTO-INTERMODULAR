<?php
// Logger simple para registrar operaciones
class Logger {
    private static $logFile = __DIR__ . '/../logs/api.log';
    
    public static function init() {
        $logsDir = __DIR__ . '/../logs';
        if (!is_dir($logsDir)) {
            mkdir($logsDir, 0755, true);
        }
    }
    
    public static function log($message, $level = 'INFO') {
        self::init();
        $timestamp = date('Y-m-d H:i:s');
        $method = $_SERVER['REQUEST_METHOD'] ?? 'CLI';
        $endpoint = $_SERVER['REQUEST_URI'] ?? 'N/A';
        $ip = $_SERVER['REMOTE_ADDR'] ?? 'N/A';
        
        $logEntry = "[$timestamp] [$level] [$method $endpoint] [$ip] $message" . PHP_EOL;
        
        file_put_contents(self::$logFile, $logEntry, FILE_APPEND);
    }
    
    public static function info($message) {
        self::log($message, 'INFO');
    }
    
    public static function warning($message) {
        self::log($message, 'WARNING');
    }
    
    public static function error($message) {
        self::log($message, 'ERROR');
    }
    
    public static function success($message) {
        self::log($message, 'SUCCESS');
    }
}
?>
