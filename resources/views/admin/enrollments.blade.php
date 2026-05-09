@extends('layouts.dashboard')
@section('title', 'Enrollments')

@section('sidebar')
    <ul>
        <li><a href="{{ url('/admin/dashboard') }}">Dashboard</a></li>
        <li><a href="{{ url('/admin/create-staff') }}">Create Staff Account</a></li>
        <li><a href="{{ url('/admin/create-certification') }}">Manage Certifications</a></li>
        <li><a href="{{ route('admin.vouchers.index') }}">Manage Vouchers</a></li>
        <li><a href="{{ route('admin.enrollments') }}" class="active">Enrollments</a></li>
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
        <h1>Enrollments</h1>
        <p class="text-muted">All user enrollments across certifications.</p>
    </div>

    <div class="card mt-4">
        @if($enrollments->count() > 0)
            <table class="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Email</th>
                        <th>Certification</th>
                        <th>Original Price</th>
                        <th>Discount</th>
                        <th>Amount Paid</th>
                        <th>Voucher</th>
                        <th>Status</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($enrollments as $enrollment)
                        <tr>
                            <td>{{ $enrollment->user->first_name ?? '' }} {{ $enrollment->user->last_name ?? '' }}</td>
                            <td>{{ $enrollment->user->email ?? '—' }}</td>
                            <td>{{ $enrollment->certification->title ?? '—' }}</td>
                            <td>₱{{ number_format($enrollment->certification->price ?? 0, 2) }}</td>
                            <td>₱{{ number_format($enrollment->discount_applied, 2) }}</td>
                            <td>₱{{ number_format($enrollment->amount_paid, 2) }}</td>
                            <td>{{ $enrollment->voucher_code ?? '—' }}</td>
                            <td>{{ ucfirst($enrollment->payment_status) }}</td>
                            <td>{{ $enrollment->created_at->format('M d, Y') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No enrollments yet.</p>
        @endif
    </div>
@endsection
