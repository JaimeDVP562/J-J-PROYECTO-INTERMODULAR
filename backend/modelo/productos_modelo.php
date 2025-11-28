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
}