<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Cliente extends Model
{
    use HasFactory;

    protected $table = 'clientes';
    protected $fillable = [
        'nombre',
        'email',
        'phone',
        'address',
    ];

    public function facturas()
    {
        return $this->hasMany(Factura::class);
    }
}
