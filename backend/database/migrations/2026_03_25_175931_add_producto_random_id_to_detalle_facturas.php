<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('detalle_facturas', function (Blueprint $table) {
            $table->unsignedBigInteger('producto_random_id')->nullable()->after('producto_id');
            $table->foreign('producto_random_id')->references('id')->on('productos_random')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::table('detalle_facturas', function (Blueprint $table) {
            if (Schema::hasColumn('detalle_facturas', 'producto_random_id')) {
                $table->dropForeign(['producto_random_id']);
                $table->dropColumn('producto_random_id');
            }
        });
    }
};
