<?php

class ProveedoresControlador {
    private ProveedoresModelo $modelo;

    public function __construct(ProveedoresModelo $modelo) {
        $this->modelo = $modelo;
    }

    public function listarProveedores(int $limit = 10, int $offset = 0): array {
        $proveedores = $this->modelo->obtenerProveedores($limit, $offset);
        $total = $this->modelo->contarProveedores();
        
        return [
            'data' => $proveedores,
            'pagination' => [
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset,
                'page' => (int) floor($offset / $limit) + 1,
                'totalPages' => (int) ceil($total / $limit)
            ]
        ];
    }

    public function verProveedor(int $id): ?array {
        return $this->modelo->obtenerProveedorPorId($id);
    }

    public function crearProveedor(array $data): int {
        return $this->modelo->crearProveedor($data);
    }

    public function actualizarProveedor(int $id, array $data): bool {
        return $this->modelo->actualizarProveedor($id, $data);
    }

    public function eliminarProveedor(int $id): bool {
        return $this->modelo->eliminarProveedor($id);
    }
}
