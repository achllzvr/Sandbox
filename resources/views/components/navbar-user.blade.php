<li>
    <a href="{{ route('user.dashboard') }}">My Dashboard</a>
</li>
<li>
    <a href="{{ route('user.dashboard') }}#available-certifications">Browse Certifications</a>
</li>
<li>
    <a href="{{ route('user.dashboard') }}#my-coursework">My Coursework</a>
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
