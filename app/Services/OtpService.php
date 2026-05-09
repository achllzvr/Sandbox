<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Notifications\SendEmailOtpNotification;

class OtpService
{
    private const MAX_ATTEMPTS = 5;
    private const CACHE_TTL_MINUTES = 10;

    public function sendEmailVerificationOtp(User $user)
    {
        // Generate a 6-digit OTP
        $otp = (string) random_int(100000, 999999);

        // Hash it before storing in cache
        $hashedOtp = Hash::make($otp);

        $cacheKey = "otp:email_verification:{$user->id}";
        $attemptsKey = "otp:email_verification:{$user->id}:attempts";

        // Store hash in cache for 10 minutes, reset attempts
        Cache::put($cacheKey, $hashedOtp, now()->addMinutes(self::CACHE_TTL_MINUTES));
        Cache::put($attemptsKey, 0, now()->addMinutes(self::CACHE_TTL_MINUTES));

        // Send OTP via notification
        $user->notify(new SendEmailOtpNotification($otp));
    }

    public function verifyOtp(User $user, string $otp): bool
    {
        $cacheKey = "otp:email_verification:{$user->id}";
        $attemptsKey = "otp:email_verification:{$user->id}:attempts";

        $hashedOtp = Cache::get($cacheKey);

        if (!$hashedOtp) {
            throw new \Exception('OTP has expired or does not exist.');
        }

        $attempts = Cache::get($attemptsKey, 0);

        if ($attempts >= self::MAX_ATTEMPTS) {
            Cache::forget($cacheKey);
            Cache::forget($attemptsKey);
            throw new \Exception('Maximum attempts reached. Please request a new OTP.');
        }

        if (!Hash::check($otp, $hashedOtp)) {
            Cache::increment($attemptsKey);
            throw new \Exception('Invalid OTP.');
        }

        // OTP is valid
        $user->forceFill(['email_verified_at' => now()])->save();
        
        Cache::forget($cacheKey);
        Cache::forget($attemptsKey);

        return true;
    }
}

