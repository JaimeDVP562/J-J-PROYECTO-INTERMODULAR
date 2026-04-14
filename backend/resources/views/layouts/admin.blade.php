<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    <title>@yield('title', 'Admin') — J-J ERP</title>

    <!-- Bootstrap 5 CSS -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <!-- Bootstrap Icons -->
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">

    <style>
        :root { --sidebar-width: 240px; }

        body { background-color: #f0f2f5; }

        /* ── Sidebar ── */
        .sidebar {
            width: var(--sidebar-width);
            min-height: 100vh;
            background: #0a2342;
            color: #fff;
            position: fixed;
            top: 0;
            left: 0;
            z-index: 100;
            display: flex;
            flex-direction: column;
        }
        .sidebar-brand {
            padding: 1.5rem 1.25rem;
            font-size: 1.1rem;
            font-weight: 700;
            letter-spacing: .5px;
            border-bottom: 1px solid rgba(255,255,255,.15);
        }
        .sidebar-brand span { color: #60a5fa; }
        .sidebar .nav-link {
            color: rgba(255,255,255,.75);
            padding: .65rem 1.25rem;
            border-radius: 6px;
            margin: 2px 8px;
            font-size: .9rem;
            display: flex;
            align-items: center;
            gap: .6rem;
            transition: background .15s, color .15s;
        }
        .sidebar .nav-link:hover,
        .sidebar .nav-link.active { background: rgba(255,255,255,.12); color: #fff; }
        .sidebar-footer {
            margin-top: auto;
            padding: 1rem 1.25rem;
            border-top: 1px solid rgba(255,255,255,.15);
            font-size: .82rem;
            color: rgba(255,255,255,.5);
        }

        /* ── Main ── */
        .main-wrapper {
            margin-left: var(--sidebar-width);
            min-height: 100vh;
            display: flex;
            flex-direction: column;
        }
        .topbar {
            background: #fff;
            border-bottom: 1px solid #dee2e6;
            padding: .75rem 1.5rem;
            display: flex;
            align-items: center;
            justify-content: space-between;
            position: sticky;
            top: 0;
            z-index: 50;
        }
        .page-content { padding: 1.5rem; flex: 1; }

        /* ── Cards ── */
        .stat-card {
            background: #fff;
            border-radius: 10px;
            padding: 1.25rem;
            box-shadow: 0 1px 4px rgba(0,0,0,.08);
            display: flex;
            align-items: center;
            gap: 1rem;
        }
        .stat-icon {
            width: 48px; height: 48px;
            border-radius: 10px;
            display: flex; align-items: center; justify-content: center;
            font-size: 1.4rem;
        }
        .stat-label { font-size: .8rem; color: #6c757d; }
        .stat-value { font-size: 1.6rem; font-weight: 700; color: #0a2342; }
    </style>
</head>
<body>

<!-- Sidebar -->
<aside class="sidebar">
    <div class="sidebar-brand">J-J <span>ERP</span> Admin</div>
    <nav class="nav flex-column mt-2">
        <a href="{{ route('admin.dashboard') }}"
           class="nav-link {{ request()->routeIs('admin.dashboard') ? 'active' : '' }}">
            <i class="bi bi-speedometer2"></i> Dashboard
        </a>
        <a href="{{ route('admin.usuarios.index') }}"
           class="nav-link {{ request()->routeIs('admin.usuarios.*') ? 'active' : '' }}">
            <i class="bi bi-people"></i> Usuarios
        </a>
        <a href="{{ route('admin.productos.index') }}"
           class="nav-link {{ request()->routeIs('admin.productos.*') ? 'active' : '' }}">
            <i class="bi bi-box-seam"></i> Productos
        </a>
        <a href="{{ route('admin.empleados.index') }}"
           class="nav-link {{ request()->routeIs('admin.empleados.*') ? 'active' : '' }}">
            <i class="bi bi-person-badge"></i> Empleados
        </a>
        <a href="{{ route('admin.clientes.index') }}"
           class="nav-link {{ request()->routeIs('admin.clientes.*') ? 'active' : '' }}">
            <i class="bi bi-person-lines-fill"></i> Clientes
        </a>
    </nav>
    <div class="sidebar-footer">
        J-J Proyecto Intermodular<br>DAW 2025–2026
    </div>
</aside>

<!-- Main -->
<div class="main-wrapper">
    <header class="topbar">
        <h6 class="mb-0 fw-semibold text-secondary">@yield('page-title', 'Panel de administración')</h6>
        <div class="d-flex align-items-center gap-3">
            <span class="text-muted small">{{ auth()->user()->nombre ?? auth()->user()->name }}</span>
            <form method="POST" action="{{ route('admin.logout') }}" class="d-inline">
                @csrf
                <button type="submit" class="btn btn-sm btn-outline-danger">
                    <i class="bi bi-box-arrow-right"></i> Salir
                </button>
            </form>
        </div>
    </header>

    <main class="page-content">
        @if (session('success'))
            <div class="alert alert-success alert-dismissible fade show" role="alert">
                {{ session('success') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif
        @if (session('error'))
            <div class="alert alert-danger alert-dismissible fade show" role="alert">
                {{ session('error') }}
                <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            </div>
        @endif

        @yield('content')
    </main>
</div>

<!-- Bootstrap 5 JS -->
<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
</body>
</html>
