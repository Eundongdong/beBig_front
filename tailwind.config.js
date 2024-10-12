/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{vue,js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors : {
        primary: '#5354ff',
        serve:'#3435ff',
        light:'#8485FF',
      },
    },
  },
  plugins: [],
}

