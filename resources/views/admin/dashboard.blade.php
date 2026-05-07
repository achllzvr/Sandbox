@extends('layouts.dashboard')
@section('title', 'Admin Dashboard')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}" class="active">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-staff') }}">Create Staff Account</a></li>
        <li><a href="{{ url('/admin/create-certification') }}">Manage Certifications</a></li>
        <li><a href="{{ route('admin.lessons.create') }}">Create Lessons</a></li>
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
            <h3>Total Certifications</h3>
            <div class="stat-value">{{ $totalCertifications }}</div>
        </div>
        <div class="card stat-card">
            <h3>Active Certifications</h3>
            <div class="stat-value">{{ $activeCertifications }}</div>
        </div>
    </div>

    <div class="card mt-4">
        <h2>Recent Activity</h2>
        <p>No recent activity globally.</p>
    </div>
@endsection