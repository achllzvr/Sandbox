<?php
require __DIR__.'/vendor/autoload.php';
$app = require_once __DIR__.'/bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();
$hash = App\Models\User::where('email', 'admin@gmail.com')->first()->password;
echo "Hash: " . $hash . "\n";
echo "Matches admin123: " . (\Illuminate\Support\Facades\Hash::check('admin123', $hash) ? 'YES' : 'NO') . "\n";
