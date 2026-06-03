<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            if (! Schema::hasColumn('users', 'id_front_url')) {
                $table->string('id_front_url', 500)->nullable()->after('institutional_credentials_url');
            }
            if (! Schema::hasColumn('users', 'id_back_url')) {
                $table->string('id_back_url', 500)->nullable()->after('id_front_url');
            }
            if (! Schema::hasColumn('users', 'authorization_letter_url')) {
                $table->string('authorization_letter_url', 500)->nullable()->after('id_back_url');
            }
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn(['id_front_url', 'id_back_url', 'authorization_letter_url']);
        });
    }
};
