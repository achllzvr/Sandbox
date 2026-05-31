@php
    $assetBase = rtrim(request()->getBaseUrl(), '/');
    $componentsCssPath = public_path('css/sandbox-components.css');
    $componentsCssVersion = is_file($componentsCssPath) ? (string) filemtime($componentsCssPath) : '1';
    $adminCssPath = public_path('css/sandbox-admin.css');
    $adminCssVersion = is_file($adminCssPath) ? (string) filemtime($adminCssPath) : '1';
@endphp
{{-- Loaded after Vite/Tailwind so Sandbox component styles win over Preflight --}}
<link rel="stylesheet" href="{{ $assetBase }}/css/sandbox-components.css?v={{ $componentsCssVersion }}">
<link rel="stylesheet" href="{{ $assetBase }}/css/sandbox-admin.css?v={{ $adminCssVersion }}">
