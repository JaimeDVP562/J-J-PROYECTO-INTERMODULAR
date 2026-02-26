<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ClienteResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'email' => $this->email,
            'phone' => $this->phone,
            'address' => $this->address,
            'facturas' => $this->whenLoaded('facturas'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
