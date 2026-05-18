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
            $table->string('category')->nullable()->after('description');
            $table->string('difficulty')->nullable()->after('category');
            $table->string('estimated_duration')->nullable()->after('difficulty');
            $table->string('thumbnail')->nullable()->after('estimated_duration');
            $table->text('learning_objectives')->nullable()->after('thumbnail');
            $table->text('prerequisites')->nullable()->after('learning_objectives');
            $table->json('tags')->nullable()->after('prerequisites');
            $table->text('remarks')->nullable()->after('status');
            $table->timestamp('submitted_at')->nullable()->after('remarks');
            // Using existing decline_reason as rejection_reason, no need to add rejection_reason
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
