"use client";

import { LoaderCircle, Sidebar, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useSidebar } from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { authClient } from "~/lib/auth.client";
import { cn } from "~/lib/utils";

export default function AppHeader() {
  const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
  const { toggleSidebar } = useSidebar();
  const isMobile = useIsMobile();
  const { data, error, isPending } = authClient.useSession();

  useEffect(() => {
    setDrawerOpen(false);
  }, [isMobile]);

  return (
    <header className="flex md:hidden h-16 shrink-0 items-center justify-between gap-2 px-4 bg-sidebar border-b border-sidebar-border">
      <Button variant={"ghost"} size={"icon"} onClick={toggleSidebar} className="size-10 p-0 [&_svg]:size-5">
        <Sidebar />
      </Button>

      <Avatar className="border select-none group-data-[collapsible=icon]:size-8 cursor-default">
        <AvatarImage src={isPending || error ? undefined : data?.user.image ?? undefined} alt="User profile" />
        <AvatarFallback
          className={cn(
            "bg-muted text-muted-foreground grid place-items-center",
            error && "bg-destructive text-destructive-foreground"
          )}
        >
          {isPending ? (
            <LoaderCircle className="size-4 animate-spin" />
          ) : error ? (
            <X className="size-4" />
          ) : (
            <span className="font-semibold">{data?.user.name.charAt(0).toUpperCase() ?? "?"}</span>
          )}
        </AvatarFallback>
      </Avatar>
    </header>
  );
}
