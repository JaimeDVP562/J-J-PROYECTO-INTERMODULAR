<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class InventarioResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'producto' => $this->producto,
            'cantidad_disponible' => $this->cantidad_disponible,
            'cantidad_minima' => $this->cantidad_minima,
            'ubicacion' => $this->ubicacion,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
