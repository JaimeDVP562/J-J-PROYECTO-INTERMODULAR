<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        // Create roles: admin, gerente, vendedor
        User::updateOrCreate([
            'email' => 'admin@negocio.test',
        ], [
            'nombre' => 'Admin User',
            'password' => Hash::make('password'),
            'rol' => 'admin',
        ]);

        User::updateOrCreate([
            'email' => 'gerente@negocio.test',
        ], [
            'nombre' => 'Gerente User',
            'password' => Hash::make('password'),
            'rol' => 'gerente',
        ]);

        // several vendedores
        foreach (range(1, 4) as $i) {
            User::updateOrCreate([
                'email' => "vendedor{$i}@negocio.test",
            ], [
                'nombre' => "Vendedor $i",
                'password' => Hash::make('password'),
                'rol' => 'vendedor',
            ]);
        }
    }
}
