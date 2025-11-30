<?php

class ProductosModelo {
    private PDO $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function obtenerProductos(int $limit = 10, int $offset = 0): array {
        $sql = "SELECT * FROM productos LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function contarProductos(): int {
        $sql = "SELECT COUNT(*) as total FROM productos";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return (int) $result['total'];
    }

    public function obtenerProductoPorId(int $id): ?array {
        $sql = "SELECT * FROM productos WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt ->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        $producto = $stmt->fetch();
        return $producto ?: null;
    }

    public function proveedorPorProducto(int $id): ?string {
        $sql = "SELECT pr.nombre
                FROM proveedor pr
                JOIN productos p ON pr.id = p.proveedor
                WHERE p.id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $nombre = $stmt->fetchColumn();
        return $nombre !== false ? $nombre : null;
    }

    public function crearProducto(array $data): int {
        $sql = "INSERT INTO productos (nombre, stock, precio, proveedor, ubicacionAlmacen)
                VALUES (:nombre, :stock, :precio, :proveedor, :ubicacionAlmacen)";
        $stmt = $this->db->prepare($sql);

        $stmt->bindValue(':nombre', $data['nombre'], PDO::PARAM_STR);
        $stmt->bindValue(':stock', isset($data['stock']) ? (int)$data['stock'] : 0, PDO::PARAM_INT);
        $stmt->bindValue(':precio', isset($data['precio']) ? $data['precio'] : 0.00);
        $stmt->bindValue(':proveedor', isset($data['proveedor']) ? $data['proveedor'] : null, is_null($data['proveedor']) ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $stmt->bindValue(':ubicacionAlmacen', isset($data['ubicacionAlmacen']) ? $data['ubicacionAlmacen'] : null, PDO::PARAM_STR);

        $stmt->execute();
        return (int)$this->db->lastInsertId();
    }

    public function actualizarProducto(int $id, array $data): bool {
        $sql = "UPDATE productos SET nombre = :nombre, stock = :stock, precio = :precio, proveedor = :proveedor, ubicacionAlmacen = :ubicacionAlmacen WHERE id = :id";
        $stmt = $this->db->prepare($sql);

        $stmt->bindValue(':nombre', $data['nombre'], PDO::PARAM_STR);
        $stmt->bindValue(':stock', isset($data['stock']) ? (int)$data['stock'] : 0, PDO::PARAM_INT);
        $stmt->bindValue(':precio', isset($data['precio']) ? $data['precio'] : 0.00);
        $stmt->bindValue(':proveedor', array_key_exists('proveedor', $data) ? $data['proveedor'] : null, is_null($data['proveedor'] ?? null) ? PDO::PARAM_NULL : PDO::PARAM_INT);
        $stmt->bindValue(':ubicacionAlmacen', isset($data['ubicacionAlmacen']) ? $data['ubicacionAlmacen'] : null, PDO::PARAM_STR);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);

        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function eliminarProducto(int $id): bool {
        $sql = "DELETE FROM productos WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        return $stmt->rowCount() > 0;
    }
}