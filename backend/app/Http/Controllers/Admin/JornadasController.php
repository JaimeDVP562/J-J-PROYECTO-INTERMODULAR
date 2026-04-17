<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Jornada;

class JornadasController extends Controller
{
    public function index()
    {
        $jornadas = Jornada::with('user')
            ->latest('inicio')
            ->paginate(25);
        return view('admin.jornadas.index', compact('jornadas'));
    }

    public function destroy(int $id)
    {
        Jornada::findOrFail($id)->delete();

        return redirect()->route('admin.jornadas.index')
            ->with('success', 'Jornada eliminada correctamente.');
    }
}
