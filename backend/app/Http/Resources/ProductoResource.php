<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'             => $this->id,
            'nombre'         => $this->nombre,
            'sku'            => $this->sku,
            'descripcion'    => $this->descripcion,
            'precio'         => $this->precio,
            'stock_quantity' => $this->stock_quantity,
            'categoria_id'   => $this->categoria_id,
            'proveedor_id'   => $this->proveedor_id,
            'categoria'      => $this->whenLoaded('categoria'),
            'proveedor'      => $this->whenLoaded('proveedor'),
            'created_at'     => $this->created_at,
            'updated_at'     => $this->updated_at,
        ];
    }
}
