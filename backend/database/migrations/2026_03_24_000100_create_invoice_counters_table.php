<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\DB;

return new class() extends Migration
{
    public function up()
    {
        Schema::create('invoice_counters', function (Blueprint $table) {
            $table->string('series')->primary();
            $table->unsignedBigInteger('last')->default(0);
            $table->timestamps();
        });

        // Seed counters from existing facturas (if any)
        if (Schema::hasTable('facturas')) {
            $seriesList = DB::table('facturas')->distinct()->pluck('series');
            $now = now();
            foreach ($seriesList as $series) {
                $last = DB::table('facturas')->where('series', $series)->max('number');
                $last = $last === null ? 0 : (int)$last;
                DB::table('invoice_counters')->insert([
                    'series' => $series,
                    'last' => $last,
                    'created_at' => $now,
                    'updated_at' => $now,
                ]);
            }
        }
    }

    public function down()
    {
        Schema::dropIfExists('invoice_counters');
    }
};
