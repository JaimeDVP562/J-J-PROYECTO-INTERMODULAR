<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (Schema::hasTable('productos') && Schema::hasTable('proveedores')) {
            // only add FK if the column exists and FK not present
            if (Schema::hasColumn('productos', 'proveedor_id')) {
                Schema::table('productos', function (Blueprint $table) {
                    $table->foreign('proveedor_id')->references('id')->on('proveedores')->onDelete('cascade');
                });
            }
        }
    }

    public function down(): void
    {
        if (Schema::hasTable('productos') && Schema::hasColumn('productos', 'proveedor_id')) {
            try {
                Schema::table('productos', function (Blueprint $table) {
                    $table->dropForeign(['proveedor_id']);
                });
            } catch (\Exception $e) {
                // ignore if foreign doesn't exist
            }
        }
    }
};
