<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class DetalleFactura extends Model
{
    protected $table = 'detalle_facturas';
    protected $fillable = [
        'factura_id',
        'producto_id',
        'producto_random_id',
        'cantidad',
        'precio_unitario',
        'subtotal',
    ];

    public function factura()
    {
        return $this->belongsTo(Factura::class);
    }

    public function producto()
    {
        return $this->belongsTo(Producto::class);
    }

    public function producto_random()
    {
        return $this->belongsTo(ProductoRandom::class, 'producto_random_id');
    }
}
