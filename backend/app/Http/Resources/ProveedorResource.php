<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProveedorResource extends JsonResource
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
            'contact_email' => $this->contact_email,
            'phone' => $this->phone,
            'address' => $this->address,
            'productos' => $this->whenLoaded('productos'),
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
