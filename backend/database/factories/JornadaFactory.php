<?php

namespace Database\Factories;

use App\Models\User;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends \Illuminate\Database\Eloquent\Factories\Factory<\App\Models\Jornada>
 */
class JornadaFactory extends Factory
{
    public function definition(): array
    {
        $inicio = fake()->dateTimeBetween('-30 days', 'now');
        $fin    = fake()->boolean(80)
            ? (clone $inicio)->modify('+' . fake()->numberBetween(4, 9) . ' hours')
            : null;

        return [
            'user_id' => User::factory(),
            'inicio'  => $inicio->format('Y-m-d H:i:s'),
            'fin'     => $fin?->format('Y-m-d H:i:s'),
        ];
    }

    public function activa(): static
    {
        return $this->state(['fin' => null]);
    }

    public function completada(): static
    {
        return $this->state(function (array $attributes) {
            $inicio = new \DateTime($attributes['inicio']);
            return [
                'fin' => (clone $inicio)->modify('+8 hours')->format('Y-m-d H:i:s'),
            ];
        });
    }
}
