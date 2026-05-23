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
        Schema::table('certifications', function (Blueprint $table) {
            if (!Schema::hasColumn('certifications', 'category')) {
                $table->string('category')->nullable()->after('description');
            }
            if (!Schema::hasColumn('certifications', 'difficulty')) {
                $table->string('difficulty')->nullable()->after('category');
            }
            if (!Schema::hasColumn('certifications', 'estimated_duration')) {
                $table->string('estimated_duration')->nullable()->after('difficulty');
            }
            if (!Schema::hasColumn('certifications', 'thumbnail')) {
                $table->string('thumbnail')->nullable()->after('estimated_duration');
            }
            if (!Schema::hasColumn('certifications', 'learning_objectives')) {
                $table->text('learning_objectives')->nullable()->after('thumbnail');
            }
            if (!Schema::hasColumn('certifications', 'prerequisites')) {
                $table->text('prerequisites')->nullable()->after('learning_objectives');
            }
            if (!Schema::hasColumn('certifications', 'tags')) {
                $table->json('tags')->nullable()->after('prerequisites');
            }
            if (!Schema::hasColumn('certifications', 'remarks')) {
                $table->text('remarks')->nullable()->after('status');
            }
            if (!Schema::hasColumn('certifications', 'submitted_at')) {
                $table->timestamp('submitted_at')->nullable()->after('remarks');
            }
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('certifications', function (Blueprint $table) {
            $table->dropColumn([
                'category',
                'difficulty',
                'estimated_duration',
                'thumbnail',
                'learning_objectives',
                'prerequisites',
                'tags',
                'remarks',
                'submitted_at',
            ]);
        });
    }
};
