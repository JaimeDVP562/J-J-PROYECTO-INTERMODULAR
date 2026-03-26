<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        // Use raw statement to alter column nullability without requiring doctrine/dbal
        DB::statement('ALTER TABLE `detalle_facturas` MODIFY `producto_id` BIGINT UNSIGNED NULL');
    }

    public function down(): void
    {
        DB::statement('ALTER TABLE `detalle_facturas` MODIFY `producto_id` BIGINT UNSIGNED NOT NULL');
    }
};
