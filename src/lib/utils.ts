import { clsx, type ClassValue } from "clsx";
import { customAlphabet } from 'nanoid';
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Generate a nanoid string of a given length and characters.
 * @param options - Options for generating the nanoid.
 * @param options.length - The length of the generated nanoid. Default is 24.
 * @param options.characters - The characters to use for generating the nanoid. Default is alphanumeric characters.
 * @returns A string representing the generated nanoid.
 */
export function generateNanoId({
  length = 24,
  characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz",
} = {}): string {
  return customAlphabet(characters, length)();
}

export function apiURLBuilder(
	baseUrl: string | URL,
	searchParams: Record<string, unknown>
) {
	const url = new URL(baseUrl, "http://localhost:3000");
	Object.entries(searchParams).forEach(([key, value]) => {
		if (value) {
			url.searchParams.append(key, String(value));
		}
	});
	return url.toString();
}