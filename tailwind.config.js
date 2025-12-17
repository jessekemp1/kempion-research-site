/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: '#050505', // Deep smooth black
                surface: '#0a0a0a',
                primary: '#3b82f6', // Standard blue for now, will override
                accent: '#06b6d4', // Cyan
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                display: ['Syncopate', 'sans-serif'], // We might need to import this
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
        },
    },
    plugins: [],
}
