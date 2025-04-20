/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './thresh-ui/src/**/*.{vue,js,ts,jsx,tsx}'],
    theme: {
      extend: {
        colors: {
          'dark-green': '#283618',
          'light-green': '#606C38',
          'dark-orange': '#BC6C25',
          'light-orange': '#DDA15E',
          'dark-brown': '#4B231B',
          'light-brown': '#914F3B',
        },
      },
    },
    plugins: [],
  };
  