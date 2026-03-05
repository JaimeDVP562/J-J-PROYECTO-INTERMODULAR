<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            if (!Schema::hasColumn('ventas', 'cliente_id')) {
                $table->unsignedBigInteger('cliente_id')->nullable()->after('user_id');
            }
            if (!Schema::hasColumn('ventas', 'notas')) {
                $table->string('notas')->nullable()->after('metodo_pago');
            }
            if (!Schema::hasColumn('ventas', 'devuelta')) {
                $table->boolean('devuelta')->default(false)->after('notas');
            }
        });
    }

    public function down(): void
    {
        Schema::table('ventas', function (Blueprint $table) {
            $table->dropColumn(['cliente_id', 'notas', 'devuelta']);
        });
    }
};
