import { faker } from "@faker-js/faker";
import { createHash } from "node:crypto";
import { db } from "~/lib/db";
import * as model from "~/model";

export function mockBetterAuthUserId(seed: string = "himitsu"): string {
	// The alphabet appears to include uppercase, lowercase letters and numbers
	const alphabet =
		"abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

	// Create a deterministic hash based on the seed and counter
	// SHA-256 produces more than enough bytes for our needs
	const hash = createHash("sha256").update(seed).digest("hex");

	// Generate a 32-character ID by mapping hash segments to our alphabet
	let userId = "";
	for (let j = 0; j < 32; j++) {
		// Take 2 characters from the hash at a time to get a larger number
		const index =
			parseInt(
				hash.substring(
					(j * 2) % hash.length,
					(j * 2 + 2) % hash.length
				),
				16
			) % alphabet.length;
		userId += alphabet[index];
	}

	return userId;
}

const keys: (typeof model.keyAccessModel.$inferInsert)[] = [
	{
		key: "TestKey1",
		description: "For public test",
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
	},
	{
		key: "TestKey2",
		description: "Company test",
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
	},
];
const folders: (typeof model.environmentFolderModel.$inferInsert)[] = [
	{
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		color: faker.helpers.arrayElement([true, false])
			? faker.color.rgb()
			: null,
		privacy: faker.helpers.arrayElement(["public", "private"]),
	},
	{
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		color: faker.helpers.arrayElement([true, false])
			? faker.color.rgb()
			: null,
		privacy: faker.helpers.arrayElement(["public", "private"]),
	},
	{
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		color: faker.helpers.arrayElement([true, false])
			? faker.color.rgb()
			: null,
		privacy: faker.helpers.arrayElement(["public", "private"]),
	},
	{
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		color: faker.helpers.arrayElement([true, false])
			? faker.color.rgb()
			: null,
		privacy: faker.helpers.arrayElement(["public", "private"]),
	},
	{
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		color: faker.helpers.arrayElement([true, false])
			? faker.color.rgb()
			: null,
		privacy: faker.helpers.arrayElement(["public", "private"]),
	},
];
const envs: (typeof model.environmentModel.$inferInsert)[] = [
	{
		content: [
			{
				key: "TEST_KEY",
				label: "Test Key",
				description: "Test Key Description",
				encryptedValue: "encrypted_value",
			},
			{
				key: "TEST_KEY_2",
				label: "Test Key 2",
				description: "Test Key 2 Description",
				encryptedValue: "encrypted_value_2",
			},
		],
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		privacy: faker.helpers.arrayElement(["public", "private"]),
		description: faker.helpers.arrayElement([true, false])
			? faker.lorem.sentence({ min: 5, max: 10 })
			: undefined,
	},
	{
		content: [
			{
				key: "TEST_KEY",
				label: "Test Key",
				description: "Test Key Description",
				encryptedValue: "encrypted_value",
			},
			{
				key: "TEST_KEY_2",
				label: "Test Key 2",
				description: "Test Key 2 Description",
				encryptedValue: "encrypted_value_2",
			},
		],
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		privacy: faker.helpers.arrayElement(["public", "private"]),
		description: faker.helpers.arrayElement([true, false])
			? faker.lorem.sentence({ min: 5, max: 10 })
			: undefined,
	},
	{
		content: [
			{
				key: "TEST_KEY",
				label: "Test Key",
				description: "Test Key Description",
				encryptedValue: "encrypted_value",
			},
			{
				key: "TEST_KEY_2",
				label: "Test Key 2",
				description: "Test Key 2 Description",
				encryptedValue: "encrypted_value_2",
			},
		],
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		privacy: faker.helpers.arrayElement(["public", "private"]),
		description: faker.helpers.arrayElement([true, false])
			? faker.lorem.sentence({ min: 5, max: 10 })
			: undefined,
	},
	{
		content: [
			{
				key: "TEST_KEY",
				label: "Test Key",
				description: "Test Key Description",
				encryptedValue: "encrypted_value",
			},
			{
				key: "TEST_KEY_2",
				label: "Test Key 2",
				description: "Test Key 2 Description",
				encryptedValue: "encrypted_value_2",
			},
		],
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		privacy: faker.helpers.arrayElement(["public", "private"]),
		description: faker.helpers.arrayElement([true, false])
			? faker.lorem.sentence({ min: 5, max: 10 })
			: undefined,
	},
	{
		content: [
			{
				key: "TEST_KEY",
				label: "Test Key",
				description: "Test Key Description",
				encryptedValue: "encrypted_value",
			},
			{
				key: "TEST_KEY_2",
				label: "Test Key 2",
				description: "Test Key 2 Description",
				encryptedValue: "encrypted_value_2",
			},
		],
		name: faker.lorem.words({ min: 1, max: 2 }),
		userId: "ZyLDPawYhIRZygoVOVQvyRCn4WIfrhbr",
		privacy: faker.helpers.arrayElement(["public", "private"]),
		description: faker.helpers.arrayElement([true, false])
			? faker.lorem.sentence({ min: 5, max: 10 })
			: undefined,
	},
];

async function main() {
	console.log("Seeding database...");
	await db.transaction(async (tx) => {
		console.log("Deleting existing data...");
		await tx.delete(model.environmentFolderModel).all();
		await tx.delete(model.environmentModel).all();
		await tx.delete(model.keyAccessModel).all();

		console.log("Inserting key access...");
		await tx.insert(model.keyAccessModel).values(keys).run();
		console.log("Inserting environment folders...");
		await tx.insert(model.environmentFolderModel).values(folders).run();
		console.log("Inserting environments...");
		await tx.insert(model.environmentModel).values(envs).run();
	});
}

main();
