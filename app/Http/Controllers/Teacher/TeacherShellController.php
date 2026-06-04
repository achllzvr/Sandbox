<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use App\Models\Certification;
use App\Models\Cohort;
use App\Models\EnrollmentRequest;
use App\Models\Voucher;
use App\Services\Teacher\CohortBatchAnalyticsService;
use App\Support\FormatAppDateTime;
use Inertia\Inertia;

class TeacherShellController extends Controller
{
    public function __construct(private CohortBatchAnalyticsService $batchAnalytics)
    {
    }

    public function index()
    {
        $teacherId = auth()->id();

        $certIds = Voucher::where('teacher_id', $teacherId)->pluck('certification_id')->unique();
        $shells = Certification::whereIn('id', $certIds)
            ->get()
            ->map(fn (Certification $cert) => $this->formatShellCard($cert));

        return Inertia::render('Teacher/Shells/Index', [
            'shells' => $shells,
            'purchaseHistory' => $this->purchaseHistoryForTeacher($teacherId),
            'isMock' => false,
        ]);
    }

    public function show(int $certification)
    {
        $teacherId = auth()->id();
        $cert = Certification::findOrFail($certification);

        $owns = Voucher::where('teacher_id', $teacherId)->where('certification_id', $certification)->exists();
        if (! $owns) {
            abort(403);
        }

        $cohorts = Cohort::where('teacher_id', $teacherId)
            ->where('certification_id', $certification)
            ->orderByDesc('created_at')
            ->get();

        $batches = $cohorts->map(fn (Cohort $cohort) => [
            'id' => $cohort->id,
            'label' => $cohort->cohort_name ?? 'Batch '.(FormatAppDateTime::format($cohort->created_at) ?? ''),
        ])->values();

        $voucherGroups = $cohorts->map(function (Cohort $cohort) use ($teacherId, $certification) {
            $vouchers = Voucher::with('usedByUser')
                ->where('teacher_id', $teacherId)
                ->where('certification_id', $certification)
                ->where('cohort_id', $cohort->id)
                ->orderByDesc('created_at')
                ->get()
                ->map(function (Voucher $voucher) {
                    $student = $voucher->usedByUser;

                    return [
                        'id' => $voucher->id,
                        'code' => $voucher->code,
                        'status' => $voucher->is_used ? 'claimed' : 'unclaimed',
                        'student_name' => $student ? trim($student->first_name.' '.$student->last_name) : null,
                        'student_email' => $student?->email,
                        'recipient_email' => $voucher->recipient_email,
                        'final_exam_unlocked_at' => FormatAppDateTime::format($voucher->final_exam_unlocked_at),
                        'updated_at' => FormatAppDateTime::format($voucher->used_at)
                            ?? FormatAppDateTime::format($voucher->updated_at),
                        'email_status' => $voucher->is_used
                            ? null
                            : ($voucher->sent_to_email_at ? 'sent' : 'sendable'),
                    ];
                });

            return [
                'batch_id' => $cohort->id,
                'batch_label' => 'Bought on '.(FormatAppDateTime::format($cohort->created_at) ?? ''),
                'vouchers' => $vouchers->values()->all(),
            ];
        })->filter(fn (array $group) => count($group['vouchers']) > 0)->values();

        return Inertia::render('Teacher/Shells/Show', [
            'certification' => $cert,
            'batches' => $batches,
            'voucherGroups' => $voucherGroups,
            'purchaseHistory' => $this->purchaseHistoryForTeacher($teacherId, $certification),
            'isMock' => false,
        ]);
    }

    public function batch(int $certification, int $cohort)
    {
        $teacherId = auth()->id();
        $cert = Certification::with('lessons.modules')->findOrFail($certification);
        $batch = Cohort::where('id', $cohort)
            ->where('teacher_id', $teacherId)
            ->where('certification_id', $certification)
            ->firstOrFail();

        return Inertia::render('Teacher/Shells/Batch', [
            'certification' => $cert,
            'analytics' => $this->batchAnalytics->build($batch, $cert),
            'isMock' => false,
        ]);
    }

    private function formatShellCard(Certification $cert): array
    {
        return [
            'id' => $cert->id,
            'title' => $cert->title,
            'cover_image' => $cert->thumbnail_url,
            'badge_type' => 'pro',
            'badge_label' => 'Professional Certificate',
        ];
    }

    private function purchaseHistoryForTeacher(int $teacherId, ?int $certificationId = null): array
    {
        $query = EnrollmentRequest::with(['certification'])
            ->where('user_id', $teacherId)
            ->where('request_type', 'teacher_bulk')
            ->where('status', 'paid');

        if ($certificationId) {
            $query->where('certification_id', $certificationId);
        }

        return $query->orderByDesc('reviewed_at')
            ->limit(20)
            ->get()
            ->map(function (EnrollmentRequest $request) {
                $cohort = Voucher::where('enrollment_request_id', $request->id)->first()?->cohort;

                return [
                    'id' => $request->id,
                    'purchased_at' => FormatAppDateTime::format($request->reviewed_at) ?? '—',
                    'shell_title' => $request->certification->title ?? 'N/A',
                    'batch_label' => $cohort?->cohort_name ?? 'Batch',
                    'quantity' => $request->quantity,
                    'amount' => (float) $request->amount,
                ];
            })
            ->all();
    }
}
