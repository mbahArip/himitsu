"use client";

import {
	Book,
	ChevronRight,
	Key,
	LayoutDashboard,
	LoaderCircle,
	Lock,
	LogOut,
	Settings,
	SidebarClose,
	SidebarOpen,
	X,
	type LucideProps,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarGroupContent,
	SidebarGroupLabel,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubItem,
	SidebarSeparator,
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
				"id" | "name" | "privacy" | "color" | "createdAt" | "updatedAt"
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
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem className="py-2">
						<SidebarMenuButton
							size={"lg"}
							asChild
							className="hover:bg-transparent active:bg-transparent"
						>
							<Link
								href={"/dashboard"}
								className="group/logo"
							>
								<div className="flex aspect-square size-10 group-data-[collapsible=icon]:size-8 items-center justify-center rounded-lg text-sidebar-primary group-hover/logo:bg-sidebar-primary group-hover/logo:text-sidebar-primary-foreground transition-all duration-300 ease-in-out border-sidebar-primary drop-shadow-sm bg-sidebar drop-shadow-sidebar-primary group-data-[collapsible=icon]:drop-shadow-transparent">
									<Key className="size-5" />
								</div>
								<div className="grid flex-1 text-left text-base leading-tight">
									<span className="truncate font-bold">
										Himitsu
									</span>
									<span className="truncate text-xs text-muted-foreground">
										Env Manager
									</span>
								</div>
							</Link>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				{navigations.map((item) => {
					const NavItem = ({ item }: { item: NavigationItem }) => (
						<SidebarMenu key={`nav-${item.href}`}>
							<SidebarMenuItem>
								<SidebarMenuButton
									asChild
									isActive={
										item.href === "/dashboard"
											? pathname === "/dashboard"
											: pathname.startsWith(item.href)
									}
									tooltip={{
										children:
											state === "collapsed" ? (
												<div className="flex flex-col">
													<b className="text-sm">
														{item.title}
													</b>
													<span className="text-xs">
														{item.description}
													</span>
												</div>
											) : (
												item.description
											),
									}}
								>
									<Link href={item.href}>
										{item.icon && <item.icon />}
										<span>{item.title}</span>
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						</SidebarMenu>
					);

					return "items" in item ? (
						<SidebarGroup key={`nav-group-${item.title}`}>
							<SidebarGroupLabel>{item.title}</SidebarGroupLabel>
							<SidebarGroupContent>
								{item.items.map((subItem) => (
									<NavItem
										item={subItem}
										key={`nav-${subItem.href}`}
									/>
								))}
							</SidebarGroupContent>
						</SidebarGroup>
					) : (
						<SidebarGroup key={`nav-${item.title}`}>
							<NavItem
								item={item}
								key={`nav-${item.href}`}
							/>
						</SidebarGroup>
					);
				})}

				<SidebarSeparator className="mx-0" />

				<SidebarGroup>
					<SidebarGroupLabel>Manage</SidebarGroupLabel>
					<SidebarMenu>
						<Collapsible
							asChild
							className="group"
						>
							<SidebarMenuItem>
								<CollapsibleTrigger asChild>
									<SidebarMenuButton>
										<Key />
										<span>Environments</span>
										<ChevronRight className="size-4 transition-transform duration-200 ease-in-out group-data-[state=open]:rotate-90" />
									</SidebarMenuButton>
								</CollapsibleTrigger>
								<AnimatePresence
									key={"envs"}
									presenceAffectsLayout
									mode="sync"
								>
									<CollapsibleContent>
										<SidebarMenuSub>
											<SidebarMenuSubItem>
												<SidebarMenuButton asChild>
													<motion.div
														initial={{
															opacity: 0,
															x: -10,
														}}
														animate={{
															opacity: 1,
															x: 0,
														}}
														exit={{
															opacity: 0,
															x: -10,
														}}
														transition={{
															duration: 0.2,
															ease: "linear",
														}}
													>
														<Link
															href={
																"/dashboard/environments"
															}
														>
															All Environments
														</Link>
													</motion.div>
												</SidebarMenuButton>
											</SidebarMenuSubItem>
										</SidebarMenuSub>
									</CollapsibleContent>
								</AnimatePresence>
							</SidebarMenuItem>
						</Collapsible>
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					{bottomsNavigations.map((item) => (
						<SidebarMenuItem key={`nav-bottom-${item.href}`}>
							<SidebarMenuButton
								asChild
								isActive={
									pathname === "/dashboard"
										? item.href === "/dashboard"
										: pathname.startsWith(item.href)
								}
								tooltip={{
									children:
										state === "collapsed" ? (
											<div className="flex flex-col">
												<b className="text-sm">
													{item.title}
												</b>
												<span className="text-xs">
													{item.description}
												</span>
											</div>
										) : (
											item.description
										),
								}}
								className={cn(
									item.destructive &&
										"text-destructive hover:bg-destructive/10 hover:text-destructive-foreground"
								)}
								onSelect={() => {
									item.onClick?.();
								}}
							>
								<Link href={item.href}>
									{item.icon && <item.icon />}
									<span>{item.title}</span>
								</Link>
							</SidebarMenuButton>
						</SidebarMenuItem>
					))}
					{!isMobile && (
						<SidebarMenuItem>
							<SidebarMenuButton
								tooltip={{
									children:
										state === "collapsed" ? (
											<div className="flex flex-col">
												<b className="text-sm font-semibold">
													Collapse/Extend Sidebar
												</b>
												<span className="text-xs">
													Press{" "}
													<kbd className="font-semibold">
														Ctrl
													</kbd>{" "}
													+{" "}
													<kbd className="font-semibold">
														B
													</kbd>{" "}
													to toggle sidebar
												</span>
											</div>
										) : (
											<>
												Press{" "}
												<kbd className="font-semibold">
													Ctrl
												</kbd>{" "}
												+{" "}
												<kbd className="font-semibold">
													B
												</kbd>{" "}
												to toggle sidebar
											</>
										),
								}}
								onClick={toggleSidebar}
							>
								{state === "collapsed" ? (
									<>
										<SidebarOpen />
										Expand
									</>
								) : (
									<>
										<SidebarClose />
										Collapse
									</>
								)}
							</SidebarMenuButton>
						</SidebarMenuItem>
					)}

					<SidebarSeparator className="mx-0" />

					<SidebarMenuItem>
						<SidebarMenuButton
							className={cn(
								"text-destructive hover:bg-destructive/10 hover:text-destructive active:bg-destructive/10 active:text-destructive cursor-pointer"
							)}
							tooltip={{
								children:
									state === "collapsed" ? (
										<div className="flex flex-col">
											<b className="text-sm">Logout</b>
											<span className="text-xs">
												Logout from your account
											</span>
										</div>
									) : (
										"Logout from your account"
									),
							}}
							onClick={() => {
								toast.loading("Logging out...", {
									description: undefined,
									id: "logout",
								});
								authClient
									.signOut()
									.then(() => {
										toast.success(
											"Logged out successfully",
											{
												id: "logout",
											}
										);
										router.refresh();
									})
									.catch((err) => {
										toast.error("Failed to logout", {
											id: "logout",
											description: err.message,
										});
									});
							}}
						>
							<LogOut />
							<span>Logout</span>
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<User />
			</SidebarFooter>
		</Sidebar>
	);
}

function User() {
	const { data, error, isPending } = authClient.useSession();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<SidebarMenuButton
					size={"lg"}
					className="pointer-events-none"
				>
					<Avatar className="border cursor-default select-none group-data-[collapsible=icon]:size-8">
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
					<div className="grid flex-1 text-left text-sm leading-tight">
						<span className="font-semibold truncate">
							{isPending
								? "Loading..."
								: error
								? "Error"
								: data?.user.name ?? "Unknown"}
						</span>
						<span className="text-xs truncate text-muted-foreground">
							{data?.user.email}
						</span>
					</div>
				</SidebarMenuButton>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
