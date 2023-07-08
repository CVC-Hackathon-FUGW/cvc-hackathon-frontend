import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      container: {
        center: true,
      },
    },
  },
  corePlugins: {
    preflight: false,
    accentColor: true,
  },
  plugins: [],
} satisfies Config;
