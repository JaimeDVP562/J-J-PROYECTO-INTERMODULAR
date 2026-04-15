<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->string('apellido')->nullable()->after('nombre');
            $table->string('telefono', 20)->nullable()->after('email');
            $table->string('puesto', 100)->nullable()->after('telefono');
            $table->decimal('salario', 10, 2)->nullable()->after('puesto');
            $table->date('fecha_contratacion')->nullable()->after('salario');
        });

        Schema::dropIfExists('empleados');
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['apellido', 'telefono', 'puesto', 'salario', 'fecha_contratacion']);
        });

        Schema::create('empleados', function (Blueprint $table) {
            $table->id();
            $table->string('nombre');
            $table->string('apellido');
            $table->string('email')->unique();
            $table->string('telefono')->nullable();
            $table->date('fecha_contratacion');
            $table->decimal('salario', 10, 2)->nullable();
            $table->string('puesto');
            $table->timestamps();
        });
    }
};
