@extends('layouts.app')
@section('title', 'Create Your Hermit — Sandbox')

@section('content')
<div class="auth-page-wrap">
    <div class="auth-container">
        <x-card class="auth-card" title="Create your Hermit" subtitle="Make it yours! Fill in your details to get started.">
            <form action="{{ route('register.store') }}" method="POST" class="auth-form" id="register-form">
                @csrf

                <div class="name-row grid-2">
                    <x-input
                        label="First Name"
                        name="first_name"
                        type="text"
                        placeholder="First name"
                        required="true"
                    />

                    <x-input
                        label="Last Name"
                        name="last_name"
                        type="text"
                        placeholder="Last name"
                        required="true"
                    />
                </div>

                <x-input
                    label="Email Address"
                    name="email"
                    type="email"
                    placeholder="you@example.com"
                    required="true"
                />

                <x-input
                    label="Birthday"
                    name="birthday"
                    type="date"
                    required="true"
                />

                <x-input
                    label="Contact No."
                    name="contact_no"
                    type="tel"
                    placeholder="09123456789"
                    required="true"
                />

                <x-input
                    label="Affiliation (Optional)"
                    name="affiliation"
                    type="text"
                    placeholder="Company or University"
                />

                <div class="name-row grid-2">
                    <x-input
                        label="Password"
                        name="password"
                        type="password"
                        placeholder="Create a password"
                        required="true"
                    />

                    <x-input
                        label="Confirm Password"
                        name="password_confirmation"
                        type="password"
                        placeholder="Confirm password"
                        required="true"
                    />
                </div>

                <div class="form-actions">
                    <x-button type="submit" color="primary" class="btn-block" :gated="true">
                        Create Shell
                    </x-button>
                </div>

                <div class="auth-footer">
                    <p>By signing up, you agree to our <a href="#">Terms</a> and <a href="#">Privacy Policy</a>.</p>
                    <p class="mt-3">Already have a shell? <a href="{{ route('login') }}">Log in</a></p>
                </div>
            </form>
        </x-card>
    </div>
</div>
@endsection
