<?php

namespace Database\Factories;

use App\Models\Categoria;
use App\Models\Proveedor;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Producto>
 */
class ProductoFactory extends Factory
{
    public function definition(): array
    {
        return [
            'nombre'          => fake()->words(3, true),
            'sku'             => strtoupper(fake()->bothify('??-####')),
            'descripcion'     => fake()->sentence(),
            'precio'          => fake()->randomFloat(2, 1, 500),
            'stock_quantity'  => fake()->numberBetween(0, 200),
            'categoria_id'    => Categoria::factory(),
            'proveedor_id'    => Proveedor::factory(),
        ];
    }
}
