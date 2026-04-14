<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Venta>
 */
class VentaFactory extends Factory
{
    public function definition(): array
    {
        return [
            'user_id'      => User::factory(),
            'cliente_id'   => fake()->boolean(70) ? Cliente::factory() : null,
            'total'        => fake()->randomFloat(2, 1, 500),
            'fecha_venta'  => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d H:i:s'),
            'metodo_pago'  => fake()->randomElement(['efectivo', 'tarjeta', 'transferencia']),
            'notas'        => fake()->optional()->sentence(),
            'devuelta'     => false,
            'tipo'         => 'venta',
        ];
    }
}
