<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\DetalleVenta;
use App\Models\Producto;
use App\Http\Resources\VentaResource;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class VentaController extends Controller
{
    private function isPrivileged($user): bool
    {
        return in_array($user->rol, ['admin', 'gerente']);
    }

    public function index(Request $request)
    {
        $query = Venta::with('user', 'cliente', 'detalles.producto', 'devolucion')
            ->orderBy('fecha_venta', 'desc');

        // Pagos a proveedor solo visibles para admin y gerente
        if (!$this->isPrivileged($request->user())) {
            $query->where('tipo', 'venta');
        }

        return VentaResource::collection($query->get());
    }

    /**
     * POS: crear venta con líneas de producto y descontar stock.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id'              => 'nullable|exists:clientes,id',
            'metodo_pago'             => 'required|in:efectivo,tarjeta,mixto',
            'notas'                   => 'nullable|string|max:500',
            'items'                   => 'required|array|min:1',
            'items.*.producto_id'     => 'required|exists:productos,id',
            'items.*.cantidad'        => 'required|integer|min:1',
            'items.*.precio_unitario' => 'required|numeric|min:0',
        ]);

        $venta = null;

        DB::transaction(function () use ($validated, $request, &$venta) {
            $total = collect($validated['items'])->sum(
                fn($i) => $i['cantidad'] * $i['precio_unitario']
            );

            $venta = Venta::create([
                'user_id'     => $request->user()->id,
                'cliente_id'  => $validated['cliente_id'] ?? null,
                'total'       => $total,
                'fecha_venta' => now(),
                'metodo_pago' => $validated['metodo_pago'],
                'notas'       => $validated['notas'] ?? null,
                'devuelta'    => false,
                'tipo'        => 'venta',
            ]);

            foreach ($validated['items'] as $item) {
                $producto = Producto::lockForUpdate()->findOrFail($item['producto_id']);

                if ($producto->stock_quantity < $item['cantidad']) {
                    throw new \Exception("Stock insuficiente para '{$producto->nombre}'");
                }

                DetalleVenta::create([
                    'venta_id'        => $venta->id,
                    'producto_id'     => $item['producto_id'],
                    'cantidad'        => $item['cantidad'],
                    'precio_unitario' => $item['precio_unitario'],
                    'subtotal'        => $item['cantidad'] * $item['precio_unitario'],
                ]);

                $producto->decrement('stock_quantity', $item['cantidad']);
            }
        });

        return response()->json(
            new VentaResource($venta->load('user', 'cliente', 'detalles.producto')),
            201
        );
    }

    /**
     * Pago a proveedor: registra importe negativo. Solo admin/gerente.
     */
    public function pagoProveedor(Request $request)
    {
        if (!$this->isPrivileged($request->user())) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'proveedor_id' => 'nullable|exists:proveedores,id',
            'importe'      => 'required|numeric|min:0.01',
            'concepto'     => 'required|string|max:255',
            'metodo_pago'  => 'required|in:efectivo,tarjeta,mixto',
        ]);

        $venta = Venta::create([
            'user_id'     => $request->user()->id,
            'total'       => -abs($validated['importe']),
            'fecha_venta' => now(),
            'metodo_pago' => $validated['metodo_pago'],
            'notas'       => isset($validated['proveedor_id']) ? 'Proveedor ID: ' . $validated['proveedor_id'] : null,
            'concepto'    => $validated['concepto'],
            'tipo'        => 'pago_proveedor',
            'devuelta'    => false,
        ]);

        return response()->json(new VentaResource($venta->load('user')), 201);
    }

    /**
     * Ventas del usuario actual para hoy (excluye pagos a proveedor).
     */
    public function misHoy(Request $request)
    {
        $ventas = Venta::where('user_id', $request->user()->id)
            ->whereDate('fecha_venta', today())
            ->where('tipo', 'venta')
            ->get();

        return VentaResource::collection($ventas);
    }

    public function show($id)
    {
        $venta = Venta::with('user', 'cliente', 'detalles.producto', 'devolucion')->find($id);
        if (!$venta) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new VentaResource($venta);
    }

    public function update(Request $request, $id)
    {
        $venta = Venta::find($id);
        if (!$venta) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'metodo_pago' => 'sometimes|in:efectivo,tarjeta,mixto',
            'notas'       => 'nullable|string|max:500',
        ]);

        $venta->update($validated);

        return response()->json(['mensaje' => 'Venta actualizada', 'data' => new VentaResource($venta)]);
    }

    public function destroy($id)
    {
        $venta = Venta::find($id);
        if (!$venta) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $venta->delete();

        return response()->json(['mensaje' => 'Venta eliminada']);
    }
}
