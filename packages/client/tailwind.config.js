/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      width: {
        '22': '5.5rem',  // 22 * 0.25rem = 5.5rem
        '24': '6rem',    // 24 * 0.25rem = 6rem
        '26': '6.5rem',  // 26 * 0.25rem = 6.5rem
        '28': '7rem',    // 28 * 0.25rem = 7rem
        // Add more as needed
      },
    },
  },
  plugins: [],
}