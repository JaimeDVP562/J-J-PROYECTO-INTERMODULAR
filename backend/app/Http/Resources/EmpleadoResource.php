<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class EmpleadoResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nombre' => $this->nombre,
            'apellido' => $this->apellido,
            'email' => $this->email,
            'telefono' => $this->telefono,
            'fecha_contratacion' => $this->fecha_contratacion,
            'salario' => $this->salario,
            'puesto' => $this->puesto,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
