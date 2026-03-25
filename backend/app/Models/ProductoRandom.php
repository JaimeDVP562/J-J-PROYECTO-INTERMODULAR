<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductoRandom extends Model
{
    protected $table = 'productos_random';
    protected $fillable = [
        'nombre',
        'descripcion',
        'precio',
    ];
}
