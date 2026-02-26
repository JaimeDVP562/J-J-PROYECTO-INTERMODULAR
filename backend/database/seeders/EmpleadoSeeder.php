<?php

namespace Database\Seeders;

use App\Models\Empleado;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class EmpleadoSeeder extends Seeder
{
    public function run(): void
    {
        $puestos = ['Vendedor', 'Almacén', 'Gerente', 'Administración'];

        foreach (range(1, 6) as $i) {
            $email = "empleado{$i}@empresa.test";
            Empleado::updateOrCreate([
                'email' => $email,
            ], [
                'nombre' => "Empleado$i",
                'apellido' => "Apellido$i",
                'email' => $email,
                'telefono' => '600-0' . $i,
                'fecha_contratacion' => now()->subYears(rand(0, 5))->toDateString(),
                'salario' => rand(10000, 40000),
                'puesto' => $puestos[array_rand($puestos)],
            ]);
        }
    }
}
