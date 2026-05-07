@extends('layouts.dashboard')
@section('title', 'Edit Staff Account')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}">Dashboard</a></li>
        <li><a href="{{ route('admin.staff.create') }}">Create Staff Account</a></li>
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
        <h1>Edit Staff Account</h1>
        <p class="text-muted">Update staff details and account status.</p>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="alert alert-error">{{ $errors->first() }}</div>
    @endif

    <div class="card form-card">
        <form action="{{ route('admin.staff.update', $staff->id) }}" method="POST" class="dashboard-form">
            @csrf

            <div class="grid-2">
                <div class="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" id="first_name" name="first_name" value="{{ old('first_name', $staff->first_name) }}" required>
                </div>

                <div class="form-group">
                    <label for="last_name">Last Name</label>
                    <input type="text" id="last_name" name="last_name" value="{{ old('last_name', $staff->last_name) }}" required>
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" value="{{ old('email', $staff->email) }}" required>
                </div>

                <div class="form-group">
                    <label for="birthday">Birthday</label>
                    <input type="date" id="birthday" name="birthday" value="{{ old('birthday', $staff->birthday) }}" required>
                </div>

                <div class="form-group">
                    <label for="contact_no">Contact No.</label>
                    <input type="text" id="contact_no" name="contact_no" value="{{ old('contact_no', $staff->contact_no) }}" required>
                </div>

                <div class="form-group">
                    <label for="affiliation">Affiliation (Optional)</label>
                    <input type="text" id="affiliation" name="affiliation" value="{{ old('affiliation', $staff->affiliation) }}">
                </div>
            </div>

            <div class="form-group mt-3">
                <label for="is_active">Account Status</label>
                <select id="is_active" name="is_active" required>
                    <option value="1" {{ old('is_active', $staff->is_active) ? 'selected' : '' }}>Active</option>
                    <option value="0" {{ ! old('is_active', $staff->is_active) ? 'selected' : '' }}>Deactivated</option>
                </select>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <a href="{{ route('admin.staff.create') }}" class="btn btn-secondary">Back to Staff List</a>
            </div>
        </form>
    </div>
@endsection
