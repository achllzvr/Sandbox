<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$attempted = Auth::attempt(['email' => 'admin@gmail.com', 'password' => 'admin123']);
echo "Attempted: " . ($attempted ? 'SUCCESS' : 'FAILED') . "\n";
