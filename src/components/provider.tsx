"use client";

import { ThemeProvider, type ThemeProviderProps } from "next-themes";
import type React from "react";
import { Toaster } from "~/components/ui/sonner";
import { TooltipProvider } from "~/components/ui/tooltip";

interface ProviderProps {
  themesProps?: ThemeProviderProps;
}
export default function Provider(props: React.PropsWithChildren<ProviderProps>) {
  return (
    <>
      <ThemeProvider attribute={"class"} defaultTheme="system" enableColorScheme enableSystem {...props.themesProps}>
        <TooltipProvider>
          {props.children}
          <Toaster />
        </TooltipProvider>
      </ThemeProvider>
    </>
  );
}
