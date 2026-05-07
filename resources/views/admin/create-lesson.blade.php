@extends('layouts.dashboard')
@section('title', 'Create Lessons')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-staff') }}">Create Staff Account</a></li>
        <li><a href="{{ url('/admin/create-certification') }}">Manage Certifications</a></li>
        <li><a href="{{ route('admin.lessons.create') }}" class="active">Create Lessons</a></li>
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
        <h1>Create Lessons</h1>
        <p class="text-muted">Create lessons and attach them to active certifications.</p>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="alert alert-error">{{ $errors->first() }}</div>
    @endif

    <div class="card form-card">
        <form action="{{ route('admin.lessons.store') }}" method="POST" class="dashboard-form">
            @csrf

            <div class="form-group">
                <label for="certification_id">Select Certification</label>
                <select id="certification_id" name="certification_id" required>
                    <option value="">-- Choose Certification --</option>
                    @foreach($certifications as $certification)
                        <option value="{{ $certification->id }}" {{ old('certification_id') == $certification->id ? 'selected' : '' }}>
                            {{ $certification->title }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div class="form-group">
                <label for="title">Lesson Title</label>
                <input type="text" id="title" name="title" required placeholder="e.g., Introduction to HTML" value="{{ old('title') }}">
            </div>

            <div class="form-group">
                <label for="description">Description</label>
                <textarea id="description" name="description" rows="3" placeholder="Brief overview of this lesson...">{{ old('description') }}</textarea>
            </div>

            <div class="form-actions mt-4">
                <button type="submit" class="btn btn-primary">Create Lesson</button>
            </div>
        </form>
    </div>

    <div class="card mt-4">
        <h2>All Lessons</h2>

        @if($lessons->count() > 0)
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Lesson Title</th>
                        <th>Certification</th>
                        <th>Description</th>
                        <th>Created</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($lessons as $lesson)
                        <tr>
                            <td>{{ $lesson->title }}</td>
                            <td>{{ $lesson->certification->title ?? '—' }}</td>
                            <td>{{ $lesson->description ?? '—' }}</td>
                            <td>{{ $lesson->created_at->format('M d, Y') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No lessons created yet.</p>
        @endif
    </div>
@endsection
