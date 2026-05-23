<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';

// Boot the console kernel (mimics php artisan CLI command)
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

header('Content-Type: text/plain');

try {
    echo "Running migrations...\n";
    $exitCode = \Illuminate\Support\Facades\Artisan::call('migrate', ['--force' => true]);
    echo "Exit Code: " . $exitCode . "\n";
    echo \Illuminate\Support\Facades\Artisan::output();
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
