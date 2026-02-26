<?php

namespace Database\Seeders;

use App\Models\Factura;
use App\Models\Cliente;
use App\Models\User;
use App\Models\Producto;
use App\Models\DetalleFactura;
use Illuminate\Database\Seeder;

class FacturaSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = Cliente::all();
        $users = User::all();
        $productos = Producto::all();

        if ($clientes->isEmpty() || $users->isEmpty() || $productos->isEmpty()) {
            return;
        }

        foreach (range(1, 8) as $i) {
            $cliente = $clientes->random();
            $user = $users->random();

            $factura = Factura::create([
                'cliente_id' => $cliente->id,
                'user_id' => $user->id,
                'total_amount' => 0,
                'status' => 'pending',
                'invoice_date' => now()->subDays(rand(0, 30))->toDateString(),
                'due_date' => now()->addDays(rand(1, 30))->toDateString(),
            ]);

            $total = 0;
            $count = rand(1, 4);
            for ($j = 0; $j < $count; $j++) {
                $prod = $productos->random();
                $cantidad = rand(1, 5);
                $precio = $prod->precio;
                $subtotal = $cantidad * $precio;

                DetalleFactura::create([
                    'factura_id' => $factura->id,
                    'producto_id' => $prod->id,
                    'cantidad' => $cantidad,
                    'precio_unitario' => $precio,
                    'subtotal' => $subtotal,
                ]);

                $total += $subtotal;
            }

            $factura->update(['total_amount' => $total, 'status' => rand(0, 1) ? 'paid' : 'pending']);
        }
    }
}
