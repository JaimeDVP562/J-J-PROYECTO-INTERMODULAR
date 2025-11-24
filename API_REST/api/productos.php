<?php
    header('Content-Type: application/json; charset=UTF-8');

    require_once '../config.php';
    require_once '../database.php';
    require_once '../modelo/productos_modelo.php';
    require_once '../controlador/productos_controlador.php';

    $db = Database::getConnection();
    $modelo = new ProductosModelo($db);
    $controlador = new ProductosControlador($modelo);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method == 'GET') {
        if (isset($_GET['id'])) {
            $producto = $controlador->verProducto((int) $_GET['id']);
            echo json_encode($producto);
        } else {
            $productos = $controlador->listarProductos();
            echo json_encode($productos);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
