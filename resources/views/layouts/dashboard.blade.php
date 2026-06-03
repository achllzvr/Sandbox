<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Dashboard') — Sandbox</title>
    @include('partials.sandbox-styles')
</head>
<body class="dashboard-body">
    <aside class="sidebar">
        <div class="sidebar-header">
            <h2>SANDBOX</h2>
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
    <script src="{{ asset('js/script.js') }}" defer></script>
    @stack('scripts')
</body>
</html>
