<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Proveedor extends Model
{
    protected $table = 'proveedores';
    protected $fillable = [
        'nombre',
        'contact_email',
        'phone',
        'address',
    ];

    public function productos()
    {
        return $this->hasMany(Producto::class);
    }
}
