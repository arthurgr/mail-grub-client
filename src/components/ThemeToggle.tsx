import React, { useEffect, useState } from "react";

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        return localStorage.getItem("theme") === "dark";
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (isDark) {
            root.classList.add("dark");
            localStorage.setItem("theme", "dark");
        } else {
            root.classList.remove("dark");
            localStorage.setItem("theme", "light");
        }
    }, [isDark]);

    return (
        <button
            onClick={() => setIsDark((prev) => !prev)}
            className="px-3 py-1 text-sm border rounded"
        >
            {isDark ? "☀️ Light" : "🌙 Dark"}
        </button>
    );
}
