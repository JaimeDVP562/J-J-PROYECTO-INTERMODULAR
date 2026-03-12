<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            if (!Schema::hasColumn('ventas', 'tipo')) {
                $table->string('tipo')->default('venta')->after('devuelta');
            }
            if (!Schema::hasColumn('ventas', 'concepto')) {
                $table->string('concepto')->nullable()->after('tipo');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['tipo', 'concepto']);
        });
    }
};
