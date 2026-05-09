const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'Figtree', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                sand: {
                    50: '#fdfbf7',
                    100: '#f9f6ef',
                    200: '#f0e8d9',
                    300: '#e5d5be',
                    400: '#d5bda0',
                    500: '#c5a382',
                },
                ocean: {
                    50: '#f0f9ff',
                    100: '#e0f2fe',
                    500: '#0ea5e9',
                    600: '#0284c7',
                    700: '#0369a1',
                },
                navy: {
                    800: '#1e293b',
                    900: '#0f172a',
                },
                teal: {
                    400: '#2dd4bf',
                    500: '#14b8a6',
                    600: '#0d9488',
                },
            },
        },
    },

    plugins: [require('@tailwindcss/forms')],
};
