<?php

class ProductosModelo {
    private PDO $db;

    public function __construct($db) {
        $this->db = $db;
    }

    public function obtenerProductos(): array {
        $sql ="SELECT * FROM productos";
        $stmt = $this->db->prepare($sql);
        $stmt ->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        return $stmt->fetchAll();
    }

    public function obtenerProductoPorId(int $id): ?array {
        $sql = "SELECT * FROM productos WHERE idProducto = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt ->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();

        $producto = $stmt->fetch();
        return $producto ?: null;
    }

    public function proveedorPorProducto(int $id): ?string {
        $sql = "SELECT pr.nombreProveedor
                FROM proveedor pr
                JOIN productos p ON pr.idProveedor = p.proveedor
                WHERE p.idProducto = :id";
        $stmt = $this->db->prepare($sql);
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();

        $nombre = $stmt->fetchColumn();
        return $nombre !== false ? $nombre : null;
    }
}