<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Proveedor;

class ProveedorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $proveedores = [
            [
                'nombre' => 'Informática Global S.A.',
                'direccion' => 'Calle Mayor 10, Madrid',
                'nif' => 'A12345678',
                'email' => 'contacto@infoglobal.com',
                'telefono' => '911223344',
            ],
            [
                'nombre' => 'ElectroDistribuciones SL',
                'direccion' => 'Av. Andalucía 55, Sevilla',
                'nif' => 'B87654321',
                'email' => 'ventas@electrodistribuciones.es',
                'telefono' => '954112233',
            ],
            [
                'nombre' => 'Componentes y Más',
                'direccion' => 'Polígono Norte, Valencia',
                'nif' => 'C11223344',
                'email' => 'info@componentesymas.com',
                'telefono' => '963445566',
            ],
        ];

        foreach ($proveedores as $proveedor) {
            Proveedor::create($proveedor);
        }
    }
}
