<?php

namespace Database\Factories;

use App\Models\Cliente;
use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Factura>
 */
class FacturaFactory extends Factory
{
    public function definition(): array
    {
        $gross  = fake()->randomFloat(2, 10, 1000);
        $tax    = round($gross * 0.21, 2);
        $total  = round($gross + $tax, 2);

        return [
            'cliente_id'      => Cliente::factory(),
            'user_id'         => User::factory(),
            'series'          => fake()->randomElement(['A', 'B', 'F']),
            'number'          => fake()->unique()->numberBetween(1, 9999),
            'invoice_id'      => strtoupper(fake()->bothify('INV-######')),
            'issue_date'      => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'operation_date'  => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'invoice_type'    => 'F1',
            'total_amount'    => $total,
            'gross_amount'    => $gross,
            'tax_amount'      => $tax,
            'status'          => fake()->randomElement(['pending', 'paid', 'cancelled']),
            'invoice_date'    => fake()->dateTimeBetween('-1 year', 'now')->format('Y-m-d'),
            'due_date'        => fake()->dateTimeBetween('now', '+3 months')->format('Y-m-d'),
            'payment_method'  => fake()->randomElement(['efectivo', 'tarjeta', 'transferencia']),
        ];
    }
}
