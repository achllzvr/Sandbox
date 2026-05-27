<?php
require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Http\Kernel::class);
$kernel->handle(Illuminate\Http\Request::capture());

use Illuminate\Support\Facades\DB;

header('Content-Type: text/plain');

try {
    echo "=== SETTING CERTIFICATION PRICES ===\n";
    
    // Update all certification prices to 1500.00
    $affected = DB::update("UPDATE certifications SET price = 1500.00 WHERE price = 0.00 OR price IS NULL");
    echo "Updated {$affected} certifications to price 1500.00.\n";
    
    // Verify the update
    echo "\nUpdated Certifications:\n";
    $certs = DB::select("SELECT id, title, price, status FROM certifications");
    foreach ($certs as $cert) {
        print_r($cert);
    }

    echo "\n=== DONE ===\n";
} catch (\Exception $e) {
    echo "Error: " . $e->getMessage() . "\n";
}
