<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VentaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'user' => $this->user,
            'total' => $this->total,
            'fecha_venta' => $this->fecha_venta,
            'metodo_pago' => $this->metodo_pago,
            'detalles' => $this->detalles,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
