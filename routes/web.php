<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\Staff\StaffController;
use App\Http\Controllers\UserDashboardController;
use App\Models\Certification;

//Pages
Route::get('/', function () {
    return view('pages.home');
})->name('home');

// Login / Logout
Route::get('/login', [AuthController::class, 'showLogin'])->name('login');
Route::post('/login', [AuthController::class, 'login'])->name('login.submit');
Route::post('/logout', [AuthController::class, 'logout'])->name('logout');

// Registration
Route::get('/register', function () {
    return view('auth.register');
})->name('register.show');

Route::post('/register', [AuthController::class, 'register'])->name('register.store');

// Admin routes
Route::middleware(['role:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', [AdminController::class, 'dashboard'])->name('dashboard');

    Route::get('/create-staff', function () {
        return view('admin.create-staff');
    })->name('staff.create');

    Route::post('/create-staff', [AdminController::class, 'createStaff'])->name('staff.store');

    Route::get('/create-certification', function () {
        return view('admin.create-certification');
    })->name('certifications.create');

    Route::post('/create-certification', [AdminController::class, 'createCertification'])->name('certifications.store');

    Route::get('/create-lesson', [AdminController::class, 'showCreateLesson'])->name('lessons.create');
    Route::post('/create-lesson', [AdminController::class, 'createLesson'])->name('lessons.store');

    Route::get('/vouchers', [AdminController::class, 'showVouchers'])->name('vouchers.index');
    Route::post('/vouchers', [AdminController::class, 'createVoucher'])->name('vouchers.store');

    Route::get('/enrollments', [AdminController::class, 'enrollments'])->name('enrollments');
});

// Staff routes
Route::middleware(['role:staff'])->prefix('staff')->name('staff.')->group(function () {
    Route::get('/dashboard', [StaffController::class, 'dashboard'])->name('dashboard');

    Route::get('/create-lesson', [StaffController::class, 'showCreateLesson'])->name('lessons.create');
    Route::post('/create-lesson', [StaffController::class, 'createLesson'])->name('lessons.store');

    Route::get('/upload-module', [StaffController::class, 'uploadModule'])->name('modules.create');
    Route::post('/create-module', [StaffController::class, 'createModule'])->name('modules.store');

    Route::get('/upload-questions', [StaffController::class, 'showUploadQuestions'])->name('questions.create');
    Route::post('/store-question', [StaffController::class, 'storeQuestion'])->name('questions.store');

    Route::get('/enrollments', [StaffController::class, 'enrollments'])->name('enrollments');
});

// User routes
Route::middleware(['role:user'])->prefix('user')->name('user.')->group(function () {
    Route::get('/dashboard', [UserDashboardController::class, 'dashboard'])->name('dashboard');
    Route::get('/enroll/{certification}', [UserDashboardController::class, 'showEnroll'])->name('enroll.show');
    Route::post('/enroll/{certification}', [UserDashboardController::class, 'enroll'])->name('enroll.store');
});
