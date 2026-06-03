<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('enrollment_requests', function (Blueprint $table) {
            if (! Schema::hasColumn('enrollment_requests', 'xendit_invoice_id')) {
                $table->string('xendit_invoice_id', 255)->nullable()->after('payment_reference');
            }
        });
    }

    public function down(): void
    {
        Schema::table('enrollment_requests', function (Blueprint $table) {
            if (Schema::hasColumn('enrollment_requests', 'xendit_invoice_id')) {
                $table->dropColumn('xendit_invoice_id');
            }
        });
    }
};
