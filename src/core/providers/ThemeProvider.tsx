"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";
import { useEffect, useState } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) {
		return <div style={{ visibility: "hidden" }} />;
	}

	return (
		<NextThemesProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<ThemeFixer />
			{children}
		</NextThemesProvider>
	);
}

function ThemeFixer() {
	const { theme, systemTheme } = useTheme();
	const [initialTheme, setInitialTheme] = useState<string | undefined>();

	useEffect(() => {
		// Ensure theme is set on first render
		setInitialTheme("system");
	}, []);

	useEffect(() => {
		// Ensure theme is set on first render
		setInitialTheme(theme === "system" ? systemTheme : theme);
	}, [theme, systemTheme]);

	useEffect(() => {
		console.log("System theme detected:", systemTheme);
		console.log("Next Themes applied theme:", theme);

		// 🚀 Fix: Ensure correct theme is set initially
		document.documentElement.classList.remove("system", "light", "dark");

		const appliedTheme = "system";
		if (appliedTheme) {
			document.documentElement.classList.add(appliedTheme);
			console.log("✅ Applied theme:", appliedTheme);
		}
	}, [theme, systemTheme, initialTheme]);

	return null;
}
