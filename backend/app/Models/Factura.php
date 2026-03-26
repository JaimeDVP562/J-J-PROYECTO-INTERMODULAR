<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Factura extends Model
{
    protected $table = 'facturas';
    protected $fillable = [
        'proveedor_id',
        'cliente_id',
        'user_id',
        'series',
        'number',
        'invoice_id',
        'issue_date',
        'operation_date',
        'invoice_type',
        'rectified_invoice',
        'total_amount',
        'gross_amount',
        'tax_amount',
        'tax_breakdown',
        'status',
        'invoice_date',
        'due_date',
        'payment_method',
        'payment_due_date',
        'iban',
        'verifactu',
    ];

    protected $casts = [
        'tax_breakdown' => 'array',
        'verifactu' => 'array',
    ];

    public function cliente()
    {
        return $this->belongsTo(Cliente::class);
    }

    public function proveedor()
    {
        return $this->belongsTo(Proveedor::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function detalles()
    {
        return $this->hasMany(DetalleFactura::class);
    }
}
