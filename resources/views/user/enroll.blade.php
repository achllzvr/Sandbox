@extends('layouts.dashboard')
@section('title', 'Enroll')

@section('sidebar')
    <ul>
        <li><a href="{{ route('user.dashboard') }}">Dashboard</a></li>
        <li><a href="{{ route('user.dashboard') }}#available-certifications">Browse Certifications</a></li>
        <li><a href="{{ route('user.dashboard') }}#my-coursework">My Coursework</a></li>
        <li>
            <form method="POST" action="{{ route('logout') }}" class="sidebar-logout-form">
                @csrf
                <button type="submit" class="sidebar-logout-btn">Logout</button>
            </form>
        </li>
    </ul>
@endsection

@section('content')
    <div class="dashboard-header-title">
        <h1>Enroll in Certification</h1>
        <p class="text-muted">Review and confirm your enrollment.</p>
    </div>

    @if($errors->any())
        <div class="alert alert-error">{{ $errors->first() }}</div>
    @endif

    <div class="card form-card mt-4">
        <h2>{{ $certification->title }}</h2>
        <p>{{ $certification->description ?? 'No description available.' }}</p>
        <p><strong>Price:</strong> ₱{{ number_format($certification->price, 2) }}</p>
        <p><strong>Passing Score:</strong> {{ $certification->pass_threshold }}%</p>

        <hr class="divider">

        <form action="{{ route('user.enroll.store', $certification->id) }}" method="POST" class="dashboard-form">
            @csrf

            <div class="form-group">
                <label for="voucher_code">Voucher Code (Optional)</label>
                <input
                    type="text"
                    id="voucher_code"
                    name="voucher_code"
                    placeholder="Enter voucher code for a discount"
                    value="{{ old('voucher_code') }}"
                    style="text-transform: uppercase;"
                >
            </div>

            <div class="form-actions mt-4">
                <button type="submit" class="btn btn-primary">Confirm Enrollment</button>
                <a href="{{ route('user.dashboard') }}" class="btn btn-secondary">Cancel</a>
            </div>
        </form>
    </div>
@endsection
