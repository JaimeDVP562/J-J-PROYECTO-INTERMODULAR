<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Empresa extends Model
{
    protected $table = 'empresas';

    protected $fillable = [
        'nif',
        'nombre_fiscal',
        'nombre_comercial',
        'direccion',
        'ciudad',
        'codigo_postal',
        'pais',
        'telefono',
        'email',
        'iban',
        'iva_regimen',
        'extra',
    ];

    protected $casts = [
        'extra' => 'array',
    ];
}
