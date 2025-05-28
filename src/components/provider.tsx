"use client";

import type { TooltipProviderProps } from "@radix-ui/react-tooltip";
import { QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider, type ThemeProviderProps } from "next-themes";
import type React from "react";
import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";
import { getQueryClient } from "~/lib/query";

interface ProviderProps {
	themesProps?: ThemeProviderProps;
	tooltipProps?: TooltipProviderProps;
}
export default function Provider(
	props: React.PropsWithChildren<ProviderProps>
) {
	const queryClient = getQueryClient();

	return (
		<QueryClientProvider client={queryClient}>
			<ThemeProvider
				attribute={"class"}
				defaultTheme="system"
				enableColorScheme
				enableSystem
				{...props.themesProps}
			>
				<TooltipProvider
					skipDelayDuration={500}
					{...props.tooltipProps}
				>
					{props.children}
					<Toaster />
				</TooltipProvider>
			</ThemeProvider>
		</QueryClientProvider>
	);
}
