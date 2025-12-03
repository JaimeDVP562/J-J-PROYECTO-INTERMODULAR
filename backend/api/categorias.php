<?php
    header('Content-Type: application/json; charset=UTF-8');
    require_once __DIR__ . '/_cors.php';

    require_once '../config.php';
    require_once '../database.php';
    require_once '../modelo/categorias_modelo.php';
    require_once '../auth/jwt.php';

    $db = Database::getConnection();
    $modelo = new CategoriasModelo($db);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            $cat = $modelo->obtenerPorId((int)$_GET['id']);
            if ($cat === null) {
                http_response_code(404);
                echo json_encode(['error' => 'Categoria no encontrada']);
            } else {
                echo json_encode($cat);
            }
        } else {
            $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 10;
            $offset = ($page - 1) * $limit;
            $data = $modelo->listarCategorias($limit, $offset);
            $total = $modelo->contarCategorias();
            echo json_encode(['data' => $data, 'pagination' => ['total' => $total, 'limit' => $limit, 'offset' => $offset]]);
        }
    } elseif ($method === 'POST') {
        require_role_or_403(['admin']);
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input) || empty($input['nombre'])) {
            http_response_code(400);
            echo json_encode(['error' => 'JSON inválido o falta nombre']);
            exit;
        }
        $id = $modelo->crearCategoria($input);
        http_response_code(201);
        echo json_encode($modelo->obtenerPorId($id));
    } elseif ($method === 'PUT') {
        require_role_or_403(['admin']);
        if (!isset($_GET['id'])) { http_response_code(400); echo json_encode(['error'=>'Falta id']); exit; }
        $id = (int)$_GET['id'];
        $existing = $modelo->obtenerPorId($id);
        if ($existing === null) { http_response_code(404); echo json_encode(['error'=>'No encontrado']); exit; }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) { http_response_code(400); echo json_encode(['error'=>'JSON inválido']); exit; }
        $updated = $modelo->actualizarCategoria($id, $input);
        if ($updated) echo json_encode($modelo->obtenerPorId($id)); else { http_response_code(304); echo json_encode(['message'=>'No changes']); }
    } elseif ($method === 'DELETE') {
        require_role_or_403(['admin']);
        if (!isset($_GET['id'])) { http_response_code(400); echo json_encode(['error'=>'Falta id']); exit; }
        $id = (int)$_GET['id'];
        $existing = $modelo->obtenerPorId($id);
        if ($existing === null) { http_response_code(404); echo json_encode(['error'=>'No encontrado']); exit; }
        $deleted = $modelo->eliminarCategoria($id);
        if ($deleted) { http_response_code(204); } else { http_response_code(500); echo json_encode(['error'=>'No borrado']); }
    } else {
        http_response_code(405);
        echo json_encode(['error'=>'Método no permitido']);
    }
