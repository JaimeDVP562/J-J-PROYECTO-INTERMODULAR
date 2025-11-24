<?php

    class ProductosControlador {
        private ProductosModelo $modelo;

        public function __construct(ProductosModelo $modelo) {
            $this->modelo = $modelo;
        }

        public function listarProductos(): array {
            return $this->modelo->getProducts();
        }

        public function verProducto(int $id): ?array {
            return $this->modelo->getProductByID($id);
        }
    }