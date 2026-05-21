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
            if (Schema::hasColumn('questions', 'module_id')) {
                try {
                    $table->unsignedInteger('module_id')->nullable()->change();
                } catch (\Exception $e) {
                    // ignore if change fails due to DB configuration
                }
            }

            if (!Schema::hasColumn('questions', 'certification_id')) {
                $table->foreignId('certification_id')->nullable()->after('module_id')->constrained()->cascadeOnDelete();
            }

            if (!Schema::hasColumn('questions', 'question_type')) {
                $table->string('question_type')->default('quiz')->after('question_text');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('questions', function (Blueprint $table) {
            if (Schema::hasColumn('questions', 'question_type')) {
                $table->dropColumn('question_type');
            }
            if (Schema::hasColumn('questions', 'certification_id')) {
                $table->dropForeign(['certification_id']);
                $table->dropColumn('certification_id');
            }
            if (Schema::hasColumn('questions', 'module_id')) {
                try {
                    $table->unsignedInteger('module_id')->nullable(false)->change();
                } catch (\Exception $e) {
                    // ignore
                }
            }
        });
    }
};
