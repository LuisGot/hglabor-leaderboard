/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  darkMode: "class",
  theme: {
    extend: {
      keyframes: {
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "slide-up": {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "bounce-in": {
          "0%": { transform: "scale(0)", opacity: "0" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-up": "slide-up 0.5s ease-out forwards",
        "bounce-in":
          "bounce-in 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
    },
  },
  plugins: [
    function ({ addUtilities, theme }) {
      const animationDelays = {
        ...Array.from({ length: 20 }, (_, i) => ({
          [`.animation-delay-${(i + 1) * 100}`]: {
            "animation-delay": `${(i + 1) * 100}ms`,
          },
        })).reduce((acc, curr) => ({ ...acc, ...curr }), {}),
      };
      addUtilities(animationDelays, ["responsive"]);
    },
  ],
};
