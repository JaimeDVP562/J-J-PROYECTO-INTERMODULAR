<?php

class ProveedoresModelo {
    private PDO $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function obtenerProveedores(int $limit = 10, int $offset = 0): array {
        $sql = "SELECT * FROM proveedor ORDER BY nombre LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function contarProveedores(): int {
        $sql = "SELECT COUNT(*) as total FROM proveedor";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);
        
        return (int) $result['total'];
    }

    public function obtenerProveedorPorId(int $id): ?array {
        $sql = "SELECT * FROM proveedor WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        $proveedor = $stmt->fetch();
        return $proveedor ?: null;
    }
}
