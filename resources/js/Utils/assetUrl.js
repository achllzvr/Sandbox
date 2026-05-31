export function assetUrl(path) {
    const base =
        typeof window !== 'undefined' && window.__SANDBOX_ASSET_BASE__
            ? window.__SANDBOX_ASSET_BASE__
            : '';
    return `${base}/${String(path).replace(/^\//, '')}`;
}
