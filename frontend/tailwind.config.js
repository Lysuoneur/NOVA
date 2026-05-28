/** @type {import('tailwindcss').Config} */
export default {
    content: ["./index.html", "./src/**/*.{js,jsx}"],
    theme: {
        extend: {
            colors: {
                black: "#0a0a0a",
                white: "#ffffff",
                silver: "#c4c4c4",
                gold: "#d4af37",
                chrome: "#e8e8e8",
                y2k: {
                    pink: "#ff69b4",
                    cyber: "#00f5ff",
                    lime: "#b4ff00",
                    violet: "#8b5cf6",
                },
            },
            fontFamily: {
                display: ["Bebas Neue", "sans-serif"],
                sans: ["DM Sans", "system-ui", "sans-serif"],
                mono: ["Space Mono", "monospace"],
            },
            boxShadow: {
                glow: "0 0 0 1px rgba(212,175,55,0.2), 0 8px 24px rgba(0,0,0,0.15)",
                chrome: "0 2px 0 rgba(255,255,255,0.8) inset, 0 4px 16px rgba(0,0,0,0.12)",
                hard: "4px 4px 0 #0a0a0a",
                "hard-gold": "4px 4px 0 #d4af37",
            },
            keyframes: {
                ticker: { "0%": { transform: "translateX(0)" }, "100%": { transform: "translateX(-50%)" } },
                float: { "0%,100%": { transform: "translateY(0)" }, "50%": { transform: "translateY(-4px)" } },
                shimmer: { "0%": { backgroundPosition: "-200% center" }, "100%": { backgroundPosition: "200% center" } },
                slideUp: { "0%": { transform: "translateY(12px)", opacity: 0 }, "100%": { transform: "translateY(0)", opacity: 1 } },
                glitch: {
                    "0%,100%": { transform: "translate(0)" },
                    "20%": { transform: "translate(-2px,1px)" },
                    "40%": { transform: "translate(2px,-1px)" },
                    "60%": { transform: "translate(-1px,2px)" },
                    "80%": { transform: "translate(1px,-2px)" },
                },
                pulse2: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0.4 } },
            },
            animation: {
                ticker: "ticker 25s linear infinite",
                float: "float 6s ease-in-out infinite",
                shimmer: "shimmer 2s linear infinite",
                slideUp: "slideUp 0.4s ease forwards",
                glitch: "glitch 0.4s step-end infinite",
                pulse2: "pulse2 1.5s ease-in-out infinite",
            },
        },
    },
    plugins: [],
};