<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Acceso — J-J ERP Admin</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css" rel="stylesheet">
    <style>
        body {
            min-height: 100vh;
            background: linear-gradient(135deg, #0a2342 0%, #17375e 100%);
            display: flex; align-items: center; justify-content: center;
        }
        .login-card {
            width: 100%; max-width: 420px;
            background: #fff; border-radius: 16px;
            box-shadow: 0 20px 60px rgba(0,0,0,.3);
            padding: 2.5rem;
        }
        .login-logo {
            font-size: 1.8rem; font-weight: 800; color: #0a2342;
            letter-spacing: -1px; text-align: center; margin-bottom: 1.5rem;
        }
        .login-logo span { color: #3b82f6; }
        .btn-login { background: #0a2342; color: #fff; border: none; }
        .btn-login:hover { background: #17375e; color: #fff; }
    </style>
</head>
<body>
<div class="login-card">
    <div class="login-logo">J-J <span>ERP</span></div>
    <p class="text-center text-muted mb-4" style="font-size:.9rem">Panel de Administración</p>

    @if ($errors->any())
        <div class="alert alert-danger">{{ $errors->first() }}</div>
    @endif

    <form method="POST" action="{{ route('admin.login') }}">
        @csrf
        <div class="mb-3">
            <label class="form-label fw-semibold">Email</label>
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-envelope"></i></span>
                <input type="email" name="email" class="form-control @error('email') is-invalid @enderror"
                       value="{{ old('email') }}" placeholder="admin@negocio.test" required autofocus>
            </div>
        </div>
        <div class="mb-4">
            <label class="form-label fw-semibold">Contraseña</label>
            <div class="input-group">
                <span class="input-group-text"><i class="bi bi-lock"></i></span>
                <input type="password" name="password" class="form-control @error('password') is-invalid @enderror"
                       placeholder="••••••••" required>
            </div>
        </div>
        <div class="mb-3 form-check">
            <input type="checkbox" name="remember" class="form-check-input" id="remember">
            <label class="form-check-label" for="remember">Recordarme</label>
        </div>
        <button type="submit" class="btn btn-login w-100 py-2">
            <i class="bi bi-box-arrow-in-right me-2"></i>Acceder al panel
        </button>
    </form>
</div>
</body>
</html>
