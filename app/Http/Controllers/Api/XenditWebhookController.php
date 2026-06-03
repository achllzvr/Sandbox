<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\XenditService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class XenditWebhookController extends Controller
{
    public function __construct(private XenditService $xenditService) {}

    public function handle(Request $request)
    {
        if (! $this->xenditService->webhookTokenMatches($request->header('x-callback-token'))) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        try {
            $this->xenditService->handleInvoiceWebhook($request->all());
        } catch (\Throwable $e) {
            Log::error('Xendit webhook handler failed: '.$e->getMessage(), [
                'payload' => $request->all(),
            ]);

            return response()->json(['status' => 'error'], 500);
        }

        return response()->json(['status' => 'success']);
    }
}
