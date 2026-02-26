<?php

namespace Database\Seeders;

use App\Models\Venta;
use App\Models\User;
use App\Models\Producto;
use App\Models\DetalleVenta;
use Illuminate\Database\Seeder;

class VentaSeeder extends Seeder
{
    public function run(): void
    {
        $users = User::where('rol', 'vendedor')->get();
        $productos = Producto::all();

        if ($users->isEmpty() || $productos->isEmpty()) {
            return;
        }

        foreach (range(1, 12) as $i) {
            $user = $users->random();

            $venta = Venta::create([
                'user_id' => $user->id,
                'total' => 0,
                'fecha_venta' => now()->subDays(rand(0, 30))->toDateTimeString(),
                'metodo_pago' => rand(0, 1) ? 'tarjeta' : 'efectivo',
            ]);

            $total = 0;
            $count = rand(1, 4);
            for ($j = 0; $j < $count; $j++) {
                $prod = $productos->random();
                $cantidad = rand(1, 3);
                $precio = $prod->precio;
                $subtotal = $cantidad * $precio;

                DetalleVenta::create([
                    'venta_id' => $venta->id,
                    'producto_id' => $prod->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precio,
                    'subtotal' => $subtotal,
                ]);

                $total += $subtotal;
            }

            $venta->update(['total' => $total]);
        }
    }
}
