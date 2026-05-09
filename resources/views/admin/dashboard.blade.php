@extends('layouts.dashboard')
@section('title', 'Admin Dashboard')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}" class="active">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-staff') }}">Create Staff Account</a></li>
        <li><a href="{{ url('/admin/create-certification') }}">Manage Certifications</a></li>
        <li><a href="{{ route('admin.vouchers.index') }}">Manage Vouchers</a></li>
        <li><a href="{{ route('admin.enrollments') }}">Enrollments</a></li>
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
        <h1>Admin Overview</h1>
    </div>
    
    <div class="grid-4 stats-grid">
        <div class="card stat-card">
            <h3>Total Users</h3>
            <div class="stat-value">{{ $totalUsers }}</div>
        </div>
        <div class="card stat-card">
            <h3>Total Staff / Teachers</h3>
            <div class="stat-value">{{ $totalStaff }}</div>
        </div>
        <div class="card stat-card">
            <h3>Active Certifications</h3>
            <div class="stat-value">{{ $activeCertifications }}</div>
        </div>
        <div class="card stat-card">
            <h3>Inactive Certifications</h3>
            <div class="stat-value">{{ $inactiveCertifications }}</div>
        </div>
    </div>

    <div class="grid-4 stats-grid mt-4">
        <div class="card stat-card">
            <h3>Certification Count</h3>
            <div class="stat-value">{{ $totalCertifications }}</div>
        </div>
        <div class="card stat-card">
            <h3>Total Enrollments</h3>
            <div class="stat-value">{{ $totalEnrollments }}</div>
        </div>
    </div>

    <div class="card mt-4">
        <h2>Recent Certifications</h2>
        @if($recentCertifications->isEmpty())
            <p>No certifications have been created yet.</p>
        @else
            <div class="grid-3 mt-3">
                @foreach($recentCertifications as $certification)
                    <div class="card certification-card">
                        <h3>{{ $certification->title }}</h3>
                        <p>{{ \Illuminate\Support\Str::limit($certification->description, 120) ?? 'No description available.' }}</p>
                        <p><strong>Status:</strong> {{ $certification->is_active ? 'Active' : 'Inactive' }}</p>
                        <p><strong>Price:</strong> ₱{{ number_format($certification->price, 2) }}</p>
                        <p><strong>Created:</strong> {{ $certification->created_at->format('M d, Y') }}</p>
                    </div>
                @endforeach
            </div>
        @endif
    </div>
@endsection