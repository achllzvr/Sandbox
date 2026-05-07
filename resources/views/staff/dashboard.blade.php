@extends('layouts.dashboard')
@section('title', 'Staff Dashboard')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/staff/dashboard') }}" class="active">Dashboard</a></li>
        <li><a href="{{ route('staff.lessons.create') }}">Manage Lessons</a></li>
        <li><a href="{{ route('staff.modules.create') }}">Upload Modules</a></li>
        <li><a href="{{ route('staff.questions.create') }}">Upload Questions</a></li>
        <li><a href="{{ route('staff.enrollments') }}">Enrollments</a></li>
        <li>
            <form method="POST" action="{{ route('logout') }}">
                @csrf
                <button type="submit" class="sidebar-logout-btn">Logout</button>
            </form>
        </li>
    </ul>
@endsection

@section('content')
    <div class="dashboard-header-title">
        <h1>Staff & Teacher Overview</h1>
    </div>
    
    <div class="grid-4 stats-grid">
        <div class="card stat-card">
            <h3>Available Certifications</h3>
            <div class="stat-value">{{ $assignedCertifications ?? 0 }}</div>
        </div>

        <div class="card stat-card">
            <h3>Uploaded Lessons</h3>
            <div class="stat-value">{{ $uploadedLessons ?? 0 }}</div>
        </div>

        <div class="card stat-card">
            <h3>Uploaded Modules</h3>
            <div class="stat-value">{{ $uploadedModules ?? 0 }}</div>
        </div>

        <div class="card stat-card">
            <h3>Uploaded Questions</h3>
            <div class="stat-value">0</div>
        </div>
    </div>

    <div class="card mt-4">
        <h2>Available Certifications</h2>

        @if(isset($certifications) && $certifications->count() > 0)
            <div class="grid-3 mt-3">
                @foreach($certifications as $certification)
                    <div class="card certification-card">
                        <h3>{{ $certification->title }}</h3>
                        <p>{{ $certification->description ?? 'No description available.' }}</p>
                        <p><strong>Price:</strong> ₱{{ number_format($certification->price, 2) }}</p>
                        <p><strong>Passing Score:</strong> {{ $certification->pass_threshold }}%</p>
                    </div>
                @endforeach
            </div>
        @else
            <p>No active certifications available yet.</p>
        @endif
    </div>
@endsection