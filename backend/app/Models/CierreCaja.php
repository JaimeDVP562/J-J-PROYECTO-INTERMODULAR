<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CierreCaja extends Model
{
    protected $table = 'cierre_cajas';

    protected $fillable = [
        'user_id',
        'fecha',
        'efectivo_retirado',
        'importe_datafono',
        'total_ventas',
        'diferencia',
        'notas',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
