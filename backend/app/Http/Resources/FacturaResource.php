<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class FacturaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'cliente' => $this->cliente,
            'user' => $this->user,
            'series' => $this->series,
            'number' => $this->number,
            'invoice_id' => $this->invoice_id,
            'issue_date' => $this->issue_date,
            'operation_date' => $this->operation_date,
            'invoice_type' => $this->invoice_type,
            'rectified_invoice' => $this->rectified_invoice,
            'total_amount' => $this->total_amount,
            'gross_amount' => $this->gross_amount,
            'tax_amount' => $this->tax_amount,
            'tax_breakdown' => $this->tax_breakdown,
            'status' => $this->status,
            'invoice_date' => $this->invoice_date,
            'due_date' => $this->due_date,
            'detalles' => $this->detalles,
            'proveedor' => $this->proveedor,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'payment_method' => $this->payment_method,
            'payment_due_date' => $this->payment_due_date,
            'iban' => $this->iban,
            'verifactu' => $this->verifactu,
        ];
    }
}
