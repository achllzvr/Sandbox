<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'default_certification_id')) {
                $table->unsignedBigInteger('default_certification_id')->nullable()->after('role');
                $table->foreign('default_certification_id')
                    ->references('id')
                    ->on('certifications')
                    ->nullOnDelete();
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropForeign(['default_certification_id']);
            $table->dropColumn('default_certification_id');
        });
    }
};
