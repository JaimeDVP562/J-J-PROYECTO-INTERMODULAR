@extends('layouts.admin')
@section('title', 'Jornadas')
@section('page-title', 'Control de Jornadas')

@section('content')
<div class="d-flex justify-content-between align-items-center mb-3">
    <div>
        <h5 class="mb-0 fw-bold">Jornadas</h5>
        <small class="text-muted">{{ $jornadas->total() }} registros</small>
    </div>
</div>

<div class="card border-0 shadow-sm">
    <div class="card-body p-0">
        <table class="table table-hover align-middle mb-0">
            <thead class="table-light">
                <tr>
                    <th>#</th>
                    <th>Empleado</th>
                    <th>Inicio</th>
                    <th>Fin</th>
                    <th>Duración</th>
                    <th class="text-end">Acciones</th>
                </tr>
            </thead>
            <tbody>
                @forelse ($jornadas as $j)
                @php
                    $duracion = null;
                    if ($j->fin) {
                        $mins = $j->inicio->diffInMinutes($j->fin);
                        $h = intdiv($mins, 60);
                        $m = $mins % 60;
                        $duracion = "{$h}h {$m}m";
                    }
                @endphp
                <tr>
                    <td class="text-muted small">{{ $j->id }}</td>
                    <td class="fw-semibold">{{ $j->user?->nombre ?? '—' }}</td>
                    <td>{{ $j->inicio->format('d/m/Y H:i') }}</td>
                    <td>
                        @if($j->fin)
                            {{ $j->fin->format('d/m/Y H:i') }}
                        @else
                            <span class="badge bg-warning text-dark">En curso</span>
                        @endif
                    </td>
                    <td>{{ $duracion ?? '—' }}</td>
                    <td class="text-end">
                        <form method="POST" action="{{ route('admin.jornadas.destroy', $j->id) }}" class="d-inline"
                              onsubmit="return confirm('¿Eliminar esta jornada?')">
                            @csrf @method('DELETE')
                            <button class="btn btn-sm btn-outline-danger"><i class="bi bi-trash"></i></button>
                        </form>
                    </td>
                </tr>
                @empty
                <tr><td colspan="6" class="text-center text-muted py-4">Sin jornadas registradas.</td></tr>
                @endforelse
            </tbody>
        </table>
    </div>
    <div class="card-footer bg-white border-0">{{ $jornadas->links() }}</div>
</div>
@endsection
