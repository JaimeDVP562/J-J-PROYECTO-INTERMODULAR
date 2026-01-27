<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
        'stock',
        'proveedor_id',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }
}
