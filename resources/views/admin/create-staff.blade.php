@extends('layouts.dashboard')
@section('title', 'Create content_creator Account')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-content_creator') }}" class="active">Create content_creator Account</a></li>
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
    <div class="dashboard-header-title flex-between">
        <div>
            <h1>Create content_creator / Teacher Account</h1>
            <p class="text-muted">Only Admins can provision content_creator accounts for lesson and module management.</p>
        </div>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="alert alert-error">{{ $errors->first() }}</div>
    @endif

    <div class="card form-card">
        <form action="{{ route('admin.content_creator.store') }}" method="POST" class="dashboard-form">
            @csrf

            <div class="grid-2">
                <div class="form-group">
                    <label for="first_name">First Name</label>
                    <input type="text" id="first_name" name="first_name" value="{{ old('first_name') }}" required>
                </div>

                <div class="form-group">
                    <label for="last_name">Last Name</label>
                    <input type="text" id="last_name" name="last_name" value="{{ old('last_name') }}" required>
                </div>

                <div class="form-group">
                    <label for="email">Email Address</label>
                    <input type="email" id="email" name="email" value="{{ old('email') }}" required>
                </div>

                <div class="form-group">
                    <label for="birthday">Birthday</label>
                    <input type="date" id="birthday" name="birthday" value="{{ old('birthday') }}" required>
                </div>

                <div class="form-group">
                    <label for="contact_no">Contact No.</label>
                    <input type="text" id="contact_no" name="contact_no" value="{{ old('contact_no') }}" required>
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
                <button type="submit" class="btn btn-primary">Create content_creator Account</button>
            </div>
        </form>
    </div>

    <div class="card mt-4">
        <h2>content_creator Accounts</h2>

        @if($content_creatorUsers->count() > 0)
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Status</th>
                        <th>Created</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($content_creatorUsers as $content_creator)
                        <tr>
                            <td>{{ $content_creator->full_name }}</td>
                            <td>{{ $content_creator->email }}</td>
                            <td>{{ $content_creator->is_active ? 'Active' : 'Deactivated' }}</td>
                            <td>{{ $content_creator->created_at->format('M d, Y') }}</td>
                            <td>
                                <a href="{{ route('admin.content_creator.edit', $content_creator->id) }}" class="btn btn-secondary btn-sm">Edit</a>
                                <form action="{{ route('admin.content_creator.toggle', $content_creator->id) }}" method="POST" style="display:inline-block; margin-left:0.5rem;">
                                    @csrf
                                    <button type="submit" class="btn btn-secondary btn-sm">{{ $content_creator->is_active ? 'Deactivate' : 'Activate' }}</button>
                                </form>
                                <form action="{{ route('admin.content_creator.reset-password', $content_creator->id) }}" method="POST" style="display:inline-block; margin-left:0.5rem;">
                                    @csrf
                                    <button type="submit" class="btn btn-primary btn-sm">Reset Password</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>

            <div class="mt-4">
                {{ $content_creatorUsers->links() }}
            </div>
        @else
            <p>No content_creator accounts have been created yet.</p>
        @endif
    </div>
@endsection
