<?php

namespace Database\Factories;

use App\Models\Producto;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Inventario>
 */
class InventarioFactory extends Factory
{
    public function definition(): array
    {
        return [
            'producto_id'         => Producto::factory(),
            'cantidad_disponible' => fake()->numberBetween(0, 500),
            'cantidad_minima'     => fake()->numberBetween(0, 20),
            'ubicacion'           => strtoupper(fake()->bothify('Almacén-?##')),
        ];
    }
}
