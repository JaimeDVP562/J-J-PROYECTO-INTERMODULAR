<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Categoria>
 */
class CategoriaFactory extends Factory
{
    public function definition(): array
    {
        $categorias = [
            'Electrónica', 'Alimentación', 'Bebidas', 'Papelería',
            'Limpieza', 'Hogar', 'Ropa', 'Calzado', 'Deportes', 'Juguetes',
        ];

        return [
            'nombre' => fake()->unique()->randomElement($categorias),
        ];
    }
}
