import { auth } from "~/lib/auth";

async function main() {
	console.log("Seeding database...");
	await auth.api.createUser({
		body: {
			email: "admin@localhost.com",
			password: "admin123",
			name: "Super Admin",
			role: "admin",
			data: {
				emailVerified: true,
			},
		},
	});
}

main();
