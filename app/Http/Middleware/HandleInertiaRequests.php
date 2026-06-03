<?php

namespace App\Http\Middleware;

use App\Models\UserModuleProgress;
use App\Services\GamificationService;
use App\Support\UploadLimits;
use Illuminate\Http\Request;
use Inertia\Middleware;
use Tightenco\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    protected $rootView = 'app';

    public function version(Request $request): string|null
    {
        return parent::version($request);
    }

    public function share(Request $request): array
    {
        return array_merge(parent::share($request), [
            'auth' => [
                'user' => $request->user(),
            ],
            'studentGamification' => function () use ($request) {
                $user = $request->user();
                if (! $user || $user->role !== 'user') {
                    return null;
                }

                return app(GamificationService::class)->summaryForUser($user);
            },
            'teacherPortalSummary' => function () use ($request) {
                $user = $request->user();
                if (! $user || $user->role !== 'teacher') {
                    return null;
                }

                $teacherId = $user->id;
                $totalStudents = \Illuminate\Support\Facades\DB::table('cohort_students')
                    ->join('cohorts', 'cohorts.id', '=', 'cohort_students.cohort_id')
                    ->where('cohorts.teacher_id', $teacherId)
                    ->count();

                $claimed = \App\Models\Voucher::where('teacher_id', $teacherId)->where('is_used', true)->count();
                $unclaimed = \App\Models\Voucher::where('teacher_id', $teacherId)->where('is_used', false)->count();

                return [
                    'affiliation' => $user->affiliation,
                    'total_students' => $totalStudents,
                    'vouchers_claimed' => $claimed,
                    'vouchers_unclaimed' => $unclaimed,
                ];
            },
            'mustVerifyEmail' => fn () => $request->user() && $request->user()->email_verified_at === null,
            'status' => fn () => $request->session()->get('status'),
            'flash' => [
                'success' => fn () => $request->session()->get('success'),
                'error'   => fn () => $request->session()->get('error'),
                'shop_success' => fn () => $request->session()->get('shop_success'),
                'teacher_purchase_success' => fn () => $request->session()->get('teacher_purchase_success'),
                'voucher_email_sent' => fn () => $request->session()->get('voucher_email_sent'),
                'xendit_checkout_url' => fn () => $request->session()->get('xendit_checkout_url'),
            ],
            'uploadLimits' => fn () => UploadLimits::forFrontend(),
            'ziggy' => function () use ($request) {
                return array_merge((new Ziggy)->toArray(), [
                    'location' => $request->url(),
                ]);
            },
        ]);
    }
}
