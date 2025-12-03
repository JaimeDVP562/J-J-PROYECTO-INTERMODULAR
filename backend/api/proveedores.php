<?php
    header('Content-Type: application/json; charset=UTF-8');
    header('Access-Control-Allow-Origin: *');
    header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
    header('Access-Control-Allow-Headers: Content-Type');

    require_once '../config.php';
    require_once '../database.php';
    require_once '../modelo/proveedores_modelo.php';
    require_once '../controlador/proveedores_controlador.php';
    require_once '../auth/jwt.php';

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
    } elseif ($method === 'POST') {
        // Require JWT for write operations
        require_jwt_or_401();
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }
        $errors = [];
        if (empty($input['nombre'])) $errors[] = 'El campo nombre es obligatorio.';
        if (!empty($errors)) {
            http_response_code(400);
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
        http_response_code(201);
        echo json_encode($controlador->verProveedor($id));

    } elseif ($method === 'PUT') {
        require_jwt_or_401();
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta parámetro id en la query string.']);
            exit;
        }
        $id = (int) $_GET['id'];
        $existing = $controlador->verProveedor($id);
        if ($existing === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Proveedor no encontrado']);
            exit;
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido']);
            exit;
        }
        $data = array_merge($existing, $input);
        $updated = $controlador->actualizarProveedor($id, $data);
        if ($updated) {
            echo json_encode($controlador->verProveedor($id));
        } else {
            http_response_code(304);
            echo json_encode(['message' => 'No se realizaron cambios.']);
        }

    } elseif ($method === 'DELETE') {
        require_jwt_or_401();
        if (!isset($_GET['id'])) {
            http_response_code(400);
            echo json_encode(['error' => 'Falta parámetro id en la query string.']);
            exit;
        }
        $id = (int) $_GET['id'];
        $existing = $controlador->verProveedor($id);
        if ($existing === null) {
            http_response_code(404);
            echo json_encode(['error' => 'Proveedor no encontrado']);
            exit;
        }
        $deleted = $controlador->eliminarProveedor($id);
        if ($deleted) {
            http_response_code(204);
        } else {
            http_response_code(500);
            echo json_encode(['error' => 'No se pudo eliminar el proveedor']);
        }

    } else {
        http_response_code(405);
        echo json_encode(['error' => 'Método no permitido']);
    }
