@extends('layouts.admin')
@section('title', 'Editar categoría')
@section('page-title', 'Editar categoría')

@section('content')
<div class="row justify-content-center">
<div class="col-lg-5">
<div class="card border-0 shadow-sm">
    <div class="card-header bg-white border-0 fw-semibold py-3">
        <i class="bi bi-pencil me-2 text-secondary"></i>Editar categoría #{{ $categoria->id }}
    </div>
    <div class="card-body">
        @if ($errors->any())
            <div class="alert alert-danger">
                <ul class="mb-0 ps-3">@foreach($errors->all() as $e)<li>{{ $e }}</li>@endforeach</ul>
            </div>
        @endif
        <form method="POST" action="{{ route('admin.categorias.update', $categoria->id) }}">
            @csrf @method('PUT')
            <div class="mb-3">
                <label class="form-label fw-semibold">Nombre *</label>
                <input type="text" name="nombre" class="form-control" value="{{ old('nombre', $categoria->nombre) }}" required>
            </div>
            <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary"><i class="bi bi-check-lg me-1"></i> Actualizar</button>
                <a href="{{ route('admin.categorias.index') }}" class="btn btn-outline-secondary">Cancelar</a>
            </div>
        </form>
    </div>
</div>
</div>
</div>
@endsection
