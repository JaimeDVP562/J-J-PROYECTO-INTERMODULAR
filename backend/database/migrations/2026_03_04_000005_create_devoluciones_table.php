<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('devoluciones')) {
            Schema::create('devoluciones', function (Blueprint $table) {
                $table->id();
                $table->foreignId('venta_id')->constrained('ventas')->onDelete('cascade');
                $table->foreignId('user_id')->constrained('users')->onDelete('cascade');
                $table->text('motivo')->nullable();
                $table->decimal('importe', 10, 2);
                $table->timestamp('fecha');
                $table->timestamps();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('devoluciones');
    }
};
