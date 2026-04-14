<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Cliente;

class ClientesController extends Controller
{
    public function index()
    {
        $clientes = Cliente::latest()->paginate(20);
        return view('admin.clientes.index', compact('clientes'));
    }
}
