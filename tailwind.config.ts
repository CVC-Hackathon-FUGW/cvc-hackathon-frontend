import type { Config } from 'tailwindcss';

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  corePlugins: {
    preflight: false,
    accentColor: false,
  },
  plugins: [],
} satisfies Config;
