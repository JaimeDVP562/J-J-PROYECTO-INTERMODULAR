<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\ProveedorSeeder;
use Database\Seeders\CategoriaSeeder;
use Database\Seeders\ProductoSeeder;
use Database\Seeders\ClienteSeeder;
use Database\Seeders\InventarioSeeder;
use Database\Seeders\FacturaSeeder;
use Database\Seeders\VentaSeeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Core seeders for a minimal realistic dataset
        $this->call(UserSeeder::class);
        $this->call(ProveedorSeeder::class);
        $this->call(\Database\Seeders\EmpresaSeeder::class);
        $this->call(CategoriaSeeder::class);
        $this->call(ProductoSeeder::class);
        $this->call(ClienteSeeder::class);
        $this->call(InventarioSeeder::class);
        $this->call(FacturaSeeder::class);
        $this->call(VentaSeeder::class);
    }
}
