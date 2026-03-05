<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Devolucion extends Model
{
    protected $table = 'devoluciones';

    protected $fillable = [
        'venta_id',
        'user_id',
        'motivo',
        'importe',
        'fecha',
    ];

    protected $casts = [
        'fecha' => 'datetime',
    ];

    public function venta()
    {
        return $this->belongsTo(Venta::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
