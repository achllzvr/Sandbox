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
        if (!Schema::hasTable('learning_materials')) {
            Schema::create('learning_materials', function (Blueprint $table) {
                $table->id();
                $table->foreignId('certification_id')->constrained('certifications')->onDelete('cascade');
                $table->string('title');
                $table->enum('type', ['ppt', 'document', 'youtube_video']);
                $table->string('file_path')->nullable();
                $table->string('youtube_embed_url')->nullable();
                $table->text('description')->nullable();
                $table->integer('order_number')->default(0);
                $table->timestamps();
            });
        }
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('learning_materials');
    }
};
