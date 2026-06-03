<?php

return [
    'provider' => env('AI_PROVIDER', 'local'),
    'api_key' => env('AI_API_KEY'),
    'model' => env('AI_MODEL', 'gpt-4o-mini'),
    'similarity_threshold' => (float) env('AI_SIMILARITY_THRESHOLD', 0.72),
    'rate_limit_per_minute' => (int) env('AI_RATE_LIMIT_PER_MINUTE', 10),
    'max_questions_per_request' => (int) env('AI_MAX_QUESTIONS', 15),
];
