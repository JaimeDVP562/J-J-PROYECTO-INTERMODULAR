<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class JornadaResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id'                => $this->id,
            'user_id'           => $this->user_id,
            'user'              => $this->whenLoaded('user', fn() => [
                'id'     => $this->user->id,
                'nombre' => $this->user->nombre,
                'email'  => $this->user->email,
                'rol'    => $this->user->rol,
            ]),
            'inicio'            => $this->inicio?->toISOString(),
            'fin'               => $this->fin?->toISOString(),
            'duracion_minutos'  => $this->duracion_minutos,
            'created_at'        => $this->created_at,
            'updated_at'        => $this->updated_at,
        ];
    }
}
