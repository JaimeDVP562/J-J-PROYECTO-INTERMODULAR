<?php
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type');

    require_once '../config.php';
    require_once '../database.php';
    require_once '../modelo/productos_modelo.php';
    require_once '../controlador/productos_controlador.php';

    $db = Database::getConnection();
    $modelo = new ProductosModelo($db);
    $controlador = new ProductosControlador($modelo);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'GET') {
        // Soporta includes=proveedor para obtener el nombre del proveedor del producto con el id indicado
        if (isset($_GET['id']) && isset($_GET['includes']) && $_GET['includes'] === 'proveedor') {
            $nombre = $controlador->verProveedorPorProducto((int) $_GET['id']);
            if ($nombre === null) {
                http_response_code(404);
                echo json_encode(['error' => 'Proveedor no encontrado para el producto indicado']);
            } else {
                echo json_encode(['proveedor' => $nombre]);
            }
        } elseif (isset($_GET['id'])) {
            // Recupera el producto con el id indicado
            $producto = $controlador->verProducto((int) $_GET['id']);
            echo json_encode($producto);
        } else {
            // All products con paginación
            $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 10;
            $offset = ($page - 1) * $limit;
            
            $result = $controlador->listarProductos($limit, $offset);
            echo json_encode($result);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
