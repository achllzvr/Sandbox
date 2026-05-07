@extends('layouts.dashboard')
@section('title', 'Upload Module')

@section('sidebar')
    <ul>
        <li><a href="{{ route('staff.dashboard') }}">Dashboard</a></li>
        <li><a href="{{ route('staff.lessons.create') }}">Manage Lessons</a></li>
        <li><a href="{{ route('staff.modules.create') }}" class="active">Upload Modules</a></li>
        <li><a href="{{ route('staff.questions.create') }}">Upload Questions</a></li>
        <li><a href="{{ route('staff.enrollments') }}">Enrollments</a></li>
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
        <h1>Upload Module Material</h1>
        <p class="text-muted">Attach content directly to a certification by entering a lesson title.</p>
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
        <form action="{{ route('staff.modules.store') }}" method="POST" enctype="multipart/form-data" class="dashboard-form">
            @csrf

            <div class="grid-2">
                <div class="form-group">
                    <label for="certification_id">Select Certification</label>
                    <select id="certification_id" name="certification_id" required>
                        <option value="">-- Choose Certification --</option>
                        @foreach($certifications as $certification)
                            <option value="{{ $certification->id }}">
                                {{ $certification->title }}
                            </option>
                        @endforeach
                    </select>
                </div>

                <div class="form-group">
                    <label for="lesson_title">Lesson Title</label>
                    <input 
                        type="text" 
                        id="lesson_title" 
                        name="lesson_title" 
                        required 
                        placeholder="e.g., Introduction to HTML"
                    >
                </div>
            </div>

            <div class="form-group mt-3">
                <label for="title">Module Title</label>
                <input type="text" id="title" name="title" required placeholder="e.g., HTML Basics">
            </div>

            <div class="form-group">
                <label for="description">Module Description</label>
                <textarea id="description" name="description" rows="3" placeholder="Brief context about this module..."></textarea>
            </div>

            <div class="grid-2">
                <div class="form-group">
                    <label for="content_file">Upload Content / File</label>
                    <input type="file" id="content_file" name="content_file">
                </div>

                <div class="form-group">
                    <label for="content_type">Content Type</label>
                    <select id="content_type" name="content_type" required>
                        <option value="video">Video (.mp4, .mov)</option>
                        <option value="document">Document (.pdf, .doc, .ppt)</option>
                        <option value="link">External Link</option>
                    </select>
                </div>
            </div>

            <div class="form-group mt-3">
                <label for="duration_weeks">Module Duration (weeks)</label>
                <input type="number" id="duration_weeks" name="duration_weeks" min="1" value="{{ old('duration_weeks', 1) }}" required>
            </div>

            <div class="form-actions mt-4">
                <button type="submit" class="btn btn-primary">Upload Module</button>
            </div>
        </form>
    </div>

    <div class="card mt-4">
        <h2>Uploaded Modules</h2>

        @if($modules->count() > 0)
            <table class="data-table">
                <thead>
                    <tr>
                        <th>Module Title</th>
                        <th>Lesson</th>
                        <th>Certification</th>
                        <th>Content Type</th>
                        <th>Duration</th>
                        <th>File</th>
                    </tr>
                </thead>
                <tbody>
                    @foreach($modules as $module)
                        <tr>
                            <td>{{ $module->title }}</td>
                            <td>{{ $module->lesson->title ?? 'No lesson' }}</td>
                            <td>{{ $module->lesson->certification->title ?? 'No certification' }}</td>
                            <td>{{ ucfirst($module->content_type) }}</td>
                            <td>{{ $module->duration_weeks }} week{{ $module->duration_weeks != 1 ? 's' : '' }}</td>
                            <td>
                                @if($module->file_path)
                                    <a href="{{ asset('storage/' . $module->file_path) }}" target="_blank">
                                        View File
                                    </a>
                                @else
                                    No file
                                @endif
                            </td>
                        </tr>
                    @endforeach
                </tbody>
            </table>
        @else
            <p>No modules uploaded yet.</p>
        @endif
    </div>
@endsection