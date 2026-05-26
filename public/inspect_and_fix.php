<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;

header('Content-Type: text/plain');

try {
    echo "=== INSPECTING DATABASE ===\n";
    
    // Check if learning_materials table exists
    if (!Schema::hasTable('learning_materials')) {
        echo "Creating learning_materials table...\n";
        Schema::create('learning_materials', function (Blueprint $table) {
            $table->id();
            $table->foreignId('certification_id')->constrained()->cascadeOnDelete();
            $table->string('title');
            $table->string('type');
            $table->string('file_path')->nullable();
            $table->string('youtube_embed_url')->nullable();
            $table->text('description')->nullable();
            $table->integer('order_number')->default(0);
            $table->timestamps();
        });
        echo "Created learning_materials table.\n";
    } else {
        echo "learning_materials table exists.\n";
    }

    // Check if questions table exists
    if (Schema::hasTable('questions')) {
        echo "questions table exists.\n";
        
        // Add learning_material_id column if not exists
        if (!Schema::hasColumn('questions', 'learning_material_id')) {
            echo "Adding learning_material_id to questions table...\n";
            Schema::table('questions', function (Blueprint $table) {
                $table->foreignId('learning_material_id')
                    ->nullable()
                    ->after('certification_id')
                    ->constrained('learning_materials')
                    ->cascadeOnDelete();
            });
            echo "Successfully added learning_material_id column.\n";
        } else {
            echo "questions.learning_material_id column already exists.\n";
        }
    } else {
        echo "Error: questions table does not exist!\n";
    }

    echo "=== DONE ===\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
