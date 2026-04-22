import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f6fbfe',
          100: '#eaf5fc',
          200: '#cfe6f7',
          300: '#b0d4f1',
          400: '#7fb7e7',
          500: '#4c92d8',
          600: '#2f70bf',
          700: '#285d9f',
          800: '#274f82',
          900: '#273f68',
        },
      },
      boxShadow: {
        soft: '0 12px 36px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  plugins: [],
};

export default config;
