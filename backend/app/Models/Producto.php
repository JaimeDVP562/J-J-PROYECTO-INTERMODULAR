<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Producto extends Model
{
    protected $table = 'productos';
    protected $fillable = [
        'nombre',
        'sku',
        'descripcion',
        'precio',
        'stock_quantity',
        'categoria_id',
        'proveedor_id',
    ];

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function categoria()
    {
        return $this->belongsTo(Categoria::class);
    }
}
