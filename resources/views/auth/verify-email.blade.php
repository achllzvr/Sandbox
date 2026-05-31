@extends('layouts.app')

@section('title', 'Verify Your Hermit — Sandbox')

@section('content')
<div class="auth-page-wrap">
    <div class="auth-container">
        <x-card class="auth-card" title="Verify your Hermit" subtitle="Enter the 6-digit code sent to your inbox.">
            @if(session('success'))
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            @endif

            @if($errors->any())
                <div class="error-banner alert-error" role="alert">
                    <p>{{ $errors->first() }}</p>
                </div>
            @endif

            <form action="{{ route('verification.verify') }}" method="POST" class="auth-form" id="verify-form">
                @csrf

                <x-input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    :value="old('email', $email)"
                    required="true"
                />

                <x-input
                    label="Verification Code"
                    name="otp"
                    type="text"
                    placeholder="123456"
                    required="true"
                />

                <div class="form-actions">
                    <x-button type="submit" color="primary" class="btn-block" :gated="true">
                        Create Shell
                    </x-button>
                </div>
            </form>

            <div class="divider"></div>

            <form action="{{ route('verification.resend') }}" method="POST" class="auth-form">
                @csrf
                <input type="hidden" name="email" value="{{ old('email', $email) }}">
                <div class="form-actions">
                    <x-button type="submit" color="secondary" class="btn-block">
                        Resend Verification Code
                    </x-button>
                </div>
            </form>

            <div class="auth-footer">
                <p>Already verified? <a href="{{ route('login') }}">Log in</a></p>
            </div>
        </x-card>
    </div>
</div>
@endsection
