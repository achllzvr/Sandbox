import { defineConfig, loadEnv } from 'vite';
import laravel from 'laravel-vite-plugin';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    let base = '/';

    if (env.APP_URL) {
        try {
            const pathname = new URL(env.APP_URL).pathname;
            base = pathname.endsWith('/') ? `${pathname}build/` : `${pathname}/build/`;
        } catch {
            base = '/';
        }
    }

    return {
        base,
        plugins: [
            laravel({
                input: 'resources/js/app.jsx',
                refresh: true,
            }),
            react(),
        ],
    };
});
