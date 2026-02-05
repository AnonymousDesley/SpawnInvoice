import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "var(--background)",
                foreground: "var(--foreground)",
                primary: {
                    DEFAULT: "#F5F5DC", // Beige
                    foreground: "#000000", // Black
                },
                secondary: {
                    DEFAULT: "#000000", // Black
                    foreground: "#F5F5DC", // Beige
                },
                glass: "rgba(255, 255, 255, 0.1)",
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
};
export default config;
