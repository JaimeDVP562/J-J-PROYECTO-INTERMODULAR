<?php

class ProductosControlador
{
    private ProductosModelo $modelo;

    public function __construct(ProductosModelo $modelo)
    {
        $this->modelo = $modelo;
    }

    public function listarProductos(int $limit = 10, int $offset = 0, ?string $search = null, ?string $sort = null, ?string $order = null, ?int $proveedor = null): array
    {
        $productos = $this->modelo->obtenerProductos($limit, $offset, $search, $sort, $order, $proveedor);
        $total = $this->modelo->contarProductosFiltrados($search, $proveedor);

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

    // Return raw array of products (no pagination wrapper) for exports or nested endpoints
    public function buscarProductosRaw(int $limit = 10, int $offset = 0, ?string $search = null, ?string $sort = null, ?string $order = null, ?int $proveedor = null): array
    {
        return $this->modelo->obtenerProductos($limit, $offset, $search, $sort, $order, $proveedor);
    }
    public function verProducto(int $id): ?array
    {
        return $this->modelo->obtenerProductoPorId($id);
    }

    public function verProveedorPorProducto(int $id): ?string
    {
        return $this->modelo->proveedorPorProducto($id);
    }

    public function crearProducto(array $data): int
    {
        return $this->modelo->crearProducto($data);
    }

    public function actualizarProducto(int $id, array $data): bool
    {
        return $this->modelo->actualizarProducto($id, $data);
    }

    public function eliminarProducto(int $id): bool
    {
        return $this->modelo->eliminarProducto($id);
    }
}
