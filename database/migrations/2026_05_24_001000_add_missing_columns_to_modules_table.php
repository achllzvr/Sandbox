<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            if (!Schema::hasColumn('modules', 'sequence')) {
                $table->integer('sequence')->default(1)->after('order_index');
            }
            if (!Schema::hasColumn('modules', 'uploaded_by_content_creator_id')) {
                $table->unsignedBigInteger('uploaded_by_content_creator_id')->nullable()->after('uploaded_by_user_id');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('modules', function (Blueprint $table) {
            if (Schema::hasColumn('modules', 'sequence')) {
                $table->dropColumn('sequence');
            }
            if (Schema::hasColumn('modules', 'uploaded_by_content_creator_id')) {
                $table->dropColumn('uploaded_by_content_creator_id');
            }
        });
    }
};
