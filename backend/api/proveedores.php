<?php
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type');

    require_once '../config.php';
    require_once '../database.php';
    require_once '../modelo/proveedores_modelo.php';
    require_once '../controlador/proveedores_controlador.php';

    $db = Database::getConnection();
    $modelo = new ProveedoresModelo($db);
    $controlador = new ProveedoresControlador($modelo);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'GET') {
        if (isset($_GET['id'])) {
            // Single proveedor by id
            $proveedor = $controlador->verProveedor((int) $_GET['id']);
            echo json_encode($proveedor);
        } else {
            // All proveedores con paginación
            $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 10;
            $offset = ($page - 1) * $limit;
            
            $result = $controlador->listarProveedores($limit, $offset);
            echo json_encode($result);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
