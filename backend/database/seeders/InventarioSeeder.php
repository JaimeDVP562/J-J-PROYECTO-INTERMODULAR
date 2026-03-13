<?php

namespace Database\Seeders;

use App\Models\Inventario;
use App\Models\Producto;
use Illuminate\Database\Seeder;

class InventarioSeeder extends Seeder
{
    public function run(): void
    {
        $productos = Producto::all();

        foreach ($productos as $p) {
            Inventario::create([
                'producto_id' => $p->id,
                'cantidad_disponible' => max(0, $p->stock_quantity - rand(0, 5)),
                'cantidad_minima' => rand(0, 10),
                'ubicacion' => 'Almacén principal',
            ]);
        }
    }
}
