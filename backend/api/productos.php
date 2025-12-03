<?php
    header('Content-Type: application/json; charset=UTF-8');
    require_once __DIR__ . '/_cors.php';

    require_once '../config.php';
    require_once '../database.php';
    require_once '../modelo/productos_modelo.php';
    require_once '../controlador/productos_controlador.php';
    require_once '../modelo/proveedores_modelo.php';
    require_once '../controlador/proveedores_controlador.php';
    require_once '../auth/jwt.php';

    $db = Database::getConnection();
    $modelo = new ProductosModelo($db);
    $controlador = new ProductosControlador($modelo);
    $proveedoresModelo = new ProveedoresModelo($db);
    $proveedoresControlador = new ProveedoresControlador($proveedoresModelo);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        // Soporta include=proveedor o includes=proveedor para obtener el nombre del proveedor del producto con el id indicado
        $includeParam = isset($_GET['include']) ? $_GET['include'] : (isset($_GET['includes']) ? $_GET['includes'] : null);

        if (isset($_GET['id']) && $includeParam === 'proveedor') {
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
            if ($producto === null) {
                http_response_code(404);
                echo json_encode(['error' => 'Producto no encontrado']);
            } else {
                echo json_encode($producto);
            }
        } else {
            // All products con paginación, búsqueda y ordenación
                $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
                $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 10;
                $offset = ($page - 1) * $limit;
                $search = isset($_GET['q']) ? trim($_GET['q']) : null;
                $sort = isset($_GET['sort']) ? $_GET['sort'] : null;
                $order = isset($_GET['order']) ? $_GET['order'] : null;
                $proveedorFilter = isset($_GET['proveedor']) ? (int)$_GET['proveedor'] : null;

                // Export if requested
                if (isset($_GET['export'])) {
                    $format = strtolower($_GET['export']);
                    // fetch all matching (no pagination)
                    $rows = $controlador->buscarProductosRaw(1000000, 0, $search, $sort, $order, $proveedorFilter);
                    if ($format === 'csv') {
                        header('Content-Type: text/csv');
                        header('Content-Disposition: attachment; filename="productos_export.csv"');
                        $out = fopen('php://output', 'w');
                        if (!empty($rows)) {
                            // header row
                            fputcsv($out, array_keys($rows[0]));
                            foreach ($rows as $r) fputcsv($out, $r);
                        }
                        fclose($out);
                        exit;
                    } else {
                        header('Content-Type: application/json; charset=UTF-8');
                        echo json_encode(['data' => $rows]);
                        exit;
                    }
                }

                $result = $controlador->listarProductos($limit, $offset, $search, $sort, $order, $proveedorFilter);
                echo json_encode($result);
        }

    } elseif ($method === 'POST') {
        // Require admin role for write operations
        $payload = require_role_or_403(['admin']);
        // Crear producto
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $errors = [];
        if (empty($input['nombre'])) {
            $errors[] = 'El campo nombre es obligatorio.';
        }
        if (isset($input['stock']) && (!is_numeric($input['stock']) || (int)$input['stock'] < 0)) {
            $errors[] = 'El stock debe ser un número entero >= 0.';
        }
        if (isset($input['precio']) && !is_numeric($input['precio'])) {
            $errors[] = 'El precio debe ser un número válido.';
        }
        if (isset($input['proveedor'])) {
            $prov = $proveedoresModelo->obtenerProveedorPorId((int)$input['proveedor']);
            if ($prov === null) {
                $errors[] = 'Proveedor indicado no existe.';
            }
        }

        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            exit;
        }

        $data = [
            'nombre' => $input['nombre'],
            'stock' => isset($input['stock']) ? (int)$input['stock'] : 0,
            'precio' => isset($input['precio']) ? $input['precio'] : 0.00,
            'proveedor' => isset($input['proveedor']) ? (int)$input['proveedor'] : null,
            'ubicacionAlmacen' => isset($input['ubicacionAlmacen']) ? $input['ubicacionAlmacen'] : null
        ];

        $nuevoId = $controlador->crearProducto($data);
        $producto = $controlador->verProducto($nuevoId);
        http_response_code(201);
        echo json_encode($producto);

    } elseif ($method === 'PUT') {
        // Require admin role for write operations
        $payload = require_role_or_403(['admin']);
        // Actualizar producto (id por query ?id=)
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta parámetro id en la query string.']);
            exit;
        }
        $id = (int) $_GET['id'];
        $existing = $controlador->verProducto($id);
        if ($existing === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Producto no encontrado']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }

        $errors = [];
        if (isset($input['stock']) && (!is_numeric($input['stock']) || (int)$input['stock'] < 0)) {
            $errors[] = 'El stock debe ser un número entero >= 0.';
        }
        if (isset($input['precio']) && !is_numeric($input['precio'])) {
            $errors[] = 'El precio debe ser un número válido.';
        }
        if (array_key_exists('proveedor', $input) && $input['proveedor'] !== null) {
            $prov = $proveedoresModelo->obtenerProveedorPorId((int)$input['proveedor']);
            if ($prov === null) {
                $errors[] = 'Proveedor indicado no existe.';
            }
        }

        if (!empty($errors)) {
            http_response_code(400);
            echo json_encode(['errors' => $errors]);
            exit;
        }

        // Merge existing with provided fields to ensure required fields exist
        $data = array_merge($existing, $input);
        $updated = $controlador->actualizarProducto($id, $data);
        if ($updated) {
            $producto = $controlador->verProducto($id);
            echo json_encode($producto);
        } else {
            http_response_code(304);
            echo json_encode(['message' => 'No se realizaron cambios.']);
        }

    } elseif ($method === 'DELETE') {
        // Require admin role for write operations
        $payload = require_role_or_403(['admin']);
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta parámetro id en la query string.']);
            exit;
        }
        $id = (int) $_GET['id'];
        $existing = $controlador->verProducto($id);
        if ($existing === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Producto no encontrado']);
            exit;
        }

        $deleted = $controlador->eliminarProducto($id);
        if ($deleted) {
            http_response_code(204);
            // No content
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo eliminar el producto']);
        }

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
