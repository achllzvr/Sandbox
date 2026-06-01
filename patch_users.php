<?php
require 'vendor/autoload.php';
$app = require_once 'bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

use Illuminate\Support\Facades\Schema;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

Schema::table('users', function(Blueprint $table) {
    if (!Schema::hasColumn('users', 'status')) {
        $table->string('status')->default('active');
        $table->string('institutional_credentials_url')->nullable();
        $table->unsignedBigInteger('verified_by')->nullable();
        $table->timestamp('verified_at')->nullable();
        $table->integer('sand_dollars')->default(0);
        
        // Convert enum role to string to allow 'teacher'
        DB::statement("ALTER TABLE users MODIFY COLUMN role VARCHAR(50) DEFAULT 'user'");
    }
});

// Create the missing users
User::updateOrCreate(
    ['email' => 'roanbaral3@gmail.com'], 
    [
        'first_name' => 'Roan', 
        'last_name' => 'Baral', 
        'password' => Hash::make('G!G1mu32'), 
        'birthday' => '2000-01-01',
        'contact_no' => '09000000000',
        'role' => 'user', 
        'status' => 'active'
    ]
);

User::updateOrCreate(
    ['email' => 'ahmadpaguta2005@gmail.com'], 
    [
        'first_name' => 'Ahmad', 
        'last_name' => 'Paguta', 
        'password' => Hash::make('Akoitosi'), 
        'birthday' => '2000-01-01',
        'contact_no' => '09000000000',
        'role' => 'teacher', 
        'status' => 'active'
    ]
);

User::updateOrCreate(
    ['email' => 'admin@example.com'], 
    [
        'first_name' => 'Admin', 
        'last_name' => 'User', 
        'password' => Hash::make('admin123'), 
        'birthday' => '2000-01-01',
        'contact_no' => '09000000000',
        'role' => 'admin', 
        'status' => 'active'
    ]
);

echo "Success!";
