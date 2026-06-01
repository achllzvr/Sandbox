<?php

namespace App\Http\Controllers\Teacher;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class BulkCheckoutController extends Controller
{
    /**
     * TODO[backend]: Create enrollment_request (teacher_bulk), cohort, and N vouchers.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'certification_id' => ['required', 'integer'],
            'quantity' => ['required', 'integer', 'min:1', 'max:100'],
            'tos_action_irreversible' => ['accepted'],
            'tos_privacy_act' => ['accepted'],
            'batch_acknowledged' => ['accepted'],
        ]);

        return redirect()
            ->route('teacher.shop.index')
            ->with('teacher_purchase_success', [
                'certification_id' => (int) $validated['certification_id'],
                'quantity' => (int) $validated['quantity'],
            ]);
    }
}
