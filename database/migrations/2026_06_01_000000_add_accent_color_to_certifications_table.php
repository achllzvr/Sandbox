<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('certifications', function (Blueprint $table) {
            if (! Schema::hasColumn('certifications', 'accent_color')) {
                $table->string('accent_color', 7)->nullable()->after('thumbnail');
            }
        });
    }

    public function down(): void
    {
        Schema::table('certifications', function (Blueprint $table) {
            if (Schema::hasColumn('certifications', 'accent_color')) {
                $table->dropColumn('accent_color');
            }
        });
    }
};
