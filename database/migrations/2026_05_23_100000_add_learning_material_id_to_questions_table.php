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
        Schema::table('questions', function (Blueprint $table) {
            if (!Schema::hasColumn('questions', 'learning_material_id')) {
                $table->foreignId('learning_material_id')
                    ->nullable()
                    ->after('certification_id')
                    ->constrained('learning_materials')
                    ->cascadeOnDelete();
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'learning_material_id')) {
                $table->dropForeign(['learning_material_id']);
                $table->dropColumn('learning_material_id');
            }
        });
    }
};
