<li>
    <a href="{{ route('staff.dashboard') }}">Staff Dashboard</a>
</li>
<li>
    <a href="{{ route('staff.lessons.create') }}">Manage Lessons</a>
</li>
<li>
    <a href="{{ route('staff.modules.create') }}">Upload Modules</a>
</li>
<li>
    <a href="{{ route('staff.questions.create') }}">Upload Questions</a>
</li>
<li>
    <a href="{{ route('staff.enrollments') }}">Enrollments</a>
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
