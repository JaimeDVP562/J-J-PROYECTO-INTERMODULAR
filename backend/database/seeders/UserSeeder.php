<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@negocio.test'], [
            'nombre'             => 'Admin',
            'apellido'           => 'Principal',
            'password'           => Hash::make('password'),
            'rol'                => 'admin',
            'puesto'             => 'Administrador',
            'telefono'           => '600-000-001',
            'salario'            => 35000,
            'fecha_contratacion' => '2020-01-01',
        ]);

        User::updateOrCreate(['email' => 'gerente@negocio.test'], [
            'nombre'             => 'Gerente',
            'apellido'           => 'García',
            'password'           => Hash::make('password'),
            'rol'                => 'gerente',
            'puesto'             => 'Gerente',
            'telefono'           => '600-000-002',
            'salario'            => 30000,
            'fecha_contratacion' => '2021-03-15',
        ]);

        $vendedores = [
            ['nombre' => 'Carlos',   'apellido' => 'López',    'puesto' => 'Vendedor',   'salario' => 18000],
            ['nombre' => 'María',    'apellido' => 'Martínez', 'puesto' => 'Vendedor',   'salario' => 18500],
            ['nombre' => 'Sergio',   'apellido' => 'Ruiz',     'puesto' => 'Almacén',    'salario' => 17000],
            ['nombre' => 'Laura',    'apellido' => 'Sánchez',  'puesto' => 'Vendedor',   'salario' => 18200],
        ];

        foreach ($vendedores as $i => $v) {
            $n = $i + 1;
            User::updateOrCreate(['email' => "vendedor{$n}@negocio.test"], [
                'nombre'             => $v['nombre'],
                'apellido'           => $v['apellido'],
                'password'           => Hash::make('password'),
                'rol'                => 'vendedor',
                'puesto'             => $v['puesto'],
                'telefono'           => "600-00{$n}-00{$n}",
                'salario'            => $v['salario'],
                'fecha_contratacion' => now()->subYears(rand(1, 4))->toDateString(),
            ]);
        }
    }
}
