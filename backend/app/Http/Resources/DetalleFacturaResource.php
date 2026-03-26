<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use App\Http\Resources\ProductoResource;

class DetalleFacturaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'factura' => $this->factura,
            'producto' => $this->when($this->producto, function () {
                return new ProductoResource($this->producto);
            }),
            'producto_random' => $this->when($this->producto_random, function () {
                return [
                    'id' => $this->producto_random->id,
                    'nombre' => $this->producto_random->nombre,
                    'descripcion' => $this->producto_random->descripcion,
                    'precio' => $this->producto_random->precio,
                ];
            }),
            'cantidad' => $this->cantidad,
            'precio_unitario' => $this->precio_unitario,
            'subtotal' => $this->subtotal,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
