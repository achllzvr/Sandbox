<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Staff\StaffController;

// Public Routes
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Authenticated Routes
Route::middleware('auth:sanctum')->group(function () {
    
    // Admin Only
    Route::middleware('role:admin')->prefix('admin')->group(function () {
        Route::post('/staff', [AdminController::class, 'storeStaff']);
        Route::post('/certifications', [AdminController::class, 'storeCertification']);
    });

    // Staff Only (Teachers)
    Route::middleware('role:staff')->prefix('staff')->group(function () {
        Route::post('/lessons', [StaffController::class, 'storeLesson']);
        Route::post('/modules', [StaffController::class, 'storeModule']);
        Route::post('/modules/content', [StaffController::class, 'storeModuleContent']);
    });

    // User/Taker Specific Endpoints would go here...
    // Route::middleware('role:user')->prefix('user')->group(function () { ... });
});