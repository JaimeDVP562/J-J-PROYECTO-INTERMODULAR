<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VentaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'          => $this->id,
            'user_id'     => $this->user_id,
            'cliente_id'  => $this->cliente_id,
            'user'        => $this->whenLoaded('user'),
            'cliente'     => $this->whenLoaded('cliente'),
            'total'       => $this->total,
            'fecha_venta' => $this->fecha_venta,
            'metodo_pago' => $this->metodo_pago,
            'notas'       => $this->notas,
            'tipo'        => $this->tipo ?? 'venta',
            'concepto'    => $this->concepto,
            'devuelta'    => $this->devuelta,
            'detalles'    => $this->whenLoaded('detalles'),
            'devolucion'  => $this->whenLoaded('devolucion'),
            'created_at'  => $this->created_at,
            'updated_at'  => $this->updated_at,
        ];
    }
}
