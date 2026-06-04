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
        'keys' => [
            1 => env('GEMINI_API_KEY_1'),
            2 => env('GEMINI_API_KEY_2'),
            3 => env('GEMINI_API_KEY_3'),
            4 => env('GEMINI_API_KEY_4'),
            5 => env('GEMINI_API_KEY_5'),
        ],
        'model' => env('GEMINI_MODEL'),
        'timeout' => (int) env('GEMINI_TIMEOUT', 45),
    ],

];
