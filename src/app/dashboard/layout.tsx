import { headers } from "next/headers";
import { redirect } from "next/navigation";
import AppHeader from "~/components/modules/dashboard/app-header";
import AppSidebar from "~/components/modules/dashboard/app-sidebar";
import { SidebarInset, SidebarProvider } from "~/components/ui/sidebar";
import { auth } from "~/lib/auth";

export default async function DashboardLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const session = await auth.api
		.getSession({
			headers: await headers(),
		})
		.catch(() => null);
	if (!session) redirect("/login");

	// const $env = db.query.environmentModel.findMany({
	// 	columns: {
	// 		id: true,
	// 		name: true,
	// 		description: true,
	// 		privacy: true,
	// 		createdAt: true,
	// 		updatedAt: true,
	// 	},
	// 	where: (self, f) =>
	// 		f.and(f.eq(self.userId, session.user.id), f.isNull(self.folderId)),
	// 	orderBy: (self, f) => f.asc(self.name),
	// });
	// const $folder = db.query.environmentFolderModel.findMany({
	// 	columns: {
	// 		id: true,
	// 		name: true,
	// 		color: true,
	// 		createdAt: true,
	// 		updatedAt: true,
	// 	},
	// 	where: (self, f) => f.and(f.eq(self.userId, session.user.id)),
	// 	orderBy: (self, f) => f.asc(self.name),
	// 	with: {
	// 		envs: {
	// 			columns: {
	// 				id: true,
	// 				name: true,
	// 				description: true,
	// 				privacy: true,
	// 				createdAt: true,
	// 				updatedAt: true,
	// 			},
	// 		},
	// 	},
	// });
	// const [folders, envs] = await Promise.all([$folder, $env]);

	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<AppHeader />
				<div className="[&>*[data-container]]:mx-auto [&>*[data-container]]:container min-h-screen p-6 has-[[data-no-padding]]:p-0 has-[[data-no-padding]]:[&>div[data-content]]:p-6">
					{children}
				</div>
			</SidebarInset>
		</SidebarProvider>
	);
}
