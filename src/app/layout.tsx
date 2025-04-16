import type { Metadata } from "next";
import { manrope } from "@/core/assets/fonts";
import "../core/styles/globals.css";
import React, { Suspense } from "react";
import { Providers } from "@/core/config/Providers";
import Loading from "@/shared/components/Loading/Loading";

export const metadata: Metadata = {
	title: "TITLE",
	description: "description",
	creator: "ZIZ INC.",
	generator: "Next.js",
	// icons: {
	// 	icon: "/logo.svg",
	// 	shortcut: "/logo.svg",
	// 	apple: "/logo.svg",
	// },
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en">
			<body className={`${manrope.className}`}>
				<Suspense fallback={<Loading />}>
					<Providers>{children}</Providers>
				</Suspense>
			</body>
		</html>
	);
}
