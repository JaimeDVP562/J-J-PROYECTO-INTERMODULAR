<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Producto;
use App\Models\Proveedor;

class ProductoSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $proveedores = Proveedor::all();
        if ($proveedores->count() === 0) {
            $this->command->warn('No hay proveedores en la base de datos. Ejecuta primero el seeder de proveedores.');
            return;
        }

        $productos = [
            [
                'nombre' => 'Portátil HP 15',
                'descripcion' => 'Portátil de 15 pulgadas, 8GB RAM, 512GB SSD.',
                'precio' => 599.99,
                'stock' => 10,
            ],
            [
                'nombre' => 'Monitor Samsung 24"',
                'descripcion' => 'Monitor LED FullHD de 24 pulgadas.',
                'precio' => 129.99,
                'stock' => 25,
            ],
            [
                'nombre' => 'Ratón Logitech M185',
                'descripcion' => 'Ratón inalámbrico compacto.',
                'precio' => 14.99,
                'stock' => 50,
            ],
            [
                'nombre' => 'Teclado Mecánico Redragon',
                'descripcion' => 'Teclado mecánico retroiluminado.',
                'precio' => 49.99,
                'stock' => 20,
            ],
        ];

        foreach ($productos as $producto) {
            $proveedor = $proveedores->random();
            Producto::create(array_merge($producto, [
                'proveedor_id' => $proveedor->id,
            ]));
        }
    }
}
