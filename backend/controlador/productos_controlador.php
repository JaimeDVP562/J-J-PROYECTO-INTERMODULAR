<?php

class ProductosControlador
{
    private ProductosModelo $modelo;

    public function __construct(ProductosModelo $modelo)
    {
        $this->modelo = $modelo;
    }

    public function listarProductos(int $limit = 10, int $offset = 0): array
    {
        $productos = $this->modelo->obtenerProductos($limit, $offset);
        $total = $this->modelo->contarProductos();

        return [
            'data' => $productos,
            'pagination' => [
                'total' => $total,
                'limit' => $limit,
                'offset' => $offset,
                'page' => (int) floor($offset / $limit) + 1,
                'totalPages' => (int) ceil($total / $limit)
            ]
        ];
    }
    public function verProducto(int $id): ?array
    {
        return $this->modelo->obtenerProductoPorId($id);
    }

    public function verProveedorPorProducto(int $id): ?string
    {
        return $this->modelo->proveedorPorProducto($id);
    }
}
