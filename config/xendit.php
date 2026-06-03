<?php

return [
    /*
    |--------------------------------------------------------------------------
    | Xendit (test + production)
    |--------------------------------------------------------------------------
    |
    | Use test API keys from the Xendit dashboard (Developers → API Keys).
    | Test secret keys are prefixed with xnd_development_.
    |
    | Webhook URL (Invoice paid):
    |   {APP_URL}/api/webhooks/xendit
    | Set the same verification token in the dashboard and XENDIT_WEBHOOK_TOKEN.
    |
    */
    'secret_key' => env('XENDIT_SECRET_KEY'),
    'webhook_token' => env('XENDIT_WEBHOOK_TOKEN'),
    'api_base_url' => env('XENDIT_API_BASE_URL', 'https://api.xendit.co'),
];
