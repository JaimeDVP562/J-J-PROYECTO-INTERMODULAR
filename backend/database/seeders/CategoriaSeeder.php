<?php

namespace Database\Seeders;

use App\Models\Categoria;
use Illuminate\Database\Seeder;

class CategoriaSeeder extends Seeder
{
    public function run(): void
    {
        $categorias = ['Interior', 'Exterior', 'Imprimacion', 'Barniz', 'Decorativa'];

        foreach ($categorias as $c) {
            Categoria::create(['nombre' => $c]);
        }
    }
}
