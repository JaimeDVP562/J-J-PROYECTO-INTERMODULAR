<?php
    header('Content-Type: application/json; charset=UTF-8');
    require_once __DIR__ . '/_cors.php';

    require_once '../config.php';
    require_once '../database.php';
    require_once '../modelo/proveedores_modelo.php';
    require_once '../controlador/proveedores_controlador.php';
    require_once '../modelo/productos_modelo.php';
    require_once '../controlador/productos_controlador.php';
    require_once '../auth/jwt.php';
    require_once '../logger.php';

    $db = Database::getConnection();
    $modelo = new ProveedoresModelo($db);
    $controlador = new ProveedoresControlador($modelo);
    $productosModelo = new ProductosModelo($db);
    $productosControlador = new ProductosControlador($productosModelo);

    $method = $_SERVER['REQUEST_METHOD'];

    // Detectar si es endpoint anidado: /api/proveedores/{id}/productos
    // Soporta tanto la variante basada en query `?productos=1&id=...` como
    // rutas RESTful si el servidor deja PATH_INFO o la URL contiene
    // `/proveedores/{id}/productos` (útil con rewrite rules).
    $isProductosEndpoint = isset($_GET['productos']) && $_GET['productos'] === '1';

    if (!$isProductosEndpoint) {
        // Intentar detectar vía PATH_INFO (p.ej. /proveedores.php/3/productos)
        $pathInfo = $_SERVER['PATH_INFO'] ?? null;
        $requestUri = $_SERVER['REQUEST_URI'] ?? '';
        $nestedId = null;

        if ($pathInfo) {
            if (preg_match('#/?(\d+)/productos#', $pathInfo, $m)) {
                $nestedId = (int)$m[1];
            }
        }

        if ($nestedId === null) {
            // Buscar patrones en REQUEST_URI como /api/proveedores/3/productos
            if (preg_match('#/api/proveedores/(\d+)/productos#', $requestUri, $m)) {
                $nestedId = (int)$m[1];
            } elseif (preg_match('#/proveedores/(\d+)/productos#', $requestUri, $m)) {
                $nestedId = (int)$m[1];
            }
        }

        if ($nestedId !== null) {
            // Normalizar a los parámetros esperados por la lógica existente
            $_GET['id'] = $nestedId;
            $_GET['productos'] = '1';
            $isProductosEndpoint = true;
        }
    }
    
    if ($method == 'GET') {
        if ($isProductosEndpoint && isset($_GET['id'])) {
            // GET /api/proveedores/{id}/productos - endpoint anidado
            Logger::info('GET /proveedores/' . $_GET['id'] . '/productos - Solicitado');
            $proveedorId = (int) $_GET['id'];
            
            // Verificar que el proveedor existe
            $proveedor = $controlador->verProveedor($proveedorId);
            if ($proveedor === null) {
                http_response_code(404);
                Logger::warning('GET /proveedores/' . $proveedorId . '/productos - Proveedor no encontrado');
                echo json_encode(['error' => 'Proveedor no encontrado']);
                exit;
            }
            
            // Paginación
            $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 10;
            $offset = ($page - 1) * $limit;
            
            // Obtener productos del proveedor
            $productos = $productosModelo->obtenerProductosPorProveedor($proveedorId, $limit, $offset);
            $total = $productosModelo->contarProductosPorProveedor($proveedorId);
            
            $result = [
                'data' => $productos,
                'pagination' => [
                    'total' => $total,
                    'limit' => $limit,
                    'offset' => $offset,
                    'page' => $page,
                    'totalPages' => (int) ceil($total / $limit)
                ],
                'proveedor' => $proveedor
            ];
            
            Logger::success('GET /proveedores/' . $proveedorId . '/productos - Exitoso, ' . count($productos) . ' productos obtenidos');
            echo json_encode($result);
        } elseif (isset($_GET['id'])) {
            // Single proveedor by id
            Logger::info('GET /proveedores/' . $_GET['id'] . ' - Solicitado');
            $proveedor = $controlador->verProveedor((int) $_GET['id']);
            if ($proveedor === null) {
                http_response_code(404);
                Logger::warning('GET /proveedores/' . $_GET['id'] . ' - No encontrado');
            } else {
                Logger::success('GET /proveedores/' . $_GET['id'] . ' - Exitoso');
            }
            echo json_encode($proveedor);
        } else {
            // All proveedores con paginación
            $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 10;
            $offset = ($page - 1) * $limit;
            
            Logger::info('GET /proveedores - Listado solicitado (página ' . $page . ')');
            $result = $controlador->listarProveedores($limit, $offset);
            Logger::success('GET /proveedores - Listado exitoso, ' . count($result['data']) . ' registros obtenidos');
            echo json_encode($result);
        }
    } elseif ($method === 'POST') {
        // Require admin or user role for write operations
        require_role_or_403(['admin', 'user']);
        Logger::info('POST /proveedores - Solicitud recibida');
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(400);
            Logger::warning('POST /proveedores - JSON inválido');
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }
        $errors = [];
        if (empty($input['nombre'])) $errors[] = 'El campo nombre es obligatorio.';
        if (!empty($errors)) {
            http_response_code(400);
            Logger::warning('POST /proveedores - Validación fallida: ' . implode(', ', $errors));
            echo json_encode(['errors' => $errors]);
            exit;
        }
        $data = [
            'nombre' => $input['nombre'],
            'telefono' => $input['telefono'] ?? null,
            'email' => $input['email'] ?? null,
            'direccion' => $input['direccion'] ?? null
        ];
        $id = $controlador->crearProveedor($data);
        Logger::success('POST /proveedores - Proveedor creado con ID ' . $id);
        http_response_code(201);
        echo json_encode($controlador->verProveedor($id));

    } elseif ($method === 'PUT') {
        require_role_or_403(['admin']);
        Logger::info('PUT /proveedores - Solicitud recibida');
        if (!isset($_GET['id'])) {
            http_response_code(400);
            Logger::warning('PUT /proveedores - ID no proporcionado');
            echo json_encode(['error' => 'Falta parámetro id en la query string.']);
            exit;
        }
        $id = (int) $_GET['id'];
        $existing = $controlador->verProveedor($id);
        if ($existing === null) {
            http_response_code(404);
            Logger::warning('PUT /proveedores/' . $id . ' - No encontrado');
            echo json_encode(['error' => 'Proveedor no encontrado']);
            exit;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(400);
            Logger::warning('PUT /proveedores/' . $id . ' - JSON inválido');
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }
        $data = array_merge($existing, $input);
        $updated = $controlador->actualizarProveedor($id, $data);
        if ($updated) {
            Logger::success('PUT /proveedores/' . $id . ' - Actualizado exitosamente');
            echo json_encode($controlador->verProveedor($id));
        } else {
            http_response_code(304);
            Logger::info('PUT /proveedores/' . $id . ' - Sin cambios');
            echo json_encode(['message' => 'No se realizaron cambios.']);
        }

    } elseif ($method === 'DELETE') {
        require_role_or_403(['admin']);
        Logger::info('DELETE /proveedores - Solicitud recibida');
        if (!isset($_GET['id'])) {
            http_response_code(400);
            Logger::warning('DELETE /proveedores - ID no proporcionado');
            echo json_encode(['error' => 'Falta parámetro id en la query string.']);
            exit;
        }
        $id = (int) $_GET['id'];
        $existing = $controlador->verProveedor($id);
        if ($existing === null) {
            http_response_code(404);
            Logger::warning('DELETE /proveedores/' . $id . ' - No encontrado');
            echo json_encode(['error' => 'Proveedor no encontrado']);
            exit;
        }
        $deleted = $controlador->eliminarProveedor($id);
        if ($deleted) {
            Logger::success('DELETE /proveedores/' . $id . ' - Eliminado exitosamente');
            http_response_code(204);
        } else {
            http_response_code(500);
            Logger::error('DELETE /proveedores/' . $id . ' - Error al eliminar');
            echo json_encode(['error' => 'No se pudo eliminar el proveedor']);
        }

    } else {
        http_response_code(405);
        Logger::warning('Método HTTP ' . $method . ' no permitido en /proveedores');
        echo json_encode(['error' => 'Método no permitido']);
    }

?>
