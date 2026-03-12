<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Jornada;
use App\Http\Resources\JornadaResource;
use Illuminate\Http\Request;

class JornadaController extends Controller
{
    private function isPrivileged($user): bool
    {
        return in_array($user->rol, ['admin', 'gerente']);
    }

    /**
     * Admin/Gerente: todas las jornadas de hoy con datos de usuario.
     * Usuario normal: sus jornadas del día corriente.
     */
    public function index(Request $request)
    {
        $user = $request->user();

        if ($this->isPrivileged($user)) {
            $jornadas = Jornada::with('user')
                ->whereDate('inicio', today())
                ->orderBy('inicio', 'desc')
                ->get();
        } else {
            $jornadas = Jornada::with('user')
                ->where('user_id', $user->id)
                ->whereDate('inicio', today())
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
            // response()->json(null) usa Symfony JsonResponse que convierte null → {} (objeto vacío).
            // fromJsonString envía un JSON null real.
            return \Illuminate\Http\JsonResponse::fromJsonString('null');
        }

        return response()->json((new JornadaResource($jornada))->toArray($request));
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

        return response()->json((new JornadaResource($jornada))->toArray($request), 201);
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

        return response()->json((new JornadaResource($jornada))->toArray($request));
    }

    /**
     * Resumen de horas por usuario para hoy (admin y gerente).
     */
    public function resumenHoy(Request $request)
    {
        if (!$this->isPrivileged($request->user())) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $jornadas = Jornada::with('user')
            ->whereDate('inicio', today())
            ->get()
            ->groupBy('user_id')
            ->map(function ($jornadasUsuario) use ($request) {
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
                    'periodos'        => $jornadasUsuario->sortBy('inicio')->map(fn($j) => [
                        'inicio' => $j->inicio->format('H:i'),
                        'fin'    => $j->fin ? $j->fin->format('H:i') : null,
                    ])->values(),
                ];
            })
            ->values();

        return response()->json($jornadas);
    }

    /**
     * Resumen mensual de jornadas.
     * Admin/Gerente: todos los usuarios. Usuario: solo el propio.
     */
    public function resumenMensual(Request $request)
    {
        $user = $request->user();
        $mes  = (int) $request->query('mes', now()->month);
        $ano  = (int) $request->query('ano', now()->year);

        $query = \App\Models\Jornada::with('user')
            ->whereMonth('inicio', $mes)
            ->whereYear('inicio', $ano);

        if (!$this->isPrivileged($user)) {
            $query->where('user_id', $user->id);
        }

        $jornadas = $query->get();

        if ($this->isPrivileged($user)) {
            $resumen = $jornadas->groupBy('user_id')->map(function ($jornadasUser) {
                $u = $jornadasUser->first()->user;
                return [
                    'user_id'         => $u->id,
                    'nombre'          => $u->nombre,
                    'dias_trabajados' => $jornadasUser->groupBy(fn($j) => $j->inicio->format('Y-m-d'))->count(),
                    'total_minutos'   => $jornadasUser->sum('duracion_minutos'),
                    'num_jornadas'    => $jornadasUser->count(),
                ];
            })->values();
        } else {
            $porDia  = $jornadas->groupBy(fn($j) => $j->inicio->format('Y-m-d'));
            $resumen = [
                'dias_trabajados' => $porDia->count(),
                'total_minutos'   => $jornadas->sum('duracion_minutos'),
                'detalle_dias'    => $porDia->map(fn($js, $fecha) => [
                    'fecha'    => $fecha,
                    'minutos'  => $js->sum('duracion_minutos'),
                    'jornadas' => $js->count(),
                ])->values(),
            ];
        }

        return response()->json($resumen);
    }

    /**
     * Admin/Gerente: jornadas de un usuario específico filtradas por mes/año.
     */
    public function jornadasUsuario(Request $request, $userId)
    {
        if (!$this->isPrivileged($request->user())) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $mes = (int) $request->query('mes', now()->month);
        $ano = (int) $request->query('ano', now()->year);

        $jornadas = Jornada::with('user')
            ->where('user_id', $userId)
            ->whereMonth('inicio', $mes)
            ->whereYear('inicio', $ano)
            ->orderBy('inicio')
            ->get();

        return JornadaResource::collection($jornadas);
    }

    /**
     * Admin/Gerente: crear jornada para cualquier usuario.
     */
    public function adminStore(Request $request)
    {
        if (!$this->isPrivileged($request->user())) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'inicio'  => 'required|date',
            'fin'     => 'nullable|date|after:inicio',
        ]);

        $jornada = Jornada::create($validated);

        return response()->json((new JornadaResource($jornada))->toArray($request), 201);
    }

    /**
     * Admin/Gerente: actualizar inicio/fin de una jornada.
     */
    public function adminUpdate(Request $request, $id)
    {
        if (!$this->isPrivileged($request->user())) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $jornada = Jornada::findOrFail($id);

        $validated = $request->validate([
            'inicio' => 'required|date',
            'fin'    => 'nullable|date|after:inicio',
        ]);

        $jornada->update($validated);

        return response()->json((new JornadaResource($jornada->fresh()))->toArray($request));
    }

    /**
     * Admin/Gerente: eliminar una jornada.
     */
    public function adminDestroy(Request $request, $id)
    {
        if (!$this->isPrivileged($request->user())) {
            return response()->json(['error' => 'No autorizado'], 403);
        }

        $jornada = Jornada::findOrFail($id);
        $jornada->delete();

        return response()->json(['mensaje' => 'Jornada eliminada']);
    }
}
