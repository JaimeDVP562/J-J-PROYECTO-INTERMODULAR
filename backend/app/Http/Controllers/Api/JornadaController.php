<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jornada;
use App\Http\Resources\JornadaResource;
use Illuminate\Http\Request;

class JornadaController extends Controller
{
    /**
     * Admin: todas las jornadas de hoy con datos de usuario.
     * Usuario normal: sus jornadas de las últimas 12h.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($user->rol === 'admin') {
            $jornadas = Jornada::with('user')
                ->whereDate('inicio', today())
                ->orderBy('inicio', 'desc')
                ->get();
        } else {
            $jornadas = Jornada::with('user')
                ->where('user_id', $user->id)
                ->where('inicio', '>=', now()->subHours(12))
                ->orderBy('inicio', 'desc')
                ->get();
        }

        return JornadaResource::collection($jornadas);
    }

    /**
     * Devuelve la jornada abierta (sin fin) del usuario autenticado.
     */
    public function activa(Request $request)
    {
        $jornada = Jornada::where('user_id', $request->user()->id)
            ->whereNull('fin')
            ->latest()
            ->first();

        if (!$jornada) {
            return response()->json(null);
        }

        return new JornadaResource($jornada);
    }

    /**
     * Inicia una nueva jornada para el usuario autenticado.
     */
    public function store(Request $request)
    {
        $user = $request->user();

        $abierta = Jornada::where('user_id', $user->id)->whereNull('fin')->first();
        if ($abierta) {
            return response()->json(['error' => 'Ya tienes una jornada abierta'], 422);
        }

        $jornada = Jornada::create([
            'user_id' => $user->id,
            'inicio'  => now(),
        ]);

        return response()->json(new JornadaResource($jornada), 201);
    }

    /**
     * Marca el fin de una jornada.
     */
    public function marcarFin(Request $request, $id)
    {
        $user = $request->user();

        $jornada = Jornada::where('id', $id)
            ->where('user_id', $user->id)
            ->whereNull('fin')
            ->first();

        if (!$jornada) {
            return response()->json(['error' => 'Jornada no encontrada o ya cerrada'], 404);
        }

        $jornada->update(['fin' => now()]);

        return new JornadaResource($jornada);
    }

    /**
     * Resumen de horas por usuario para hoy (solo admin).
     */
    public function resumenHoy(Request $request)
    {
        if ($request->user()->rol !== 'admin') {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $jornadas = Jornada::with('user')
            ->whereDate('inicio', today())
            ->get()
            ->groupBy('user_id')
            ->map(function ($jornadasUsuario) {
                $usuario = $jornadasUsuario->first()->user;
                $totalMinutos = $jornadasUsuario->sum('duracion_minutos');
                $activa = $jornadasUsuario->whereNull('fin')->first();

                return [
                    'user_id'         => $usuario->id,
                    'nombre'          => $usuario->nombre,
                    'email'           => $usuario->email,
                    'rol'             => $usuario->rol,
                    'total_minutos'   => $totalMinutos,
                    'jornada_activa'  => $activa ? (new \App\Http\Resources\JornadaResource($activa))->toArray($request) : null,
                    'num_jornadas'    => $jornadasUsuario->count(),
                ];
            })
            ->values();

        return response()->json($jornadas);
    }
}
