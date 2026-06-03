<?php

use App\Http\Controllers\Admin\AdminDashboardController;
use App\Http\Controllers\Admin\AuditLogController;
use App\Http\Controllers\Admin\CertificationApprovalController;
use App\Http\Controllers\Admin\FinanceController;
use App\Http\Controllers\AffiliationController;
use App\Http\Controllers\Creator\AiQuizGenerationController;
use App\Http\Controllers\Creator\AnalyticsController;
use App\Http\Controllers\Creator\CertificationController;
use App\Http\Controllers\Creator\CreatorDashboardController;
use App\Http\Controllers\Creator\LearningMaterialController;
use App\Http\Controllers\Creator\ModuleContentController;
use App\Http\Controllers\Creator\ModuleController;
use App\Http\Controllers\Creator\QuestionController;
use App\Http\Controllers\Creator\WithdrawalController;
use App\Http\Controllers\Auth\PasswordController;
use App\Http\Controllers\ContentStreamController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Student\DashboardController as StudentDashboardController;
use App\Http\Controllers\Student\MarketplaceController;
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

Route::get('/affiliations', [AffiliationController::class, 'index'])->name('affiliations.index');

Route::get('/certificates/{code}', [\App\Http\Controllers\CertificateController::class, 'show'])
    ->name('certificates.public');

/*
|--------------------------------------------------------------------------
| Authenticated Dashboard Redirect
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    $user = auth()->user();

    \Illuminate\Support\Facades\Log::info('Dashboard route hit by: '.$user->email.' with role: '.$user->role);

    return match ($user->role) {
        'admin' => redirect()->route('admin.dashboard'),
        'content_creator', 'content_creator' => redirect()->route('creator.dashboard'),
        'teacher' => redirect()->route('teacher.dashboard'),
        default => redirect()->route('student.dashboard'),
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

    Route::put('/password', [PasswordController::class, 'update'])
        ->name('password.update');
});

Route::middleware(['auth', 'signed'])->get('/content/stream/{content}', [ContentStreamController::class, 'stream'])
    ->name('content.stream');

/*
|--------------------------------------------------------------------------
| Creator / content_creator Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth', 'otp.verified', 'role:content_creator'])
    ->prefix('creator')
    ->name('creator.')
    ->group(function () {
        Route::get('/dashboard', [CreatorDashboardController::class, 'index'])
            ->name('dashboard');

        Route::get('/auditor', [AnalyticsController::class, 'index'])
            ->name('auditor.index');

        Route::get('/wallet', [WithdrawalController::class, 'index'])
            ->name('wallet.index');

        Route::post('/wallet/withdraw', [WithdrawalController::class, 'store'])
            ->name('wallet.withdraw');

        Route::resource('certifications', CertificationController::class)
            ->except(['show', 'destroy']);

        Route::post('certifications/{certification}/submit', [CertificationController::class, 'submit'])
            ->name('certifications.submit');

        Route::post('certifications/{certification}/materials', [LearningMaterialController::class, 'store'])
            ->name('certifications.materials.store');

        Route::post('certifications/{certification}/materials/reorder', [LearningMaterialController::class, 'reorder'])
            ->name('certifications.materials.reorder');

        Route::delete('certifications/{certification}/materials/{material}', [LearningMaterialController::class, 'destroy'])
            ->name('certifications.materials.destroy');

        Route::post('certifications/{certification}/exam-questions', [CertificationController::class, 'storeExamQuestions'])
            ->name('certifications.exam-questions.store');

        Route::post('certifications/{certification}/materials/{material}/quiz-questions', [LearningMaterialController::class, 'storeQuizQuestions'])
            ->name('certifications.materials.quiz-questions.store');

        // Sandbox (Module) management routes
        Route::post('certifications/{certification}/modules', [ModuleController::class, 'store'])
            ->name('modules.store');
        Route::post('certifications/{certification}/modules/reorder', [ModuleController::class, 'reorder'])
            ->name('modules.reorder');
        Route::put('modules/{module}', [ModuleController::class, 'update'])
            ->name('modules.update');
        Route::delete('modules/{module}', [ModuleController::class, 'destroy'])
            ->name('modules.destroy');

        // Sandbox component (ModuleContent) management routes
        Route::post('modules/{module}/contents', [ModuleContentController::class, 'store'])
            ->name('modules.contents.store');
        Route::post('modules/{module}/contents/reorder', [ModuleContentController::class, 'reorder'])
            ->name('modules.contents.reorder');
        Route::delete('modules/{module}/contents/{content}', [ModuleContentController::class, 'destroy'])
            ->name('modules.contents.destroy');

        // Sandbox practice quiz (Short Test) route
        Route::post('modules/{module}/questions', [QuestionController::class, 'store'])
            ->name('modules.questions.store');

        Route::post('ai/generate-quiz', [AiQuizGenerationController::class, 'generate'])
            ->middleware('throttle:10,1')
            ->name('ai.generate-quiz');
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
        Route::get('/certifications/{certification}', [CertificationApprovalController::class, 'show'])
            ->name('certifications.show');
        Route::put('/certifications/{certification}/status', [CertificationApprovalController::class, 'update'])
            ->name('certifications.status.update');
        Route::put('/certifications/{certification}/request-revision', [CertificationApprovalController::class, 'requestRevision'])
            ->name('certifications.request_revision');

        Route::redirect('/teachers', '/admin/users?tab=approvals')->name('teachers.index');

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
        Route::get('/dashboard', [StudentDashboardController::class, 'index'])->name('dashboard');
        Route::post('/preferences/default-shell', [\App\Http\Controllers\Student\PreferencesController::class, 'updateDefaultShell'])
            ->name('preferences.default-shell');
        Route::get('/leaderboard', [\App\Http\Controllers\Student\LeaderboardController::class, 'index'])->name('leaderboard');
        Route::get('/cast', [\App\Http\Controllers\Student\CastController::class, 'index'])->name('cast');

        // Sandbox Enrollment & Voucher Flow
        Route::post('/enrollments/checkout', [\App\Http\Controllers\Student\EnrollmentController::class, 'checkout'])->name('enrollments.checkout');
        Route::post('/vouchers/redeem', [\App\Http\Controllers\Student\VoucherController::class, 'redeem'])->name('vouchers.redeem');

        // View a specific Shell (certification) - student view
        Route::get('/shells/{id}', [\App\Http\Controllers\Student\MyShellController::class, 'show'])->name('shells.show');

        // Mark a module as complete (video/ppt progress)
        Route::post('/shells/modules/{module}/complete', [\App\Http\Controllers\Student\MyShellController::class, 'completeModule'])
            ->middleware('enrolled')
            ->name('shells.modules.complete');

        Route::post('/modules/{module}/quiz/check', [\App\Http\Controllers\Student\QuizController::class, 'check'])
            ->middleware(['enrolled', 'throttle:30,1'])
            ->name('modules.quiz.check');
        Route::post('/modules/{module}/quiz/submit', [\App\Http\Controllers\Student\QuizController::class, 'submit'])
            ->middleware('enrolled')
            ->name('modules.quiz.submit');

        Route::post('/certifications/{certification}/exam/check', [\App\Http\Controllers\Student\ExamController::class, 'check'])
            ->middleware(['enrolled', 'throttle:30,1'])
            ->name('certifications.exam.check');
        Route::post('/certifications/{certification}/exam/submit', [\App\Http\Controllers\Student\ExamController::class, 'submit'])
            ->middleware('enrolled')
            ->name('certifications.exam.submit');
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
        Route::post('/checkout/bulk', [\App\Http\Controllers\Teacher\VoucherCheckoutController::class, 'store'])->name('checkout.bulk');

        Route::get('/shop', [\App\Http\Controllers\Teacher\TeacherShopController::class, 'index'])->name('shop.index');
        Route::redirect('/shop-legacy', '/teacher/purchasing');

        Route::get('/shells', [\App\Http\Controllers\Teacher\TeacherShellController::class, 'index'])->name('shells.index');
        Route::get('/shells/{certification}', [\App\Http\Controllers\Teacher\TeacherShellController::class, 'show'])->name('shells.show');
        Route::get('/shells/{certification}/batches/{cohort}', [\App\Http\Controllers\Teacher\TeacherShellController::class, 'batch'])->name('shells.batch');

        Route::post('/vouchers/{voucher}/send-email', [\App\Http\Controllers\Teacher\VoucherController::class, 'sendEmail'])->name('vouchers.send-email');
    });

require __DIR__.'/auth.php';

// Accept Invitation Routes
Route::middleware('guest')->group(function () {
    Route::get('/accept-invite/{token}', [\App\Http\Controllers\Auth\AcceptInvitationController::class, 'show'])->name('accept.invite');
    Route::post('/accept-invite', [\App\Http\Controllers\Auth\AcceptInvitationController::class, 'store'])->name('accept.invite.store');
});
