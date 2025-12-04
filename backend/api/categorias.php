<?php
    header('Content-Type: application/json; charset=UTF-8');
    require_once __DIR__ . '/_cors.php';

    require_once '../config.php';
    require_once '../database.php';
    require_once '../modelo/categorias_modelo.php';
    require_once '../auth/jwt.php';
    require_once '../logger.php';

    $db = Database::getConnection();
    $modelo = new CategoriasModelo($db);

    $method = $_SERVER['REQUEST_METHOD'];

    if ($method === 'GET') {
        if (isset($_GET['id'])) {
            Logger::info('GET /categorias/' . $_GET['id'] . ' - Solicitado');
            $cat = $modelo->obtenerPorId((int)$_GET['id']);
            if ($cat === null) {
                http_response_code(404);
                Logger::warning('GET /categorias/' . $_GET['id'] . ' - No encontrado');
                echo json_encode(['error' => 'Categoria no encontrada']);
            } else {
                Logger::success('GET /categorias/' . $_GET['id'] . ' - Exitoso');
                echo json_encode($cat);
            }
        } else {
            $page = isset($_GET['page']) ? max(1, (int) $_GET['page']) : 1;
            $limit = isset($_GET['limit']) ? max(1, min(100, (int) $_GET['limit'])) : 10;
            $offset = ($page - 1) * $limit;
            Logger::info('GET /categorias - Listado solicitado (página ' . $page . ')');
            $data = $modelo->listarCategorias($limit, $offset);
            $total = $modelo->contarCategorias();
            Logger::success('GET /categorias - Listado exitoso, ' . count($data) . ' registros obtenidos');
            echo json_encode(['data' => $data, 'pagination' => ['total' => $total, 'limit' => $limit, 'offset' => $offset]]);
        }
    } elseif ($method === 'POST') {
        require_role_or_403(['admin', 'user']);
        Logger::info('POST /categorias - Solicitud recibida');
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input) || empty($input['nombre'])) {
            http_response_code(400);
            Logger::warning('POST /categorias - Datos inválidos');
            echo json_encode(['error' => 'JSON inválido o falta nombre']);
            exit;
        }
        $id = $modelo->crearCategoria($input);
        Logger::success('POST /categorias - Categoría creada con ID ' . $id);
        http_response_code(201);
        echo json_encode($modelo->obtenerPorId($id));
    } elseif ($method === 'PUT') {
        require_role_or_403(['admin']);
        Logger::info('PUT /categorias - Solicitud recibida');
        if (!isset($_GET['id'])) { 
            http_response_code(400); 
            Logger::warning('PUT /categorias - ID no proporcionado');
            echo json_encode(['error'=>'Falta id']); 
            exit; 
        }
        $id = (int)$_GET['id'];
        $existing = $modelo->obtenerPorId($id);
        if ($existing === null) { 
            http_response_code(404); 
            Logger::warning('PUT /categorias/' . $id . ' - No encontrado');
            echo json_encode(['error'=>'No encontrado']); 
            exit; 
        }
        $input = json_decode(file_get_contents('php://input'), true);
        if (!is_array($input)) { 
            http_response_code(400); 
            Logger::warning('PUT /categorias/' . $id . ' - JSON inválido');
            echo json_encode(['error'=>'JSON inválido']); 
            exit; 
        }
        $updated = $modelo->actualizarCategoria($id, $input);
        if ($updated) {
            Logger::success('PUT /categorias/' . $id . ' - Actualizado exitosamente');
            echo json_encode($modelo->obtenerPorId($id)); 
        } else { 
            http_response_code(304); 
            Logger::info('PUT /categorias/' . $id . ' - Sin cambios');
            echo json_encode(['message'=>'No changes']); 
        }
    } elseif ($method === 'DELETE') {
        require_role_or_403(['admin']);
        Logger::info('DELETE /categorias - Solicitud recibida');
        if (!isset($_GET['id'])) { 
            http_response_code(400); 
            Logger::warning('DELETE /categorias - ID no proporcionado');
            echo json_encode(['error'=>'Falta id']); 
            exit; 
        }
        $id = (int)$_GET['id'];
        $existing = $modelo->obtenerPorId($id);
        if ($existing === null) { 
            http_response_code(404); 
            Logger::warning('DELETE /categorias/' . $id . ' - No encontrado');
            echo json_encode(['error'=>'No encontrado']); 
            exit; 
        }
        $deleted = $modelo->eliminarCategoria($id);
        if ($deleted) { 
            Logger::success('DELETE /categorias/' . $id . ' - Eliminado exitosamente');
            http_response_code(204); 
        } else { 
            http_response_code(500); 
            Logger::error('DELETE /categorias/' . $id . ' - Error al eliminar');
            echo json_encode(['error'=>'No borrado']); 
        }
    } else {
        http_response_code(405);
        Logger::warning('Método HTTP ' . $method . ' no permitido en /categorias');
        echo json_encode(['error'=>'Método no permitido']);
    }
