<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('facturas', function (Blueprint $table) {
            $table->string('series')->nullable()->after('id');
            $table->integer('number')->nullable()->after('series');
            $table->string('invoice_id')->nullable()->after('number');
            $table->date('issue_date')->nullable()->after('invoice_date');
            $table->date('operation_date')->nullable()->after('issue_date');
            $table->string('invoice_type')->nullable()->after('operation_date');
            $table->string('rectified_invoice')->nullable()->after('invoice_type');
            $table->decimal('gross_amount', 15, 2)->nullable()->after('rectified_invoice');
            $table->decimal('tax_amount', 15, 2)->nullable()->after('gross_amount');
            $table->json('tax_breakdown')->nullable()->after('tax_amount');
            $table->string('payment_method')->nullable()->after('due_date');
            $table->date('payment_due_date')->nullable()->after('payment_method');
            $table->string('iban')->nullable()->after('payment_due_date');
            $table->json('verifactu')->nullable()->after('iban');
        });
    }

    public function down(): void
    {
        Schema::table('facturas', function (Blueprint $table) {
            $table->dropColumn([
                'series', 'number', 'invoice_id', 'issue_date', 'operation_date', 'invoice_type', 'rectified_invoice',
                'gross_amount', 'tax_amount', 'tax_breakdown', 'payment_method', 'payment_due_date', 'iban', 'verifactu'
            ]);
        });
    }
};
