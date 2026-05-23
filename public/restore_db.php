<?php

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\File;

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$response = $kernel->handle(
    $request = Illuminate\Http\Request::capture()
);

echo "<h1>Database Restoration in Progress...</h1>";

try {
    // 1. Drop all tables
    echo "<p>Dropping all existing tables...</p>";
    Schema::dropAllTables();

    // 2. Remove the default conflicting Laravel migrations
    $migrationsPath = base_path('database/migrations');
    $conflictingFiles = [
        '2014_10_12_000000_create_users_table.php',
        '2014_10_12_100000_create_password_resets_table.php',
        '2019_08_19_000000_create_failed_jobs_table.php',
        '2019_12_14_000001_create_personal_access_tokens_table.php',
    ];

    foreach ($conflictingFiles as $file) {
        $filePath = $migrationsPath . '/' . $file;
        if (File::exists($filePath)) {
            File::delete($filePath);
            echo "<p>Removed conflicting migration: {$file}</p>";
        }
    }

    // 3. Execute the raw SQL dumps
    $certificationsSql = database_path('certifications.sql');
    $schemaUpdatesSql = database_path('schema_updates.sql');

    if (File::exists($certificationsSql)) {
        echo "<p>Importing certifications.sql...</p>";
        DB::unprepared(File::get($certificationsSql));
    }

    if (File::exists($schemaUpdatesSql)) {
        echo "<p>Importing schema_updates.sql...</p>";
        DB::unprepared(File::get($schemaUpdatesSql));
    }

    // 4. Run the remaining Laravel migrations
    echo "<p>Running new Laravel migrations...</p>";
    Artisan::call('migrate', ['--force' => true]);
    echo "<pre>" . Artisan::output() . "</pre>";

    echo "<h2 style='color: green;'>✅ Database restored and successfully migrated!</h2>";
    echo "<p>You can now go back to <a href='/'>the homepage</a>. Note: Please register your 'cupscuddles' account again, as the database was restored to its original baseline state.</p>";

} catch (\Exception $e) {
    echo "<h2 style='color: red;'>❌ Error restoring database:</h2>";
    echo "<pre>" . $e->getMessage() . "</pre>";
}
