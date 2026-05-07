@extends('layouts.dashboard')
@section('title', 'Enrollments')

@section('sidebar')
    <ul>
        <li><a href="{{ route('staff.dashboard') }}">Dashboard</a></li>
        <li><a href="{{ route('staff.lessons.create') }}">Manage Lessons</a></li>
        <li><a href="{{ route('staff.modules.create') }}">Upload Modules</a></li>
        <li><a href="{{ route('staff.questions.create') }}">Upload Questions</a></li>
        <li><a href="{{ route('staff.enrollments') }}" class="active">Enrollments</a></li>
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
        <p class="text-muted">Users enrolled in certifications linked to your lessons.</p>
    </div>

    <div class="card mt-4">
        @if($enrollments->count() > 0)
            <table class="data-table">
                <thead>
                    <tr>
                        <th>User</th>
                        <th>Certification</th>
                        <th>Amount Paid</th>
                        <th>Voucher</th>
                        <th>Status</th>
                        <th>Enrolled</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($enrollments as $enrollment)
                        <tr>
                            <td>{{ $enrollment->user->first_name ?? '' }} {{ $enrollment->user->last_name ?? '' }}</td>
                            <td>{{ $enrollment->certification->title ?? '—' }}</td>
                            <td>₱{{ number_format($enrollment->amount_paid, 2) }}</td>
                            <td>{{ $enrollment->voucher_code ?? '—' }}</td>
                            <td>{{ ucfirst($enrollment->payment_status) }}</td>
                            <td>{{ $enrollment->created_at->format('M d, Y') }}</td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No enrollments yet for your certifications.</p>
        @endif
    </div>
@endsection
