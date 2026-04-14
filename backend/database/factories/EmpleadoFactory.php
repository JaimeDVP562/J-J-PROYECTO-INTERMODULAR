<?php

namespace Database\Factories;

use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Empleado>
 */
class EmpleadoFactory extends Factory
{
    public function definition(): array
    {
        $puestos = ['Vendedor', 'Gerente', 'Almacenero', 'Administrativo', 'Técnico', 'Cajero'];

        return [
            'nombre'             => fake()->firstName(),
            'apellido'           => fake()->lastName(),
            'email'              => fake()->unique()->safeEmail(),
            'telefono'           => fake()->phoneNumber(),
            'fecha_contratacion' => fake()->dateTimeBetween('-5 years', 'now')->format('Y-m-d'),
            'salario'            => fake()->randomFloat(2, 1000, 4000),
            'puesto'             => fake()->randomElement($puestos),
        ];
    }
}
