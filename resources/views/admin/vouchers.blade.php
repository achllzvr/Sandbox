@extends('layouts.dashboard')
@section('title', 'Manage Vouchers')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-staff') }}">Create Staff Account</a></li>
        <li><a href="{{ url('/admin/create-certification') }}">Manage Certifications</a></li>
        <li><a href="{{ route('admin.vouchers.index') }}" class="active">Manage Vouchers</a></li>
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
        <h1>Manage Vouchers</h1>
        <p class="text-muted">Create discount codes that users can apply during enrollment.</p>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="alert alert-error">{{ $errors->first() }}</div>
    @endif

    <div class="card form-card">
        <form action="{{ route('admin.vouchers.store') }}" method="POST" class="dashboard-form">
            @csrf

            <div class="grid-2">
                <div class="form-group">
                    <label for="code">Voucher Code</label>
                    <input type="text" id="code" name="code" required placeholder="e.g., SAVE20" value="{{ old('code') }}" style="text-transform: uppercase;">
                </div>

                <div class="form-group">
                    <label for="discount_type">Discount Type</label>
                    <select id="discount_type" name="discount_type" required>
                        <option value="percent" {{ old('discount_type') == 'percent' ? 'selected' : '' }}>Percentage (%)</option>
                        <option value="fixed" {{ old('discount_type') == 'fixed' ? 'selected' : '' }}>Fixed Amount (₱)</option>
                    </select>
                </div>

                <div class="form-group">
                    <label for="discount_value">Discount Value</label>
                    <input type="number" id="discount_value" name="discount_value" required step="0.01" min="0.01" placeholder="e.g., 20" value="{{ old('discount_value') }}">
                </div>

                <div class="form-group">
                    <label for="max_uses">Max Uses</label>
                    <input type="number" id="max_uses" name="max_uses" required min="1" placeholder="e.g., 50" value="{{ old('max_uses', 1) }}">
                </div>

                <div class="form-group">
                    <label for="expires_at">Expiry Date (Optional)</label>
                    <input type="date" id="expires_at" name="expires_at" value="{{ old('expires_at') }}">
                </div>
            </div>

            <div class="form-actions mt-4">
                <button type="submit" class="btn btn-primary">Create Voucher</button>
            </div>
        </form>
    </div>

    <div class="card mt-4">
        <h2>Active Vouchers</h2>

        @if($vouchers->count() > 0)
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Code</th>
                        <th>Type</th>
                        <th>Value</th>
                        <th>Uses</th>
                        <th>Expires</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($vouchers as $voucher)
                        <tr>
                            <td><strong>{{ $voucher->code }}</strong></td>
                            <td>{{ $voucher->discount_type === 'percent' ? 'Percentage' : 'Fixed' }}</td>
                            <td>
                                @if($voucher->discount_type === 'percent')
                                    {{ $voucher->discount_value }}%
                                @else
                                    ₱{{ number_format($voucher->discount_value, 2) }}
                                @endif
                            </td>
                            <td>{{ $voucher->uses_count }} / {{ $voucher->max_uses }}</td>
                            <td>{{ $voucher->expires_at ? $voucher->expires_at->format('M d, Y') : 'No expiry' }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No vouchers created yet.</p>
        @endif
    </div>
@endsection
