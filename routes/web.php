<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\CertificationApprovalController;
use App\Http\Controllers\Admin\UserManagementController;
use App\Http\Controllers\Admin\TeacherVerificationController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\FinanceController;
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
        'authUser' => auth()->user(),
    ]);
})->name('welcome');

/*
|--------------------------------------------------------------------------
| Authenticated Dashboard Redirect
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    $user = auth()->user();

    \Illuminate\Support\Facades\Log::info('Dashboard route hit by: ' . $user->email . ' with role: ' . $user->role);

    return match ($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
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
        // Dashboard
        Route::get('/dashboard', [AdminDashboardController::class, 'index'])
            ->name('dashboard');

    // User Management
    Route::prefix('users')->name('users.')->group(function () {
        Route::get('/', [\App\Http\Controllers\Admin\UserManagementController::class, 'index'])->name('index');
        Route::post('/invite', [\App\Http\Controllers\Admin\UserManagementController::class, 'invite'])->name('invite');
        Route::put('/{user}/verify-teacher', [\App\Http\Controllers\Admin\UserManagementController::class, 'verifyTeacher'])->name('verify-teacher');
    });

        // Certification Approval
        Route::get('/certifications', [CertificationApprovalController::class, 'index'])
            ->name('certifications.index');
        Route::put('/certifications/{certification}/status', [CertificationApprovalController::class, 'update'])
            ->name('certifications.status.update');

        // Teacher Verification
        Route::get('/teachers', [TeacherVerificationController::class, 'index'])
            ->name('teachers.index');
        Route::put('/teachers/{user}/approve', [TeacherVerificationController::class, 'approve'])
            ->name('teachers.approve');
        Route::put('/teachers/{user}/decline', [TeacherVerificationController::class, 'decline'])
            ->name('teachers.decline');

        // Audit Logs
        Route::get('/audit-logs', [AuditLogController::class, 'index'])
            ->name('audit-logs.index');

        // Finance
        Route::get('/finance', [FinanceController::class, 'index'])
            ->name('finance.index');
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
        Route::get('/dashboard', [\App\Http\Controllers\Teacher\TeacherDashboardController::class, 'index'])->name('dashboard');
        Route::get('/purchasing', [\App\Http\Controllers\Teacher\TeacherDashboardController::class, 'purchasing'])->name('purchasing');
        Route::get('/vouchers', [\App\Http\Controllers\Teacher\TeacherDashboardController::class, 'vouchers'])->name('vouchers');
        Route::get('/analytics', [\App\Http\Controllers\Teacher\TeacherDashboardController::class, 'analytics'])->name('analytics');
    });

require __DIR__ . '/auth.php';

// Accept Invitation Routes
Route::middleware('guest')->group(function () {
    Route::get('/accept-invite/{token}', [\App\Http\Controllers\Auth\AcceptInvitationController::class, 'show'])->name('accept.invite');
    Route::post('/accept-invite', [\App\Http\Controllers\Auth\AcceptInvitationController::class, 'store'])->name('accept.invite.store');
});