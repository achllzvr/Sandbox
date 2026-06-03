@php
    $assetBase = rtrim(request()->getBaseUrl(), '/');
    $sandboxCssPath = public_path('css/style.css');
    $sandboxCssVersion = is_file($sandboxCssPath) ? (string) filemtime($sandboxCssPath) : '1';
@endphp
<link rel="stylesheet" href="{{ $assetBase }}/css/style.css?v={{ $sandboxCssVersion }}">
<script>
    window.__SANDBOX_ASSET_BASE__ = @json($assetBase);
    window.__SANDBOX_VITE_BUILD__ = @json(rtrim($assetBase, '/') . '/build/assets');
</script>
