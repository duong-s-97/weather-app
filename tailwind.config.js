/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        blur: {
          100: "#ffffff0a",
          200: "#ffffff24",
        },
        pink: {
          100: "#dfa1a1",
        },
        gray: {
          100: "#ffffffb3",
        },
      },
    },
  },
  plugins: [],
};
