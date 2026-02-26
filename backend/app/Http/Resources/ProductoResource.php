<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductoResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'descripcion' => $this->descripcion,
            'precio' => $this->precio,
            'stock_quantity' => $this->stock_quantity,
            'categoria' => $this->whenLoaded('categoria'),
            'proveedor' => $this->whenLoaded('proveedor'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
