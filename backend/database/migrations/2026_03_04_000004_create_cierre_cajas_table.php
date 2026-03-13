<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('cierre_cajas')) {
            Schema::create('cierre_cajas', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->date('fecha');
                $table->decimal('efectivo_retirado', 10, 2)->default(0);
                $table->decimal('importe_datafono', 10, 2)->default(0);
                $table->decimal('total_ventas', 10, 2)->default(0);
                $table->decimal('diferencia', 10, 2)->default(0);
                $table->text('notas')->nullable();
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('cierre_cajas');
    }
};
