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
        // Support includes=proveedor to fetch provider name for a product id
        if (isset($_GET['idProducto']) && isset($_GET['includes']) && $_GET['includes'] === 'proveedor') {
            $nombre = $controlador->verProveedorPorProducto((int) $_GET['idProducto']);
            if ($nombre === null) {
                http_response_code(404);
                echo json_encode(['error' => 'Proveedor no encontrado para el producto indicado']);
            } else {
                echo json_encode(['nombreProveedor' => $nombre]);
            }
        } elseif (isset($_GET['idProducto'])) {
            // Single product by id
            $producto = $controlador->verProducto((int) $_GET['idProducto']);
            echo json_encode($producto);
        } else {
            // All products
            $productos = $controlador->listarProductos();
            echo json_encode($productos);
        }
    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
