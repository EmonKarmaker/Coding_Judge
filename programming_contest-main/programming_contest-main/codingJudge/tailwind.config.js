/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "primary-color": "#6440FA",
        "secondary-color": "#2f4858",
        "active-color": "#FF9D0F",
        "bg-text": "#FFFFFFB3",
        text: "#777777",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["dark"],
  },
};
