<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Dashboard') - Certification Platform</title>
    <link rel="stylesheet" href="{{ asset('css/style.css') }}">
</head>
<body class="dashboard-body">
    <aside class="sidebar">
        <div class="sidebar-header">
            <h2>CertManage</h2>
        </div>
        <nav class="sidebar-nav">
            @yield('sidebar')
        </nav>
    </aside>
    <div class="dashboard-main">
        <header class="dashboard-header">
            <div class="user-info">
                <span>Welcome, {{ session('first_name', 'User') }}</span>
                <form method="POST" action="{{ route('logout') }}" style="display:inline;">
                    @csrf
                    <button type="submit" class="btn-logout">Logout</button>
                </form>
            </div>
        </header>
        <main class="dashboard-content">
            @yield('content')
        </main>
    </div>
</body>
</html>