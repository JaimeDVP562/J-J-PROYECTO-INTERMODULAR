<?php

namespace Database\Seeders;

use App\Models\Factura;
use App\Models\Cliente;
use App\Models\User;
use App\Models\Producto;
use App\Models\DetalleFactura;
use App\Models\Proveedor;
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

        $proveedores = Proveedor::all();

        // determine default series from empresa if available
        $empresa = \App\Models\Empresa::first();
        $defaultSeries = 'F';
        if ($empresa && is_array($empresa->extra) && array_key_exists('default_series', $empresa->extra)) {
            $defaultSeries = trim((string)$empresa->extra['default_series']);
            if ($defaultSeries === '') $defaultSeries = 'F';
        }

        // counters per series to ensure sequential numbers in seeded data
        $seriesCounters = [];

        foreach (range(1, 8) as $i) {
            $cliente = $clientes->random();
            $user = $users->random();
            $proveedor = $proveedores->isNotEmpty() ? $proveedores->random() : null;
            // choose series (for now use company default)
            $series = $defaultSeries;
            if (!isset($seriesCounters[$series])) {
                $last = Factura::where('series', $series)->max('number');
                $seriesCounters[$series] = $last === null ? 0 : (int)$last;
            }
            $nextNumber = ++$seriesCounters[$series];

            $factura = Factura::create([
                'cliente_id' => $cliente->id,
                'proveedor_id' => $proveedor?->id ?? null,
                'user_id' => $user->id,
                'series' => $series,
                'number' => $nextNumber,
                'total_amount' => 0,
                'gross_amount' => 0,
                'tax_amount' => 0,
                'tax_breakdown' => null,
                'verifactu' => null,
                'status' => 'pending',
                'invoice_date' => now()->subDays(rand(0, 30))->toDateString(),
                'due_date' => now()->addDays(rand(1, 30))->toDateString(),
            ]);

            $baseTotal = 0;
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

                $baseTotal += $subtotal;
            }

            // Calculate taxes (assume single VAT rate 21%)
            // $baseTotal already contains the sum of subtotals
            $taxRate = 0.21;
            $taxAmount = round($baseTotal * $taxRate, 2);
            $gross = $baseTotal;
            $finalTotal = round($gross + $taxAmount, 2);
            $taxBreakdown = [
                [
                    'type' => 'IVA',
                    'rate' => 21,
                    'base' => $baseTotal,
                    'quota' => $taxAmount,
                ],
            ];

            $factura->update([
                'gross_amount' => $gross,
                'tax_amount' => $taxAmount,
                'tax_breakdown' => $taxBreakdown,
                'total_amount' => $finalTotal,
                'status' => rand(0, 1) ? 'paid' : 'pending'
            ]);
        }
    }
}
