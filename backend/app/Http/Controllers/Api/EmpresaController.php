<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Empresa;

class EmpresaController extends Controller
{
    public function show()
    {
        $empresa = Empresa::first();
        if (!$empresa) {
            return response()->json(['error' => 'Empresa no configurada'], 404);
        }
        return response()->json($empresa);
    }
}
