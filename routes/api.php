<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/webhooks/xendit', [\App\Http\Controllers\Api\XenditWebhookController::class, 'handle'])->name('webhooks.xendit');

