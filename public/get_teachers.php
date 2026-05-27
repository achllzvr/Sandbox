<?php

require __DIR__.'/../vendor/autoload.php';
$app = require_once __DIR__.'/../bootstrap/app.php';
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

$teachers = \App\Models\User::where('role', 'teacher')->get(['email', 'first_name', 'last_name']);
header('Content-Type: application/json');
echo json_encode($teachers, JSON_PRETTY_PRINT);
