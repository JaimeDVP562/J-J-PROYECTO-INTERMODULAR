<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\CierreCaja;
use App\Models\Venta;
use Illuminate\Http\Request;

class CierreCajaController extends Controller
{
    private function isPrivileged($user): bool
    {
        return in_array($user->rol, ['admin', 'gerente']);
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $limit = (int) $request->query('limit', 10);
        $query = CierreCaja::with('user')->orderBy('fecha', 'desc');

        if (!$this->isPrivileged($user)) {
            $query->where('user_id', $user->id);
        }

        $cierres = $query->paginate($limit);

        if ($this->isPrivileged($user)) {
            $cierres->getCollection()->transform(function ($cierre) {
                $cierre->efectivo_esperado = (float) Venta::whereDate('fecha_venta', $cierre->fecha)
                    ->where('metodo_pago', 'efectivo')->sum('total');
                $cierre->tarjeta_esperada = (float) Venta::whereDate('fecha_venta', $cierre->fecha)
                    ->where('metodo_pago', 'tarjeta')->sum('total');
                return $cierre;
            });
        }

        return response()->json($cierres);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'fecha'              => 'required|date',
            'efectivo_retirado'  => 'required|numeric|min:0',
            'importe_datafono'   => 'required|numeric|min:0',
            'notas'              => 'nullable|string',
        ]);

        $totalVentas = Venta::whereDate('fecha_venta', $validated['fecha'])->sum('total');
        $diferencia  = ($validated['efectivo_retirado'] + $validated['importe_datafono']) - $totalVentas;

        $cierre = CierreCaja::create([
            ...$validated,
            'user_id'      => $request->user()->id,
            'total_ventas' => $totalVentas,
            'diferencia'   => $diferencia,
        ]);

        return response()->json(['data' => $cierre->load('user')], 201);
    }

    public function show($id)
    {
        $cierre = CierreCaja::with('user')->find($id);
        if (!$cierre) {
            return response()->json(['error' => 'No encontrado'], 404);
        }
        return response()->json($cierre);
    }

    public function totalHoy()
    {
        $total = Venta::whereDate('fecha_venta', today())->sum('total');
        return response()->json(['total_ventas_hoy' => $total, 'fecha' => today()->toDateString()]);
    }
}
