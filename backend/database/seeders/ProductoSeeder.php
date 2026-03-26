<?php

namespace Database\Seeders;

use App\Models\Producto;
use App\Models\Proveedor;
use App\Models\Categoria;
use Illuminate\Database\Seeder;

class ProductoSeeder extends Seeder
{
    public function run(): void
    {
        $proveedores = Proveedor::all();
        $categorias = Categoria::all();

        if ($proveedores->isEmpty() || $categorias->isEmpty()) {
            return;
        }

        $items = [
            ['nombre' => 'Pintura blanca satinado', 'descripcion' => 'Pintura interior blanca, acabado satinado', 'precio' => 25.50, 'stock_quantity' => 50, 'categoria' => 'Interior'],
            ['nombre' => 'Pintura exterior resistente', 'descripcion' => 'Pintura para exteriores, alta resistencia', 'precio' => 35.00, 'stock_quantity' => 40, 'categoria' => 'Exterior'],
            ['nombre' => 'Imprimacion universal', 'descripcion' => 'Imprimación para todo tipo de superficies', 'precio' => 18.75, 'stock_quantity' => 100, 'categoria' => 'Imprimacion'],
            ['nombre' => 'Barniz transparente', 'descripcion' => 'Barniz protector alto brillo', 'precio' => 22.00, 'stock_quantity' => 60, 'categoria' => 'Barniz'],
            ['nombre' => 'Pintura decorativa texturada', 'descripcion' => 'Efecto texturado para decoración', 'precio' => 45.00, 'stock_quantity' => 20, 'categoria' => 'Decorativa'],
        ];

        foreach ($items as $item) {
            // pick a proveedor at random
            $proveedor = $proveedores->random();
            $categoria = $categorias->firstWhere('nombre', $item['categoria']);

            Producto::create([
                'nombre' => $item['nombre'],
                'descripcion' => $item['descripcion'],
                'precio' => $item['precio'],
                'stock_quantity' => $item['stock_quantity'],
                'categoria_id' => $categoria ? $categoria->id : null,
                'proveedor_id' => $proveedor->id,
            ]);
        }

        // add some more random products
        foreach (range(1, 10) as $i) {
            $proveedor = $proveedores->random();
            $categoria = $categorias->random();
            Producto::create([
                'nombre' => "Producto extra $i",
                'descripcion' => 'Descripcion generica',
                'precio' => rand(10, 100),
                'stock_quantity' => rand(5, 200),
                'categoria_id' => $categoria->id,
                'proveedor_id' => $proveedor->id,
            ]);
        }
    }
}
