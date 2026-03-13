<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Venta;
use App\Models\Factura;
use App\Models\Devolucion;
use Illuminate\Http\Request;

class EstadisticasController extends Controller
{
    public function index(Request $request)
    {
        if (!in_array($request->user()->rol, ['admin', 'gerente'])) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $desde = $request->query('desde', now()->startOfMonth()->format('Y-m-d'));
        $hasta = $request->query('hasta', now()->format('Y-m-d'));

        // ── Rango de fechas ──────────────────────────────────────────

        $ventasRango = Venta::with('user')
            ->whereBetween('fecha_venta', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->get();

        $facturasRango = Factura::with('user')
            ->whereBetween('invoice_date', [$desde, $hasta])
            ->get();

        $devolucionesRango = Devolucion::with('user')
            ->whereBetween('fecha', [$desde . ' 00:00:00', $hasta . ' 23:59:59'])
            ->get();

        $ingresosVentas   = $ventasRango->where('tipo', 'venta')->sum('total');
        $ingresosFacturas = $facturasRango->sum('total_amount');
        $ingresos         = $ingresosVentas + $ingresosFacturas;

        $gastosProv = abs($ventasRango->where('tipo', 'pago_proveedor')->sum('total'));
        $gastosDev  = $devolucionesRango->sum('importe');
        $gastos     = $gastosProv + $gastosDev;

        $diferencia = $ingresos - $gastos;

        $numVentasRango   = $ventasRango->where('tipo', 'venta')->count();
        $numFacturasRango = $facturasRango->count();
        $numOpRango       = $numVentasRango + $numFacturasRango;
        $ticketMedioRango = $numOpRango > 0 ? $ingresos / $numOpRango : 0;

        // ── Día corriente ────────────────────────────────────────────

        $ventasHoy       = Venta::with('user')->whereDate('fecha_venta', today())->get();
        $facturasHoy     = Factura::with('user')->whereDate('invoice_date', today())->get();
        $devolucionesHoy = Devolucion::with('user')->whereDate('fecha', today())->get();

        $ingresosVentasHoy   = $ventasHoy->where('tipo', 'venta')->sum('total');
        $ingresosFacturasHoy = $facturasHoy->sum('total_amount');
        $ingresosHoy         = $ingresosVentasHoy + $ingresosFacturasHoy;

        $gastosProvHoy = abs($ventasHoy->where('tipo', 'pago_proveedor')->sum('total'));
        $gastosDevHoy  = $devolucionesHoy->sum('importe');
        $gastosHoy     = $gastosProvHoy + $gastosDevHoy;

        $numVentasHoy   = $ventasHoy->where('tipo', 'venta')->count();
        $numFacturasHoy = $facturasHoy->count();
        $numOpHoy       = $numVentasHoy + $numFacturasHoy;
        $ticketMedioHoy = $numOpHoy > 0 ? $ingresosHoy / $numOpHoy : 0;

        // ── Por usuario — hoy ────────────────────────────────────────

        $ventasUserHoy   = $ventasHoy->where('tipo', 'venta')->groupBy('user_id');
        $facturasUserHoy = $facturasHoy->groupBy('user_id');
        $devUserHoy      = $devolucionesHoy->groupBy('user_id');

        $userIds = collect($ventasUserHoy->keys())
            ->merge($facturasUserHoy->keys())
            ->unique();

        $usuariosHoy = $userIds->map(function ($userId) use ($ventasUserHoy, $facturasUserHoy, $devUserHoy) {
            $ventasUser   = $ventasUserHoy->get($userId, collect());
            $facturasUser = $facturasUserHoy->get($userId, collect());
            $devUser      = $devUserHoy->get($userId, collect());

            $total = $ventasUser->sum('total') + $facturasUser->sum('total_amount');
            $count = $ventasUser->count() + $facturasUser->count();

            $user   = $ventasUser->first()?->user ?? $facturasUser->first()?->user;
            $nombre = $user?->nombre ?? ('Usuario #' . $userId);

            return [
                'user_id'              => $userId,
                'nombre'               => $nombre,
                'num_ventas'           => $count,
                'total'                => round($total, 2),
                'promedio'             => $count > 0 ? round($total / $count, 2) : 0,
                'num_devoluciones'     => $devUser->count(),
                'importe_devoluciones' => round($devUser->sum('importe'), 2),
            ];
        })->values();

        return response()->json([
            'desde'                => $desde,
            'hasta'                => $hasta,
            'ingresos'             => round($ingresos, 2),
            'gastos'               => round($gastos, 2),
            'diferencia'           => round($diferencia, 2),
            'num_operaciones'      => $numOpRango,
            'ticket_medio'         => round($ticketMedioRango, 2),
            'num_devoluciones'     => $devolucionesRango->count(),
            'importe_devoluciones' => round($gastosDev, 2),
            'hoy' => [
                'ingresos'             => round($ingresosHoy, 2),
                'gastos'               => round($gastosHoy, 2),
                'diferencia'           => round($ingresosHoy - $gastosHoy, 2),
                'num_operaciones'      => $numOpHoy,
                'ticket_medio'         => round($ticketMedioHoy, 2),
                'num_devoluciones'     => $devolucionesHoy->count(),
                'importe_devoluciones' => round($gastosDevHoy, 2),
            ],
            'usuarios_hoy' => $usuariosHoy,
        ]);
    }
}
