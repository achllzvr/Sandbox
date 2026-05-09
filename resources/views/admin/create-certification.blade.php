@extends('layouts.dashboard')
@section('title', 'Create Certification')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-staff') }}">Create Staff Account</a></li>
        <li><a href="{{ url('/admin/create-certification') }}" class="active">Manage Certifications</a></li>
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
        <h1>Create New Certification</h1>
        <p class="text-muted">Define a new certification track. Uploading modules is done by Staff.</p>
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
        <form action="{{ route('admin.certifications.store') }}" method="POST" class="dashboard-form">
            @csrf

            <div class="form-group">
                <label for="title">Certification Title</label>
                <input 
                    type="text" 
                    id="title" 
                    name="title" 
                    value="{{ old('title') }}"
                    required 
                    placeholder="e.g., Advanced Laravel Architect"
                >
            </div>
            
            <div class="form-group">
                <label for="description">Description</label>
                <textarea 
                    id="description" 
                    name="description" 
                    rows="4" 
                    placeholder="Detailed information about this certification..."
                >{{ old('description') }}</textarea>
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
                        value="{{ old('price') }}"
                        required 
                        placeholder="499.00"
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
                        value="{{ old('pass_threshold') }}"
                        required 
                        placeholder="80"
                    >
                </div>

                <div class="form-group">
                    <label for="is_active">Status</label>
                    <select id="is_active" name="is_active" required>
                        <option value="1" {{ old('is_active', '1') == '1' ? 'selected' : '' }}>Active (Visible)</option>
                        <option value="0" {{ old('is_active') == '0' ? 'selected' : '' }}>Inactive (Draft)</option>
                    </select>
                </div>
            </div>

            <div class="form-actions">
                <button type="submit" class="btn btn-primary">Create Certification</button>
            </div>
        </form>
    </div>

    <div class="card mt-4">
        <h2>Certifications</h2>

        @if(isset($certifications) && $certifications->count() > 0)
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Title</th>
                        <th>Description</th>
                        <th>Price</th>
                        <th>Passing Score</th>
                        <th>Status</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($certifications as $certification)
                        <tr>
                            <td>{{ $certification->title }}</td>
                            <td>{{ Str::limit($certification->description, 60, '...') }}</td>
                            <td>₱{{ number_format($certification->price, 2) }}</td>
                            <td>{{ $certification->pass_threshold }}%</td>
                            <td>{{ $certification->is_active ? 'Active' : 'Inactive' }}</td>
                            <td>
                                <a href="{{ route('admin.certifications.edit', $certification->id) }}" class="btn btn-secondary btn-sm">Edit</a>
                                <form action="{{ route('admin.certifications.destroy', $certification->id) }}" method="POST" style="display:inline-block; margin-left:0.5rem;">
                                    @csrf
                                    @method('DELETE')
                                    <button type="submit" class="btn btn-danger btn-sm" onclick="return confirm('Delete this certification?');">Delete</button>
                                </form>
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No certifications have been created yet.</p>
        @endif
    </div>
@endsection