@extends('layouts.admin')

@section('title', 'Editar usuario')
@section('page-title', 'Editar usuario')

@section('content')
<div class="row justify-content-center">
    <div class="col-lg-7">
        <div class="card border-0 shadow-sm">
            <div class="card-header bg-white border-0 fw-semibold py-3">
                <i class="bi bi-pencil me-2 text-primary"></i>Editar: {{ $usuario->nombre ?? $usuario->name }}
            </div>
            <div class="card-body">
                @if ($errors->any())
                    <div class="alert alert-danger">
                        <ul class="mb-0 ps-3">
                            @foreach ($errors->all() as $error)<li>{{ $error }}</li>@endforeach
                        </ul>
                    </div>
                @endif

                <form method="POST" action="{{ route('admin.usuarios.update', $usuario->id) }}">
                    @csrf @method('PUT')
                    <div class="row g-3">
                        <div class="col-12">
                            <label class="form-label fw-semibold">Nombre completo *</label>
                            <input type="text" name="nombre" class="form-control @error('nombre') is-invalid @enderror"
                                   value="{{ old('nombre', $usuario->nombre ?? $usuario->name) }}" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Email *</label>
                            <input type="email" name="email" class="form-control @error('email') is-invalid @enderror"
                                   value="{{ old('email', $usuario->email) }}" required>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Rol *</label>
                            <select name="rol" class="form-select @error('rol') is-invalid @enderror" required>
                                <option value="admin"    {{ old('rol', $usuario->rol) === 'admin'    ? 'selected' : '' }}>Admin</option>
                                <option value="gerente"  {{ old('rol', $usuario->rol) === 'gerente'  ? 'selected' : '' }}>Gerente</option>
                                <option value="vendedor" {{ old('rol', $usuario->rol) === 'vendedor' ? 'selected' : '' }}>Vendedor</option>
                            </select>
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Nueva contraseña <small class="text-muted">(dejar vacío para no cambiar)</small></label>
                            <input type="password" name="password" class="form-control @error('password') is-invalid @enderror" minlength="8">
                        </div>
                        <div class="col-md-6">
                            <label class="form-label fw-semibold">Confirmar contraseña</label>
                            <input type="password" name="password_confirmation" class="form-control">
                        </div>
                    </div>
                    <div class="d-flex gap-2 mt-4">
                        <button type="submit" class="btn btn-primary">
                            <i class="bi bi-check-lg me-1"></i> Actualizar
                        </button>
                        <a href="{{ route('admin.usuarios.index') }}" class="btn btn-outline-secondary">Cancelar</a>
                    </div>
                </form>
            </div>
        </div>
    </div>
</div>
@endsection
