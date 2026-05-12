@extends('layouts.dashboard')
@section('title', 'Edit Certification')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-content_creator') }}">Create content_creator Account</a></li>
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
        <h1>Edit Certification</h1>
        <p class="text-muted">Update certification details and status.</p>
    </div>

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

    <div class="card form-card">
        <form action="{{ route('admin.certifications.update', $certification->id) }}" method="POST" class="dashboard-form">
            @csrf

            <div class="form-group">
                <label for="title">Certification Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value="{{ old('title', $certification->title) }}"
                    required
                >
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea
                    id="description"
                    name="description"
                    rows="4"
                >{{ old('description', $certification->description) }}</textarea>
            </div>

            <div class="grid-3">
                <div class="form-group">
                    <label for="price">Price (₱)</label>
                    <input
                        type="number"
                        id="price"
                        name="price"
                        step="0.01"
                        min="0"
                        value="{{ old('price', $certification->price) }}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="pass_threshold">Passing Score / Threshold (%)</label>
                    <input
                        type="number"
                        id="pass_threshold"
                        name="pass_threshold"
                        min="1"
                        max="100"
                        value="{{ old('pass_threshold', $certification->pass_threshold) }}"
                        required
                    >
                </div>

                <div class="form-group">
                    <label for="is_active">Status</label>
                    <select id="is_active" name="is_active" required>
                        <option value="1" {{ old('is_active', $certification->is_active ? '1' : '0') == '1' ? 'selected' : '' }}>Active (Visible)</option>
                        <option value="0" {{ old('is_active', $certification->is_active ? '1' : '0') == '0' ? 'selected' : '' }}>Inactive (Draft)</option>
                    </select>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Save Changes</button>
                <a href="{{ route('admin.certifications.create') }}" class="btn btn-secondary">Back to Certifications</a>
            </div>
        </form>
    </div>
@endsection

