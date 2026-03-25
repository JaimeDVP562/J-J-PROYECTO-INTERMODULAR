<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Empresa;

class EmpresaSeeder extends Seeder
{
    public function run(): void
    {
        Empresa::updateOrCreate([
            'nif' => 'B00000000'
        ], [
            'nombre_fiscal' => 'Mi Empresa S.L.',
            'nombre_comercial' => 'Mi Empresa',
            'direccion' => 'Calle Falsa 123',
            'ciudad' => 'Ciudad',
            'codigo_postal' => '28000',
            'pais' => 'ES',
            'telefono' => '+34 600 000 000',
            'email' => 'info@miempresa.test',
            'iban' => 'ES7921000813610123456789',
            'iva_regimen' => 'general',
            // store structured extra data; include default_series used by app
            'extra' => [
                'note' => 'Seeded default empresa',
                'default_series' => 'F'
            ]
        ]);
    }
}
