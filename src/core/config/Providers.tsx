"use client";
import { SessionProvider } from "next-auth/react";
import React from "react";

export const Providers = ({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) => {
	return <>{children}</>;
};
