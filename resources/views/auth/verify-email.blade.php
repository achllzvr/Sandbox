@extends('layouts.app')

@section('title', 'Verify Your Email')

@section('content')
<div class="container">
    <div class="auth-container">
        <x-card class="auth-card" title="Verify Your Email" subtitle="Enter the 6-digit code sent to your inbox.">
            @if(session('success'))
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            @endif

            @if($errors->any())
                <div class="alert alert-error">
                    {{ $errors->first() }}
                </div>
            @endif

            <form action="{{ route('verification.verify') }}" method="POST" class="auth-form">
                @csrf

                <x-input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    value="{{ old('email', $email) }}"
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
                    <x-button type="submit" color="primary" class="btn-block">
                        Verify Account
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
                <p>Already verified? <a href="{{ route('login') }}">Login here</a></p>
            </div>
        </x-card>
    </div>
</div>
@endsection
