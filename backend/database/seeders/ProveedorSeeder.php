<?php

namespace Database\Seeders;

use App\Models\Proveedor;
use Illuminate\Database\Seeder;

class ProveedorSeeder extends Seeder
{
    public function run(): void
    {
        $proveedores = [
            ['nombre' => 'Pinturas y Suministros SA', 'contact_email' => 'ventas@pys.sa', 'phone' => '555-0100', 'address' => 'Calle Falsa 123'],
            ['nombre' => 'Colores del Norte', 'contact_email' => 'contacto@coloresnorte.com', 'phone' => '555-0101', 'address' => 'Av. Central 45'],
            ['nombre' => 'Barnices y Acabados', 'contact_email' => 'info@barnices.com', 'phone' => '555-0102', 'address' => 'Pol. Ind. 9'],
            ['nombre' => 'Distribuciones Color', 'contact_email' => 'comercial@distcolor.com', 'phone' => '555-0103', 'address' => 'Calle Comercio 7'],
            ['nombre' => 'Proveedora Local', 'contact_email' => 'ventas@local.com', 'phone' => '555-0104', 'address' => 'Plaza 1'],
        ];

        foreach ($proveedores as $p) {
            Proveedor::create($p);
        }
    }
}
