"use client";

import { useQuery } from "@tanstack/react-query";
import {
	ChevronDown,
	Folder,
	FolderOpen,
	FolderPlus,
	Grid2X2,
	Key,
	LaptopMinimal,
	LayoutDashboard,
	LoaderCircle,
	Lock,
	LogOut,
	Moon,
	Plus,
	RefreshCw,
	Search,
	Settings,
	ShieldPlus,
	Sun,
	X,
	type LucideProps,
} from "lucide-react";
import { useTheme } from "next-themes";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import {
	Collapsible,
	CollapsibleContent,
	CollapsibleTrigger,
} from "~/components/ui/collapsible";
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { Input } from "~/components/ui/input";
import { ScrollArea } from "~/components/ui/scroll-area";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
	SidebarSeparator,
	useSidebar,
} from "~/components/ui/sidebar";
import { API_URL } from "~/constant";
import { fetchAllEnvironments } from "~/data/environments";
import { useShortcut } from "~/hooks/use-shortcut";
import { authClient } from "~/lib/auth.client";
import { apiURLBuilder, cn } from "~/lib/utils";

const IconMenus: {
	key: string;
	name: string;
	href: string;
	icon: React.ComponentType<LucideProps>;
}[] = [
	{
		key: "dashboard",
		name: "Dashboard",
		href: "/dashboard",
		icon: LayoutDashboard,
	},
	{
		key: "access",
		name: "Manage Access",
		href: "/dashboard/access",
		icon: Lock,
	},
	{
		key: "settings",
		name: "Settings",
		href: "/dashboard/settings",
		icon: Settings,
	},
] as const;

export default function AppSidebar({
	...props
}: React.ComponentProps<typeof Sidebar>) {
	return (
		<Sidebar
			collapsible="icon"
			className="overflow-hidden [&>[data-sidebar=sidebar]]:flex-row"
			style={
				{
					"--sidebar-width": "20rem",
				} as React.CSSProperties
			}
			{...props}
		>
			{/* Icon sidebar */}
			<IconSidebar />

			<MainSidebar />
		</Sidebar>
	);
}

function IconSidebar() {
	const pathname = usePathname();
	const { theme, setTheme } = useTheme();
	const [themePending, startThemeTransition] = React.useTransition();
	const { toggleSidebar, state } = useSidebar();
	const [mounted, setMounted] = React.useState(false);

	React.useEffect(() => {
		setMounted(true);
	}, []);

	const handleThemeChange = React.useCallback(
		(newTheme: string) => {
			startThemeTransition(() => {
				setTheme(newTheme);
			});
		},
		[setTheme]
	);
	return (
		<Sidebar
			collapsible="none"
			className="!w-[calc(var(--sidebar-width-icon)_+_1px)] border-r"
		>
			<SidebarHeader>
				<SidebarMenu>
					<SidebarMenuItem>
						<div className="aspect-square rounded-full grid place-items-center text-primary">
							<Key className="!size-6 absolute" />
						</div>
					</SidebarMenuItem>
				</SidebarMenu>
			</SidebarHeader>

			<SidebarContent>
				<SidebarGroup>
					<SidebarMenu>
						<SidebarMenuItem>
							<SidebarMenuButton
								onClick={toggleSidebar}
								className="grid place-items-center relative"
								tooltip={
									state === "collapsed"
										? "Expand Sidebar"
										: "Collapse Sidebar"
								}
							>
								<Grid2X2
									className={cn(
										"transition duration-500 ease-in-out rotate-45 absolute",
										state === "collapsed"
											? "fill-sidebar-foreground"
											: "fill-primary"
									)}
								/>
								<Grid2X2 className="rotate-45 absolute text-sidebar" />
							</SidebarMenuButton>
						</SidebarMenuItem>
					</SidebarMenu>

					<SidebarSeparator className="mx-0 my-2" />

					<SidebarMenu>
						{IconMenus.map((menu) => (
							<SidebarMenuItem key={menu.key}>
								<SidebarMenuButton
									tooltip={menu.name}
									className="grid place-items-center"
									isActive={
										menu.href === "/dashboard"
											? pathname === "/dashboard"
											: pathname.startsWith(menu.href)
									}
									asChild
								>
									<Link href={menu.href}>
										<menu.icon />
									</Link>
								</SidebarMenuButton>
							</SidebarMenuItem>
						))}
					</SidebarMenu>
				</SidebarGroup>
			</SidebarContent>

			<SidebarFooter>
				<SidebarMenu>
					<DropdownMenu>
						<SidebarMenuItem>
							<DropdownMenuTrigger asChild>
								<SidebarMenuButton tooltip={"Toggle Theme"}>
									{!mounted ? (
										<LoaderCircle className="animate-spin" />
									) : themePending ? (
										<LoaderCircle className="animate-spin" />
									) : theme === "light" ? (
										<Sun />
									) : theme === "dark" ? (
										<Moon />
									) : (
										<LaptopMinimal />
									)}
									Toggle Theme
								</SidebarMenuButton>
							</DropdownMenuTrigger>
						</SidebarMenuItem>
						<DropdownMenuContent
							side="right"
							align="end"
						>
							<DropdownMenuCheckboxItem
								disabled={themePending}
								checked={theme === "light"}
								onCheckedChange={() => {
									handleThemeChange("light");
								}}
							>
								{themePending ? (
									<LoaderCircle className="animate-spin" />
								) : (
									<Sun />
								)}
								Light
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								disabled={themePending}
								checked={theme === "dark"}
								onCheckedChange={() => {
									handleThemeChange("dark");
								}}
							>
								{themePending ? (
									<LoaderCircle className="animate-spin" />
								) : (
									<Moon />
								)}
								Dark
							</DropdownMenuCheckboxItem>
							<DropdownMenuCheckboxItem
								disabled={themePending}
								checked={theme === "system"}
								onCheckedChange={() => {
									handleThemeChange("system");
								}}
							>
								{themePending ? (
									<LoaderCircle className="animate-spin" />
								) : (
									<LaptopMinimal />
								)}
								System
							</DropdownMenuCheckboxItem>
						</DropdownMenuContent>
					</DropdownMenu>
					<SidebarMenuItem>
						<SidebarMenuButton
							tooltip={"Log Out"}
							className="text-destructive hover:bg-destructive/10 hover:text-destructive active:bg-destructive/10 active:text-destructive"
						>
							<LogOut />
							Log Out
						</SidebarMenuButton>
					</SidebarMenuItem>
				</SidebarMenu>
				<User />
			</SidebarFooter>
		</Sidebar>
	);
}

function MainSidebar() {
	const [searchQuery, setSearchQuery] = React.useState<string>("");
	const { data, refetch, error, isError, isPending, isRefetching } = useQuery(
		{
			queryKey: ["environments", searchQuery],
			queryFn: () =>
				fetchAllEnvironments(
					apiURLBuilder(API_URL.env, {
						search: searchQuery,
					})
				),
		}
	);

	return (
		<Sidebar
			collapsible="none"
			className="hidden flex-1 md:flex"
		>
			<SidebarHeader className="px-0">
				<Searchbar
					value={searchQuery}
					onValueChange={(value) => {
						setSearchQuery(value);
					}}
				/>
			</SidebarHeader>

			<SidebarSeparator className="mx-0" />

			<SidebarContent className="overflow-y-hidden">
				<SidebarGroup className="py-0 px-0">
					<SidebarMenu className="p-2">
						<SidebarMenuItem className="items-center justify-between gap-2 flex text-muted-foreground ">
							<span className="text-xs font-semibold select-none">
								Environments
							</span>

							<div className="items-center gap-2">
								<Button
									size={"icon"}
									variant={"ghost"}
									className="w-6 h-6 p-0"
									onClick={() =>
										refetch()
											.then(() => {
												toast.success(
													"Success refetching data"
												);
											})
											.catch((err) => {
												toast.error(
													"Failed when refetching data",
													{
														description:
															"Check console for error details",
													}
												);
												console.error(err);
											})
									}
									disabled={isRefetching}
									loadingText=""
								>
									<RefreshCw
										className={cn(
											isRefetching && "animate-spin"
										)}
									/>
								</Button>
							</div>
						</SidebarMenuItem>
					</SidebarMenu>

					<ScrollArea
						className="w-full h-fit my-auto pr-4 "
						scrollMaskClassName="from-sidebar h-10 via-sidebar/60"
						type="scroll"
					>
						<div
							className={cn(
								"h-[calc(100svh-7rem-3rem)] space-y-1 py-3 px-0",
								isRefetching && "animate-pulse"
							)}
						>
							{isPending ? (
								<div className="h-full flex items-center justify-center flex-col gap-2">
									<LoaderCircle className="animate-spin text-primary" />
								</div>
							) : isError ? (
								<div className="h-full flex items-center justify-center flex-col gap-2">
									<p className="text-destructive text-center text-sm">
										{error.message ??
											"Something went wrong while fetching environments"}
									</p>
									<Button
										size={"sm"}
										variant={"secondary"}
										loading={isRefetching}
										onClick={() => refetch()}
									>
										<RefreshCw />
										Refresh
									</Button>
								</div>
							) : false &&
							  data?.folders.length === 0 &&
							  data?.envs.length === 0 ? (
								<div className="h-full flex items-center justify-center select-none">
									{searchQuery ? (
										<p className="text-muted-foreground text-center text-sm">
											No environments found for{" "}
											<span className="font-semibold">
												{searchQuery}
											</span>
										</p>
									) : (
										<p className="text-muted-foreground text-center text-sm">
											You have no environments yet.
											<br />
											Create one to get started.
										</p>
									)}
								</div>
							) : (
								<>
									{Array.from({ length: 10 }).map((_, i) => (
										<FolderItems
											key={`folder-${i}`}
											open={false}
											onOpenChange={() => {}}
										/>
									))}
									<SidebarMenu>
										{data.envs.map((item) => (
											<Item key={item.id} />
										))}
									</SidebarMenu>
								</>
							)}
						</div>
					</ScrollArea>
				</SidebarGroup>
			</SidebarContent>

			<SidebarSeparator className="mx-0" />

			<SidebarFooter className="p-0">
				<NewButton />
			</SidebarFooter>
		</Sidebar>
	);
}

function User() {
	const { data, error, isPending } = authClient.useSession();

	return (
		<SidebarMenu>
			<SidebarMenuItem>
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
								{data?.user.name.charAt(0).toUpperCase() ?? "?"}
							</span>
						)}
					</AvatarFallback>
				</Avatar>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}

function Searchbar({
	value,
	onValueChange,
	debounceDuration = 500,
}: {
	value: string;
	onValueChange: (value: string) => void;
	debounceDuration?: number;
}) {
	const [debouncedValue, setDebouncedValue] = React.useState<string>(value);
	const inputRef = React.useRef<HTMLInputElement>(null);

	useShortcut(
		{
			key: "s",
			altKey: true,
		},
		() => {
			if (inputRef.current) {
				inputRef.current.focus();
			}
		}
	);
	React.useEffect(() => {
		if (!debouncedValue) {
			onValueChange("");
			return;
		}
		const handler = setTimeout(() => {
			onValueChange(debouncedValue);
		}, debounceDuration);

		return () => {
			clearTimeout(handler);
		};
	}, [debouncedValue, debounceDuration, onValueChange]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<Input
					ref={inputRef}
					size={"lg"}
					prefix={<Search className="text-muted-foreground" />}
					placeholder={`Search...`}
					suffix={<kbd className="text-xs">Alt+S</kbd>}
					wrapperProps={{
						className: "gap-2 border-0 bg-sidebar",
					}}
					value={debouncedValue}
					onValueChange={setDebouncedValue}
				/>
			</SidebarMenuItem>
		</SidebarMenu>
	);
}
function NewButton() {
	const [isOpen, setIsOpen] = React.useState(false);
	const router = useRouter();
	useShortcut(
		{
			key: "a",
			altKey: true,
		},
		() => {
			setIsOpen(true);
		}
	);

	return (
		<DropdownMenu
			open={isOpen}
			onOpenChange={setIsOpen}
		>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton
							className="font-semibold rounded-none"
							size={"lg"}
						>
							<Plus />
							New Environment
							<ChevronDown className="opacity-50 group-data-[state=open]:rotate-90 transition ml-auto" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
				</SidebarMenuItem>
			</SidebarMenu>
			<DropdownMenuContent className="w-(--radix-dropdown-menu-trigger-width)">
				<DropdownMenuItem
					onSelect={() => {
						router.push("/dashboard/environments/create");
					}}
				>
					<ShieldPlus />
					New Environment
				</DropdownMenuItem>
				<DropdownMenuItem
					onSelect={() => {
						router.push("/dashboard/environments/create-folder");
					}}
				>
					<FolderPlus />
					New Folder
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

function FolderItems({
	open,
	onOpenChange,
}: {
	open?: boolean;
	onOpenChange?: (open: boolean) => void;
}) {
	const [isOpen, setIsOpen] = React.useState<boolean>(open ?? false);
	const [pending, startTransition] = React.useTransition();

	const handleOpenChange = React.useCallback(
		(open: boolean) => {
			startTransition(() => {
				setIsOpen(open);
				onOpenChange?.(open);
			});
		},
		[onOpenChange]
	);

	return (
		<Collapsible
			className={cn("group/collapsible", pending && "animate-pulse")}
			open={isOpen}
			onOpenChange={handleOpenChange}
			disabled={pending}
			asChild
		>
			<SidebarMenu>
				<SidebarMenuItem>
					<CollapsibleTrigger
						asChild
						className="grow-0"
					>
						<SidebarMenuButton title="Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit">
							{isOpen ? (
								<FolderOpen className="text-muted-foreground" />
							) : (
								<Folder className="text-muted-foreground" />
							)}
							<span className="font-semibold truncate break-all whitespace-pre-wrap line-clamp-1">
								Lorem Ipsum Dolor Sit Amet Consectetur
								Adipiscing Elit
							</span>
							<ChevronDown className="opacity-50 group-data-[state=open]/collapsible:-rotate-180 transition ml-auto" />
						</SidebarMenuButton>
					</CollapsibleTrigger>

					<CollapsibleContent>
						<SidebarMenuSub>
							{Array.from({ length: 3 }).map((_, i) => (
								<Item
									key={`sub-item-${i}`}
									sub
								/>
							))}
						</SidebarMenuSub>
					</CollapsibleContent>
				</SidebarMenuItem>
			</SidebarMenu>
		</Collapsible>
	);
}

function Item({ sub }: { sub?: boolean }) {
	const MenuItem = React.useMemo(
		() => (sub ? SidebarMenuSubItem : SidebarMenuItem),
		[sub]
	);
	const MenuButton = React.useMemo(
		() => (sub ? SidebarMenuSubButton : SidebarMenuButton),
		[sub]
	);

	return (
		<MenuItem>
			<MenuButton asChild>
				<Link href={"/dashboard/environments/1"}>
					<p className="truncate break-all whitespace-pre-wrap line-clamp-1">
						Lorem Ipsum Dolor Sit Amet Consectetur Adipiscing Elit
					</p>
				</Link>
			</MenuButton>
		</MenuItem>
	);
}