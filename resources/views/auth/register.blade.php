@extends('layouts.app')
@section('title', 'Certification Taker Registration')

@section('content')
<div class="container">
    <div class="auth-container">
        <x-card class="auth-card" title="Certification Taker Registration" subtitle="Create an account to start earning certifications.">
            <form action="{{ route('register.store') }}" method="POST" class="auth-form">
                @csrf

                <div class="grid-2">
                    <x-input 
                        label="First Name" 
                        name="first_name" 
                        type="text" 
                        placeholder="John" 
                        required="true" 
                    />

                    <x-input 
                        label="Last Name" 
                        name="last_name" 
                        type="text" 
                        placeholder="Doe" 
                        required="true" 
                    />
                </div>

                <x-input 
                    label="Email Address" 
                    name="email" 
                    type="email" 
                    placeholder="john@example.com" 
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
                    type="text" 
                    placeholder="09123456789" 
                    required="true" 
                />

                <x-input 
                    label="Affiliation (Optional)" 
                    name="affiliation" 
                    type="text" 
                    placeholder="Company or University" 
                />
                
                <div class="grid-2">
                    <x-input 
                        label="Password" 
                        name="password" 
                        type="password" 
                        required="true" 
                    />

                    <x-input 
                        label="Confirm Password" 
                        name="password_confirmation" 
                        type="password" 
                        required="true" 
                    />
                </div>
                
                <div class="form-actions">
                    <x-button type="submit" color="primary" class="btn-block">
                        Register
                    </x-button>
                </div>
                
                <div class="auth-footer">
                    <p>Already have an account? 
                        <a href="{{ route('login') }}">Login here</a>
                    </p>
                </div>
            </form>
        </x-card>
    </div>
</div>
@endsection