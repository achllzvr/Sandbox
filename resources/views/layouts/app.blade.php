<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>@yield('title', 'Sandbox')</title>
    @include('partials.sandbox-styles')
</head>
<body>
    <x-navbar />

    <main class="main-content">
        @if (session('success'))
            <div class="container mt-4">
                <div class="alert alert-success">
                    {{ session('success') }}
                </div>
            </div>
        @endif

        @yield('content')
    </main>

    <x-footer />

    <script src="{{ asset('js/script.js') }}" defer></script>
    @stack('scripts')
</body>
</html>
