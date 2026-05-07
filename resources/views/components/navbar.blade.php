<header class="app-header">
    <div class="container flex-between">
        <div class="logo">
            <a href="{{ route('home') }}">CertManage</a>
        </div>

        <nav class="main-nav">
            <ul>
                <li>
                    <a href="{{ route('home') }}">
                        Home
                    </a>
                </li>

                @if(session('user_id'))
                    @if(session('role') === 'admin')
                        <li>
                            <a href="{{ route('admin.dashboard') }}">
                                Admin Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('admin.staff.create') }}">
                                Create Staff
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('admin.certifications.create') }}">
                                Create Certification
                            </a>
                        </li>
                    @elseif(session('role') === 'staff')
                        <li>
                            <a href="{{ route('staff.dashboard') }}">
                                Staff Dashboard
                            </a>
                        </li>
                        <li>
                            <a href="{{ route('staff.modules.create') }}">
                                Upload Modules
                            </a>
                        </li>
                    @elseif(session('role') === 'user')
                        <li>
                            <a href="{{ route('user.dashboard') }}">
                                My Dashboard
                            </a>
                        </li>
                    @endif

                    <li class="nav-user">
                        <span>
                            {{ session('full_name') ?? session('email') }}
                        </span>
                    </li>

                    <li>
                        <form method="POST" action="{{ route('logout') }}" class="nav-logout-form">
                            @csrf
                            <button type="submit" class="btn btn-secondary nav-btn">
                                Logout
                            </button>
                        </form>
                    </li>
                @else
                    <li>
                        <a href="{{ route('login') }}" class="nav-link">
                            Login
                        </a>
                    </li>
                    <li>
                        <a href="{{ route('register.show') }}" class="btn btn-primary nav-btn">
                            Register as Taker
                        </a>
                    </li>
                @endif
            </ul>
        </nav>
    </div>
</header>