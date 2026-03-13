<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Factura;
use App\Http\Resources\FacturaResource;
use Illuminate\Http\Request;

class FacturaController extends Controller
{
    public function index()
    {
        $facturas = Factura::with('cliente', 'user', 'detalles')->get();
        return FacturaResource::collection($facturas);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric',
            'status' => 'required|string|in:pending,paid,cancelled',
            'invoice_date' => 'required|date',
            'due_date' => 'nullable|date',
        ]);

        $factura = Factura::create($validated);

        return response()->json([
            'mensaje' => 'Factura creada con éxito',
            'data' => new FacturaResource($factura)
        ], 201);
    }

    public function show($id)
    {
        $factura = Factura::with('cliente', 'user', 'detalles')->find($id);
        if (!$factura) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return new FacturaResource($factura);
    }

    public function update(Request $request, $id)
    {
        $factura = Factura::find($id);
        if (!$factura) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $validated = $request->validate([
            'cliente_id' => 'required|exists:clientes,id',
            'user_id' => 'required|exists:users,id',
            'total_amount' => 'required|numeric',
            'status' => 'required|string|in:pending,paid,cancelled',
            'invoice_date' => 'required|date',
            'due_date' => 'nullable|date',
        ]);

        $factura->update($validated);

        return response()->json([
            'mensaje' => 'Factura actualizada con éxito',
            'data' => new FacturaResource($factura)
        ]);
    }

    public function destroy($id)
    {
        $factura = Factura::find($id);
        if (!$factura) {
            return response()->json(['error' => 'No encontrado'], 404);
        }

        $factura->delete();

        return response()->json(['mensaje' => 'Factura eliminada con éxito']);
    }
}
