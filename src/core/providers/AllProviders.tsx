"use client";
// import { SessionProvider } from "next-auth/react";
import React from "react";
import { ThemeProvider } from "./ThemeProvider";
import { QueryProvider } from "./QueryProvider";

export function AllProviders({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<QueryProvider>
			<ThemeProvider>{children}</ThemeProvider>
		</QueryProvider>
	);
}
