<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Venta extends Model
{
    use HasFactory;

    protected $table = 'ventas';
    protected $fillable = [
        'user_id',
        'cliente_id',
        'total',
        'fecha_venta',
        'metodo_pago',
        'notas',
        'devuelta',
        'tipo',
        'concepto',
    ];

    protected $casts = [
        'devuelta' => 'boolean',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function detalles()
    {
        return $this->hasMany(DetalleVenta::class);
    }

    public function devolucion()
    {
        return $this->hasOne(Devolucion::class);
    }
}
