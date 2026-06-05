<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Third Party Services
    |--------------------------------------------------------------------------
    |
    | This file is for storing the credentials for third party services such
    | as Mailgun, Postmark, AWS and more. This file provides the de facto
    | location for this type of information, allowing packages to have
    | a conventional file to locate the various service credentials.
    |
    */

    'mailgun' => [
        'domain' => env('MAILGUN_DOMAIN'),
        'secret' => env('MAILGUN_SECRET'),
        'endpoint' => env('MAILGUN_ENDPOINT', 'api.mailgun.net'),
        'scheme' => 'https',
    ],

    'postmark' => [
        'token' => env('POSTMARK_TOKEN'),
    ],

    'ses' => [
        'key' => env('AWS_ACCESS_KEY_ID'),
        'secret' => env('AWS_SECRET_ACCESS_KEY'),
        'region' => env('AWS_DEFAULT_REGION', 'us-east-1'),
    ],

    'gemini' => [
        'key' => env('GEMINI_API_KEY'),
        // Supports GEMINI_API_KEY_1 or GEMINI_API_KEY1 (without underscore before the index).
        'keys' => [
            1 => env('GEMINI_API_KEY_1') ?: env('GEMINI_API_KEY1'),
            2 => env('GEMINI_API_KEY_2') ?: env('GEMINI_API_KEY2'),
            3 => env('GEMINI_API_KEY_3') ?: env('GEMINI_API_KEY3'),
            4 => env('GEMINI_API_KEY_4') ?: env('GEMINI_API_KEY4'),
            5 => env('GEMINI_API_KEY_5') ?: env('GEMINI_API_KEY5'),
            6 => env('GEMINI_API_KEY_6') ?: env('GEMINI_API_KEY6'),
            7 => env('GEMINI_API_KEY_7') ?: env('GEMINI_API_KEY7'),
            8 => env('GEMINI_API_KEY_8') ?: env('GEMINI_API_KEY8'),
            9 => env('GEMINI_API_KEY_9') ?: env('GEMINI_API_KEY9'),
            10 => env('GEMINI_API_KEY_10') ?: env('GEMINI_API_KEY10'),
        ],
        'model' => env('GEMINI_MODEL'),
        'timeout' => (int) env('GEMINI_TIMEOUT', 45),
    ],

];
