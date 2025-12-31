/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class", // <--- ESTA LÍNEA ES OBLIGATORIA
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
