@extends('layouts.dashboard')
@section('title', 'Create Staff Account')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-staff') }}" class="active">Create Staff Account</a></li>
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
        <h1>Create Staff / Teacher Account</h1>
        <p class="text-muted">Only Admins can provision Staff accounts for module and lesson management.</p>
    </div>

    <div class="card form-card">
       <form action="{{ route('admin.staff.store') }}" method="POST" class="dashboard-form">
    @csrf

    <div class="grid-2">
        <div class="form-group">
            <label for="first_name">First Name</label>
            <input type="text" id="first_name" name="first_name" required>
        </div>

        <div class="form-group">
            <label for="last_name">Last Name</label>
            <input type="text" id="last_name" name="last_name" required>
        </div>

        <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" name="email" required>
        </div>

        <div class="form-group">
            <label for="birthday">Birthday</label>
            <input type="date" id="birthday" name="birthday" required>
        </div>

        <div class="form-group">
            <label for="contact_no">Contact No.</label>
            <input type="text" id="contact_no" name="contact_no" required>
        </div>

        <div class="form-group">
            <label for="affiliation">Affiliation (Optional)</label>
            <input type="text" id="affiliation" name="affiliation">
        </div>
    </div>

    <hr class="divider">

    <div class="grid-2">
        <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" required>
        </div>

        <div class="form-group">
            <label for="password_confirmation">Confirm Password</label>
            <input type="password" id="password_confirmation" name="password_confirmation" required>
        </div>
    </div>

    <div class="form-actions">
        <button type="submit" class="btn btn-primary">Create Staff Account</button>
    </div>
</form>
    </div>
@endsection