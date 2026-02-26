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
            'total_amount' => $this->total_amount,
            'status' => $this->status,
            'invoice_date' => $this->invoice_date,
            'due_date' => $this->due_date,
            'detalles' => $this->detalles,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
