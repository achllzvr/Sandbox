@extends('layouts.app')

@section('title', 'Platform Login')

@section('content')
<div class="container">
    <div class="auth-container">
        <div class="card auth-card">
            <h2>Platform Login</h2>
            <p class="auth-subtitle">Access your dashboard (Admin, content_creator, or Taker)</p>

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

            <form action="{{ route('login.submit') }}" method="POST" class="auth-form">
                @csrf

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input 
                        type="email" 
                        id="email" 
                        name="email" 
                        value="{{ old('email') }}"
                        required 
                        placeholder="name@example.com"
                    >
                </div>

                <div class="form-group">
                    <label for="password">Password</label>
                    <input 
                        type="password" 
                        id="password" 
                        name="password" 
                        required
                    >
                </div>

                <button type="submit" class="btn btn-primary btn-block">Login</button>

                <div class="auth-footer">
                    <p>Not a certification taker yet? 
                        <a href="{{ route('register.show') }}">Register here</a>
                    </p>
                    <p class="admin-notice">Note: Admin and content_creator accounts are internally managed.</p>
                </div>
            </form>
        </div>
    </div>
</div>
@endsection
