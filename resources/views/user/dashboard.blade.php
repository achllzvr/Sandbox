@extends('layouts.dashboard')
@section('title', 'Taker Dashboard')

@section('sidebar')
    <ul>
        <li>
            <a href="{{ route('user.dashboard') }}" class="active">
                Dashboard
            </a>
        </li>

        <li>
            <a href="#available-certifications">
                Browse Certifications
            </a>
        </li>

        <li>
            <a href="#my-coursework">
                My Coursework
            </a>
        </li>

        <li>
            <a href="#exams-history">
                Exams & History
            </a>
        </li>

        <li>
            <form method="POST" action="{{ route('logout') }}" class="sidebar-logout-form">
                @csrf
                <button type="submit" class="sidebar-logout-btn">
                    Logout
                </button>
            </form>
        </li>
    </ul>
@endsection

@section('content')
    <div class="dashboard-header-title flex-between">
        <div>
            <h1>Taker Dashboard</h1>
            <p class="text-muted">Track your certification progress and continue learning.</p>
        </div>

        <div>
            <a href="#available-certifications" class="btn btn-primary">Browse Certifications</a>
            <a href="#my-coursework" class="btn btn-secondary">Continue Learning</a>
        </div>
    </div>
    
    <div class="grid-4 stats-grid mt-4">
        <div class="card stat-card">
            <h3>Available Certifications</h3>
            <div class="stat-value text-blue">{{ $availableCertifications ?? 0 }}</div>
        </div>

        <div class="card stat-card text-center">
            <h3>Enrolled</h3>
            <div class="stat-value text-yellow">{{ $enrolledCount ?? 0 }}</div>
        </div>

        <div class="card stat-card text-center">
            <h3>Completed</h3>
            <div class="stat-value text-green">0</div>
        </div>

        <div class="card stat-card text-center">
            <h3>Certificates Earned</h3>
            <div class="stat-value text-purple">0</div>
        </div>
    </div>

    <div class="card mt-4" id="available-certifications">
        <h2>Available Certifications</h2>

        @if($certifications->count() > 0)
            <div class="grid-3 mt-4">
                @foreach($certifications as $certification)
                    <div class="card certification-card">
                        <h3>{{ $certification->title }}</h3>

                        <p>{{ $certification->description ?? 'No description available.' }}</p>

                        <p><strong>Price:</strong> ₱{{ number_format($certification->price, 2) }}</p>
                        <p><strong>Passing Score:</strong> {{ $certification->pass_threshold }}%</p>

                        @if(in_array($certification->id, $enrolledIds ?? []))
                            <span class="btn btn-secondary btn-block" style="text-align:center; display:block; cursor:default;">✓ Enrolled</span>
                        @else
                            <a href="{{ route('user.enroll.show', $certification->id) }}" class="btn btn-primary btn-block">
                                Enroll — ₱{{ number_format($certification->price, 2) }}
                            </a>
                        @endif
                        <a href="#certification-{{ $certification->id }}" class="btn btn-secondary btn-block mt-2">
                            View Lessons & Modules
                        </a>
                    </div>
                @endforeach
            </div>
        @else
            <p>No certifications available yet.</p>
        @endif
    </div>

    <div class="card mt-4" id="my-coursework">
        <h2>Certification Lessons and Modules</h2>

        @if($certifications->count() > 0)
            @foreach($certifications as $certification)
                <div class="course-section mt-4" id="certification-{{ $certification->id }}">
                    <h3>{{ $certification->title }}</h3>
                    <p class="text-muted">{{ $certification->description }}</p>

                    @if($certification->lessons->count() > 0)
                        @foreach($certification->lessons as $lesson)
                            <div class="card lesson-card mt-3">
                                <h4>{{ $lesson->title }}</h4>
                                <p>{{ $lesson->description ?? 'No lesson description.' }}</p>

                                @if($lesson->modules->count() > 0)
                                    <div class="module-list mt-3">
                                        @foreach($lesson->modules as $module)
                                            <div class="module-item">
                                                <strong>{{ $module->title }}</strong>
                                                <p>{{ $module->description ?? 'No module description.' }}</p>
                                                <p><strong>Type:</strong> {{ ucfirst($module->content_type) }}</p>

                                                @if($module->file_path)
                                                    <a href="{{ asset('storage/' . $module->file_path) }}" target="_blank" class="btn btn-secondary">
                                                        Open Module File
                                                    </a>
                                                @else
                                                    <span class="text-muted">No file uploaded.</span>
                                                @endif
                                            </div>
                                        @endforeach
                                    </div>
                                @else
                                    <p class="text-muted">No modules uploaded for this lesson yet.</p>
                                @endif
                            </div>
                        @endforeach
                    @else
                        <p class="text-muted">No lessons added for this certification yet.</p>
                    @endif
                </div>
            @endforeach
        @else
            <p>No coursework available yet.</p>
        @endif
    </div>
@endsection