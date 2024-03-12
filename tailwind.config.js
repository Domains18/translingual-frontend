/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./templates/**/*.liquid",
    "./snippets/**/*.liquid",
    "./layout/**/*.liquid"
  ], // this is where our templates are located
  theme: {
    extend: {},
  },
  plugins: [],
}