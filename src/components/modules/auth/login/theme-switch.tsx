"use client";

import { Check, Laptop, Moon, Sun, SunMoon } from "lucide-react";
import { useTheme } from "next-themes";
import { Button } from "~/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";

export function LoginThemeSwitch() {
  const { theme, setTheme, themes } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"default"} size={"icon"} className="w-10 h-10 rounded-full p-0 absolute bottom-4 right-4">
          <SunMoon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" side="left">
        {themes.map((t) => (
          <DropdownMenuItem
            key={`theme-${t}`}
            onSelect={() => setTheme(t)}
            disabled={t === theme}
            className="capitalize"
          >
            {t === theme ? <Check /> : t === "system" ? <Laptop /> : t === "dark" ? <Moon /> : <Sun />}
            {t}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
