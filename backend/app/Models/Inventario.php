<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Inventario extends Model
{
    use HasFactory;

    protected $table = 'inventarios';
    protected $fillable = [
        'producto_id',
        'cantidad_disponible',
        'cantidad_minima',
        'ubicacion',
    ];

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }
}
