<li>
    <a href="{{ route('content_creator.dashboard') }}">content_creator Dashboard</a>
</li>
<li>
    <a href="{{ route('content_creator.lessons.create') }}">Manage Lessons</a>
</li>
<li>
    <a href="{{ route('content_creator.modules.create') }}">Upload Modules</a>
</li>
<li>
    <a href="{{ route('content_creator.questions.create') }}">Upload Questions</a>
</li>
<li>
    <a href="{{ route('content_creator.enrollments') }}">Enrollments</a>
</li>
<li class="nav-user">
    <span>{{ session('full_name') ?? session('email') }}</span>
</li>
<li>
    <form method="POST" action="{{ route('logout') }}" class="nav-logout-form">
        @csrf
        <button type="submit" class="btn btn-secondary nav-btn">Logout</button>
    </form>
</li>

