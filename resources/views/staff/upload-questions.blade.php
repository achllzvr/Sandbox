@extends('layouts.dashboard')
@section('title', 'Upload Questions')

@section('sidebar')
    <ul>
        <li><a href="{{ route('staff.dashboard') }}">Dashboard</a></li>
        <li><a href="{{ route('staff.lessons.create') }}">Manage Lessons</a></li>
        <li><a href="{{ route('staff.modules.create') }}">Upload Modules</a></li>
        <li><a href="{{ route('staff.questions.create') }}" class="active">Upload Questions</a></li>
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
        <h1>Upload Questions</h1>
        <p class="text-muted">Add up to 5 multiple-choice questions per module.</p>
    </div>

    @if(session('success'))
        <div class="alert alert-success">{{ session('success') }}</div>
    @endif

    @if($errors->any())
        <div class="alert alert-error">{{ $errors->first() }}</div>
    @endif

    <div class="card form-card">
        <form action="" method="GET" class="dashboard-form">
            <div class="form-group">
                <label for="module_id">Select Module</label>
                <select id="module_id" name="module_id" onchange="this.form.submit()">
                    <option value="">-- Choose a Module --</option>
                    @foreach($staffModules as $mod)
                        <option value="{{ $mod->id }}" {{ isset($selectedModule) && $selectedModule->id == $mod->id ? 'selected' : '' }}>
                            {{ $mod->title }} — {{ $mod->lesson->certification->title ?? '' }} / {{ $mod->lesson->title ?? '' }}
                        </option>
                    @endforeach
                </select>
            </div>
        </form>
    </div>

    @if($selectedModule)
        <div class="card mt-4">
            <h2>Questions for: {{ $selectedModule->title }}</h2>
            <p class="text-muted">{{ $questions->count() }} / 5 questions added.</p>

            @if($questions->count() > 0)
                <table class="data-table mt-3">
                    <thead>
                        <tr>
                            <th>#</th>
                            <th>Question</th>
                            <th>A</th>
                            <th>B</th>
                            <th>C</th>
                            <th>D</th>
                            <th>Answer</th>
                        </tr>
                    </thead>
                    <tbody>
                        @foreach($questions as $i => $q)
                            <tr>
                                <td>{{ $i + 1 }}</td>
                                <td>{{ $q->question_text }}</td>
                                <td>{{ $q->option_a }}</td>
                                <td>{{ $q->option_b }}</td>
                                <td>{{ $q->option_c }}</td>
                                <td>{{ $q->option_d }}</td>
                                <td><strong>{{ strtoupper($q->correct_answer) }}</strong></td>
                            </tr>
                        @endforeach
                    </tbody>
                </table>
            @else
                <p class="text-muted mt-3">No questions yet.</p>
            @endif
        </div>

        @if($questions->count() < 5)
            <div class="card form-card mt-4">
                <h2>Add Question {{ $questions->count() + 1 }}</h2>
                <form action="{{ route('staff.questions.store') }}" method="POST" class="dashboard-form">
                    @csrf
                    <input type="hidden" name="module_id" value="{{ $selectedModule->id }}">

                    <div class="form-group">
                        <label for="question_text">Question</label>
                        <textarea id="question_text" name="question_text" rows="2" required placeholder="Enter question...">{{ old('question_text') }}</textarea>
                    </div>

                    <div class="grid-2">
                        <div class="form-group">
                            <label for="option_a">Option A</label>
                            <input type="text" id="option_a" name="option_a" required value="{{ old('option_a') }}">
                        </div>
                        <div class="form-group">
                            <label for="option_b">Option B</label>
                            <input type="text" id="option_b" name="option_b" required value="{{ old('option_b') }}">
                        </div>
                        <div class="form-group">
                            <label for="option_c">Option C</label>
                            <input type="text" id="option_c" name="option_c" required value="{{ old('option_c') }}">
                        </div>
                        <div class="form-group">
                            <label for="option_d">Option D</label>
                            <input type="text" id="option_d" name="option_d" required value="{{ old('option_d') }}">
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="correct_answer">Correct Answer</label>
                        <select id="correct_answer" name="correct_answer" required>
                            <option value="">-- Select --</option>
                            <option value="a" {{ old('correct_answer') == 'a' ? 'selected' : '' }}>A</option>
                            <option value="b" {{ old('correct_answer') == 'b' ? 'selected' : '' }}>B</option>
                            <option value="c" {{ old('correct_answer') == 'c' ? 'selected' : '' }}>C</option>
                            <option value="d" {{ old('correct_answer') == 'd' ? 'selected' : '' }}>D</option>
                        </select>
                    </div>

                    <div class="form-actions mt-4">
                        <button type="submit" class="btn btn-primary">Add Question</button>
                    </div>
                </form>
            </div>
        @else
            <div class="card mt-4">
                <p>This module already has 5 questions (maximum reached).</p>
            </div>
        @endif
    @endif
@endsection
