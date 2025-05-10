"use client";

import {
	Book,
	Key,
	LayoutDashboard,
	LifeBuoy,
	LoaderCircle,
	Lock,
	Settings,
	X,
	type LucideProps,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "~/components/ui/sidebar";
import { useIsMobile } from "~/hooks/use-mobile";
import { authClient } from "~/lib/auth.client";
import { cn } from "~/lib/utils";
import type { environmentFolderModel, environmentModel } from "~/model";

type NavigationItem = {
	title: React.ReactNode;
	icon?: React.ComponentType<LucideProps>;
	description: string;
	href: string;
	onClick?: () => void;
	destructive?: boolean;
};
type NavigationGroup = {
	title: React.ReactNode;
	items: NavigationItem[];
};

const navigations: (NavigationItem | NavigationGroup)[] = [
	{
		title: "Dashboard",
		icon: LayoutDashboard,
		description: "View stats and activity",
		href: "/dashboard",
	},
	{
		title: "Manage",
		items: [
			{
				title: "Environments",
				icon: Key,
				description: "Manage your saved environments",
				href: "/dashboard/environments",
			},
			{
				title: "Key Access",
				icon: Lock,
				description: "Manage access to your environments",
				href: "/dashboard/key-access",
			},
		],
	},
] as const;
const bottomsNavigations: NavigationItem[] = [
	{
		title: "How to use",
		icon: Book,
		description: "Read on how to use Himitsu",
		href: "/how-to-use",
	},
	{
		title: "Settings",
		icon: Settings,
		description: "Manage your account settings",
		href: "/dashboard/settings",
	},
] as const;

export default function AppSidebar({
	data,
	...props
}: React.ComponentProps<typeof Sidebar> & {
	data: {
		enviroments: {
			folders: (Pick<
				typeof environmentFolderModel.$inferSelect,
				"id" | "name" | "color" | "createdAt" | "updatedAt"
			> & {
				envs: Pick<
					typeof environmentModel.$inferSelect,
					| "id"
					| "name"
					| "description"
					| "privacy"
					| "createdAt"
					| "updatedAt"
				>[];
			})[];
			envs: Pick<
				typeof environmentModel.$inferSelect,
				| "id"
				| "name"
				| "description"
				| "privacy"
				| "createdAt"
				| "updatedAt"
			>[];
		};
	};
}) {
	const { state, toggleSidebar } = useSidebar();
	const isMobile = useIsMobile();
	const pathname = usePathname();
	const router = useRouter();

	return (
		<Sidebar
			collapsible="icon"
			{...props}
		>
			{/* Icon sidebar */}
			<Sidebar
				collapsible="none"
				className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
			>
				<SidebarHeader>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								asChild
								tooltip={"Himitsu"}
							>
								<Link
									href={"/dashboard"}
									className="aspect-square rounded-lg grid place-items-center bg-primary text-primary-foreground"
								>
									<Key />
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>
				</SidebarHeader>

				<SidebarContent className="items-center justify-center">
					<SidebarGroup>
						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip={"Manage Access"}>
									<Lock />
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>

						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip={"Getting Started"}>
									<LifeBuoy />
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>

						<SidebarMenu>
							<SidebarMenuItem>
								<SidebarMenuButton tooltip={"Settings"}>
									<Settings />
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					</SidebarGroup>
				</SidebarContent>

				<SidebarFooter>
					<User />
				</SidebarFooter>
			</Sidebar>
		</Sidebar>
	);
}

function User() {
	const { data, error, isPending } = authClient.useSession();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					className="p-0 rounded-full"
					tooltip={data?.user.name}
				>
					<Avatar className="border cursor-default select-none size-8 group-data-[collapsible=icon]:size-8">
						<AvatarImage
							src={
								isPending || error
									? undefined
									: data?.user.image ?? undefined
							}
							alt="User profile"
						/>
						<AvatarFallback
							className={cn(
								"bg-muted text-muted-foreground grid place-items-center",
								error &&
									"bg-destructive text-destructive-foreground"
							)}
						>
							{isPending ? (
								<LoaderCircle className="size-4 animate-spin" />
							) : error ? (
								<X className="size-4" />
							) : (
								<span className="font-semibold">
									{data?.user.name.charAt(0).toUpperCase() ??
										"?"}
								</span>
							)}
						</AvatarFallback>
					</Avatar>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}