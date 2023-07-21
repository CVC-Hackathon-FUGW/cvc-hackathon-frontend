import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
        padding: '2.5rem',
      },
    },
  },
  corePlugins: {
    preflight: false,
    accentColor: true,
  },
  plugins: [],
} satisfies Config;
