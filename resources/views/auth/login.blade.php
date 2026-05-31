@extends('layouts.app')

@section('title', 'Log In — Sandbox')

@section('content')
<div class="auth-page-wrap">
    <div class="auth-container">
        <div class="auth-card">
            <h1 class="page-title">Log in</h1>
            <p class="auth-subtitle">Welcome back! Sign in to your dashboard.</p>

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

            <form action="{{ route('login.submit') }}" method="POST" class="auth-form" id="login-form">
                @csrf

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        class="input-field required-field"
                        value="{{ old('email') }}"
                        required
                        placeholder="name@example.com"
                        autocomplete="email"
                    >
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <div class="input-wrapper">
                        <input
                            type="password"
                            id="password"
                            name="password"
                            class="input-field required-field"
                            required
                            placeholder="Your password"
                            autocomplete="current-password"
                        >
                        <a href="#" class="input-inline-action" tabindex="-1" aria-hidden="true">Forgot?</a>
                    </div>
                </div>

                <button type="submit" class="btn btn-primary btn-block btn-form-gated" id="login-submit">
                    Log In
                </button>

                <div class="auth-footer">
                    <p>By signing in to Sandbox, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
                    <p class="mt-3">Not a learner yet? <a href="{{ route('register.show') }}">Create your Hermit</a></p>
                    <p class="admin-notice">Admin and content creator accounts are managed internally.</p>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
