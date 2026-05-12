<li>
    <a href="{{ route('admin.dashboard') }}">Admin Dashboard</a>
</li>
<li>
    <a href="{{ route('admin.content_creator.create') }}">Create content_creator</a>
</li>
<li>
    <a href="{{ route('admin.certifications.create') }}">Create Certification</a>
</li>
<li>
    <a href="{{ route('admin.vouchers.index') }}">Manage Vouchers</a>
</li>
<li>
    <a href="{{ route('admin.enrollments') }}">Enrollments</a>
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

