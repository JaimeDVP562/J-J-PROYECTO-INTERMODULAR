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
    require_once '../logger.php';

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
            Logger::info('GET /productos/' . $_GET['id'] . '?include=proveedor - Solicitado');
            $nombre = $controlador->verProveedorPorProducto((int) $_GET['id']);
            if ($nombre === null) {
                http_response_code(404);
                Logger::warning('GET /productos/' . $_GET['id'] . '?include=proveedor - Proveedor no encontrado');
                echo json_encode(['error' => 'Proveedor no encontrado para el producto indicado']);
            } else {
                Logger::success('GET /productos/' . $_GET['id'] . '?include=proveedor - Exitoso');
                echo json_encode(['proveedor' => $nombre]);
            }
        } elseif (isset($_GET['id'])) {
            // Recupera el producto con el id indicado
            Logger::info('GET /productos/' . $_GET['id'] . ' - Solicitado');
            $producto = $controlador->verProducto((int) $_GET['id']);
            if ($producto === null) {
                http_response_code(404);
                Logger::warning('GET /productos/' . $_GET['id'] . ' - No encontrado');
                echo json_encode(['error' => 'Producto no encontrado']);
            } else {
                Logger::success('GET /productos/' . $_GET['id'] . ' - Exitoso');
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
                    Logger::info('GET /productos?export=' . $format . ' - Exportación solicitada');
                    // fetch all matching (no pagination)
                    $rows = $controlador->buscarProductosRaw(1000000, 0, $search, $sort, $order, $proveedorFilter);
                    if ($format === 'csv') {
                        Logger::success('GET /productos - Exportación CSV exitosa');
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
                        Logger::success('GET /productos - Exportación JSON exitosa');
                        header('Content-Type: application/json; charset=UTF-8');
                        echo json_encode(['data' => $rows]);
                        exit;
                    }
                }

                $searchInfo = $search ? ' (búsqueda: "' . $search . '")' : '';
                Logger::info('GET /productos - Listado solicitado (página ' . $page . ')' . $searchInfo);
                $result = $controlador->listarProductos($limit, $offset, $search, $sort, $order, $proveedorFilter);
                Logger::success('GET /productos - Listado exitoso, ' . count($result['data']) . ' registros obtenidos');
                echo json_encode($result);
        }

    } elseif ($method === 'POST') {
        // Require admin or user role for write operations
        $payload = require_role_or_403(['admin', 'user']);
        Logger::info('POST /productos - Solicitud recibida');
        // Crear producto
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(400);
            Logger::warning('POST /productos - JSON inválido');
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
            Logger::warning('POST /productos - Validación fallida: ' . implode(', ', $errors));
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
        Logger::success('POST /productos - Producto creado con ID ' . $nuevoId);
        http_response_code(201);
        echo json_encode($producto);

    } elseif ($method === 'PUT') {
        // Require admin role for write operations
        $payload = require_role_or_403(['admin']);
        Logger::info('PUT /productos - Solicitud recibida');
        // Actualizar producto (id por query ?id=)
        if (!isset($_GET['id'])) {
            http_response_code(400);
            Logger::warning('PUT /productos - ID no proporcionado');
            echo json_encode(['error' => 'Falta parámetro id en la query string.']);
            exit;
        }
        $id = (int) $_GET['id'];
        $existing = $controlador->verProducto($id);
        if ($existing === null) {
            http_response_code(404);
            Logger::warning('PUT /productos/' . $id . ' - No encontrado');
            echo json_encode(['error' => 'Producto no encontrado']);
            exit;
        }

        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(400);
            Logger::warning('PUT /productos/' . $id . ' - JSON inválido');
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
            Logger::warning('PUT /productos/' . $id . ' - Validación fallida: ' . implode(', ', $errors));
            echo json_encode(['errors' => $errors]);
            exit;
        }

        // Merge existing with provided fields to ensure required fields exist
        $data = array_merge($existing, $input);
        $updated = $controlador->actualizarProducto($id, $data);
        if ($updated) {
            Logger::success('PUT /productos/' . $id . ' - Actualizado exitosamente');
            $producto = $controlador->verProducto($id);
            echo json_encode($producto);
        } else {
            http_response_code(304);
            Logger::info('PUT /productos/' . $id . ' - Sin cambios');
            echo json_encode(['message' => 'No se realizaron cambios.']);
        }

    } elseif ($method === 'DELETE') {
        // Require admin role for write operations
        $payload = require_role_or_403(['admin']);
        Logger::info('DELETE /productos - Solicitud recibida');
        if (!isset($_GET['id'])) {
            http_response_code(400);
            Logger::warning('DELETE /productos - ID no proporcionado');
            echo json_encode(['error' => 'Falta parámetro id en la query string.']);
            exit;
        }
        $id = (int) $_GET['id'];
        $existing = $controlador->verProducto($id);
        if ($existing === null) {
            http_response_code(404);
            Logger::warning('DELETE /productos/' . $id . ' - No encontrado');
            echo json_encode(['error' => 'Producto no encontrado']);
            exit;
        }

        $deleted = $controlador->eliminarProducto($id);
        if ($deleted) {
            Logger::success('DELETE /productos/' . $id . ' - Eliminado exitosamente');
            http_response_code(204);
            // No content
        } else {
            http_response_code(500);
            Logger::error('DELETE /productos/' . $id . ' - Error al eliminar');
            echo json_encode(['error' => 'No se pudo eliminar el producto']);
        }

    } else {
        http_response_code(405);
        Logger::warning('Método HTTP ' . $method . ' no permitido en /productos');
        echo json_encode(['error' => 'Método no permitido']);
    }
