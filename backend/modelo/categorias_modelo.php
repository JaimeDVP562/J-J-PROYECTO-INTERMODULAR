<?php

class CategoriasModelo {
    private PDO $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function listarCategorias(int $limit = 10, int $offset = 0): array {
        $sql = "SELECT * FROM categorias ORDER BY nombre LIMIT :limit OFFSET :offset";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':limit', $limit, PDO::PARAM_INT);
        $stmt->bindParam(':offset', $offset, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        return $stmt->fetchAll();
    }

    public function contarCategorias(): int {
        $sql = "SELECT COUNT(*) as total FROM categorias";
        $stmt = $this->db->prepare($sql);
        $stmt->execute();
        $r = $stmt->fetch(PDO::FETCH_ASSOC);
        return (int)$r['total'];
    }

    public function obtenerPorId(int $id): ?array {
        $sql = "SELECT * FROM categorias WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        $row = $stmt->fetch();
        return $row ?: null;
    }

    public function crearCategoria(array $data): int {
        $sql = "INSERT INTO categorias (nombre, descripcion) VALUES (:nombre, :descripcion)";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':nombre', $data['nombre'], PDO::PARAM_STR);
        $stmt->bindValue(':descripcion', $data['descripcion'] ?? null, PDO::PARAM_STR);
        $stmt->execute();
        return (int)$this->db->lastInsertId();
    }

    public function actualizarCategoria(int $id, array $data): bool {
        $sql = "UPDATE categorias SET nombre = :nombre, descripcion = :descripcion WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindValue(':nombre', $data['nombre'], PDO::PARAM_STR);
        $stmt->bindValue(':descripcion', $data['descripcion'] ?? null, PDO::PARAM_STR);
        $stmt->bindValue(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }

    public function eliminarCategoria(int $id): bool {
        $sql = "DELETE FROM categorias WHERE id = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        return $stmt->rowCount() > 0;
    }
}
