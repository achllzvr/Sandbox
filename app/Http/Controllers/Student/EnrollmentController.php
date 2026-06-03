<?php

namespace App\Http\Controllers\Student;

use App\Http\Controllers\Controller;
use App\Http\Requests\Student\EnrollmentCheckoutRequest;
use App\Models\Certification;
use App\Services\StudentEnrollmentCheckoutService;

class EnrollmentController extends Controller
{
    public function __construct(private StudentEnrollmentCheckoutService $checkoutService)
    {
    }

    public function checkout(EnrollmentCheckoutRequest $request)
    {
        $certification = Certification::findOrFail($request->certification_id);

        return $this->checkoutService->checkout(
            $request->user(),
            $certification,
            (float) $request->expected_total,
        );
    }
}
