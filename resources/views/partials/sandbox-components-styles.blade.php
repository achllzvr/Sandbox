@php
    $assetBase = rtrim(request()->getBaseUrl(), '/');
    $componentsCssPath = public_path('css/sandbox-components.css');
    $componentsCssVersion = is_file($componentsCssPath) ? (string) filemtime($componentsCssPath) : '1';
    $adminCssPath = public_path('css/sandbox-admin.css');
    $adminCssVersion = is_file($adminCssPath) ? (string) filemtime($adminCssPath) : '1';
    $studentCssPath = public_path('css/sandbox-student.css');
    $studentCssVersion = is_file($studentCssPath) ? (string) filemtime($studentCssPath) : '1';
    $creatorCssPath = public_path('css/sandbox-creator.css');
    $creatorCssVersion = is_file($creatorCssPath) ? (string) filemtime($creatorCssPath) : '1';
@endphp
{{-- Loaded after Vite/Tailwind so Sandbox component styles win over Preflight --}}
<link rel="stylesheet" href="{{ $assetBase }}/css/sandbox-components.css?v={{ $componentsCssVersion }}">
<link rel="stylesheet" href="{{ $assetBase }}/css/sandbox-admin.css?v={{ $adminCssVersion }}">
<link rel="stylesheet" href="{{ $assetBase }}/css/sandbox-student.css?v={{ $studentCssVersion }}">
<link rel="stylesheet" href="{{ $assetBase }}/css/sandbox-creator.css?v={{ $creatorCssVersion }}">
<script>
    (function () {
        try {
            var theme = localStorage.getItem('sandbox-admin-theme');
            var highContrast = localStorage.getItem('sandbox-admin-high-contrast');
            if (theme === 'light' || theme === 'dark') {
                document.documentElement.setAttribute('data-admin-theme', theme);
            }
            if (theme === 'light' && highContrast === '1') {
                document.documentElement.setAttribute('data-admin-contrast', 'high');
            }
        } catch (e) {}
    })();
</script>
