<?php

namespace Database\Seeders;

use App\Models\Cliente;
use Illuminate\Database\Seeder;

class ClienteSeeder extends Seeder
{
    public function run(): void
    {
        $clientes = [
            ['nombre' => 'Ferretería López', 'email' => 'contacto@ferreterialopez.com', 'phone' => '555-0200', 'address' => 'C. Comercio 12'],
            ['nombre' => 'Constructores SA', 'email' => 'info@constructores.com', 'phone' => '555-0201', 'address' => 'Av. Obras 9'],
            ['nombre' => 'Taller Muebles', 'email' => 'muebles@taller.com', 'phone' => '555-0202', 'address' => 'Pza. Taller 3'],
        ];

        foreach ($clientes as $c) {
            Cliente::updateOrCreate(['email' => $c['email']], $c);
        }

        // añadir clientes de prueba
        foreach (range(1, 5) as $i) {
            $email = "cliente{$i}@example.test";
            Cliente::updateOrCreate([
                'email' => $email,
            ], [
                'nombre' => "Cliente $i",
                'email' => $email,
                'phone' => '555-03' . $i,
                'address' => "Direccion $i",
            ]);
        }
    }
}
