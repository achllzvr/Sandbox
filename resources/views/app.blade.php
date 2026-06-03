<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">
    <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <title inertia>{{ config('app.name', 'Sandbox') }}</title>

        {{-- Global Sandbox styles (public/css/style.css) — works without Vite --}}
        @include('partials.sandbox-styles')

        @routes
        @viteReactRefresh
        @vite(['resources/js/app.jsx', "resources/js/Pages/{$page['component']}.jsx"])

        {{-- Sandbox UI components — after Tailwind so styles are not reset --}}
        @include('partials.sandbox-components-styles')

        @inertiaHead
    </head>
    <body class="font-sans antialiased">
        @inertia
        <script src="{{ rtrim(request()->getBaseUrl(), '/') }}/js/script.js" defer></script>
    </body>
</html>
