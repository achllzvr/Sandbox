export function assetUrl(path) {
    const base =
        typeof window !== 'undefined' && window.__SANDBOX_ASSET_BASE__
            ? window.__SANDBOX_ASSET_BASE__
            : '';
    return `${base}/${String(path).replace(/^\//, '')}`;
}

export function viteBuildAssetUrl(viteImportedUrl) {
    const filename = String(viteImportedUrl).split('/').pop()?.split('?')[0];

    if (!filename) {
        return viteImportedUrl;
    }

    const buildBase =
        typeof window !== 'undefined' && window.__SANDBOX_VITE_BUILD__
            ? window.__SANDBOX_VITE_BUILD__
            : '/build/assets';

    return `${String(buildBase).replace(/\/$/, '')}/${filename}`;
}
