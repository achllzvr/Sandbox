<?php

use App\Http\Controllers\Admin\CertificationApprovalController;
use App\Http\Controllers\Creator\CertificationController;
use App\Http\Controllers\Creator\LessonController;
use App\Http\Controllers\Creator\ModuleContentController;
use App\Http\Controllers\Creator\ModuleController;
use App\Http\Controllers\Creator\QuestionController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\MarketplaceController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

Route::get('/', function () {
    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
        'laravelVersion' => Application::VERSION,
        'phpVersion' => PHP_VERSION,
    ]);
})->name('welcome');

/*
|--------------------------------------------------------------------------
| Authenticated Dashboard Redirect
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    $user = auth()->user();

    return match ($user->role) {
        'admin' => redirect()->route('admin.certifications.pending'),
        'staff' => redirect()->route('creator.certifications.index'),
        'teacher' => redirect()->route('teacher.dashboard'),
        default => redirect()->route('marketplace.index'),
    };
})->middleware(['auth', 'otp.verified'])->name('dashboard');

/*
|--------------------------------------------------------------------------
| Shared Profile Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'otp.verified'])->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');
});

/*
|--------------------------------------------------------------------------
| Creator / Staff Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'otp.verified', 'role:staff'])
    ->prefix('creator')
    ->name('creator.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return redirect()->route('creator.certifications.index');
        })->name('dashboard');

        Route::resource('certifications', CertificationController::class)
            ->except(['show', 'destroy']);

        Route::post('certifications/{certification}/submit', [CertificationController::class, 'submit'])
            ->name('certifications.submit');

        Route::post('lessons', [LessonController::class, 'store'])
            ->name('lessons.store');

        Route::post('modules', [ModuleController::class, 'store'])
            ->name('modules.store');

        Route::post('modules/{module}/content', [ModuleContentController::class, 'store'])
            ->name('modules.content.store');

        Route::post('modules/{module}/questions', [QuestionController::class, 'store'])
            ->name('modules.questions.store');
    });

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'otp.verified', 'role:admin'])
    ->prefix('admin')
    ->name('admin.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return redirect()->route('admin.certifications.pending');
        })->name('dashboard');

        Route::get('certifications/pending', [CertificationApprovalController::class, 'index'])
            ->name('certifications.pending');

        Route::put('certifications/{certification}/status', [CertificationApprovalController::class, 'update'])
            ->name('certifications.status.update');
    });

/*
|--------------------------------------------------------------------------
| Student / Learner Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'otp.verified', 'role:user'])
    ->prefix('student')
    ->name('student.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return redirect()->route('marketplace.index');
        })->name('dashboard');
    });

Route::middleware(['auth', 'otp.verified', 'role:user'])
    ->get('/marketplace', [MarketplaceController::class, 'index'])
    ->name('marketplace.index');

/*
|--------------------------------------------------------------------------
| Teacher Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'otp.verified', 'role:teacher'])
    ->prefix('teacher')
    ->name('teacher.')
    ->group(function () {
        Route::get('/dashboard', function () {
            return Inertia::render('Teacher/Dashboard');
        })->name('dashboard');
    });

require __DIR__ . '/auth.php';