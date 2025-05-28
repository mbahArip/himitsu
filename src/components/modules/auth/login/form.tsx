"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Turnstile } from "@marsidev/react-turnstile";
import { LogIn } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { validateCaptchaAction } from "~/actions/captcha";
import { Button } from "~/components/ui/button";
import { CardContent, CardFooter } from "~/components/ui/card";
import { Checkbox } from "~/components/ui/checkbox";
import {
	Form,
	FormControl,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { clientEnv } from "~/env/client";
import { authClient } from "~/lib/auth.client";
import { LoginSchema } from "~/types/schema";

export function LoginForm() {
	const router = useRouter();
	const form = useForm<z.infer<typeof LoginSchema>>({
		resolver: zodResolver(LoginSchema),
		defaultValues: {
			email: "",
			password: "",
			remember: false,
			"cf-turnstile": "",
		},
	});

	const onSubmit = async (data: z.infer<typeof LoginSchema>) => {
		const captchaValidation = await validateCaptchaAction({
			"cf-turnstile": data["cf-turnstile"],
		});
		if (
			captchaValidation?.serverError ||
			captchaValidation?.validationErrors
		) {
			form.setError("cf-turnstile", {
				message:
					captchaValidation.serverError ??
					captchaValidation.validationErrors?.["cf-turnstile"]
						?._errors?.[0] ??
					"Captcha validation failed",
			});
			toast.error("Failed to login", {
				description: "Captcha validation failed",
			});
			return;
		}

		const { error } = await authClient.signIn.email({
			email: data.email,
			password: data.password,
			rememberMe: data.remember,
		});
		if (error) {
			form.setError("email", { message: error.message });
			toast.error("Failed to login", {
				description: error.message,
			});
			return;
		}

		toast.success("Login successful", {
			description: "Please wait while we redirect you to the dashboard",
		});
		router.push("/dashboard");
	};

	return (
		<Form {...form}>
			<form
				onSubmit={form.handleSubmit(onSubmit)}
				className="space-y-4"
			>
				<CardContent className="grid gap-4">
					<FormField
						control={form.control}
						name="email"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="email">Email</FormLabel>
								<FormControl>
									<Input
										placeholder="gitgud@acme.com"
										{...field}
										type="email"
										tabIndex={1}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="password"
						render={({ field }) => (
							<FormItem>
								<FormLabel htmlFor="password">
									Password
								</FormLabel>
								<FormControl>
									<Input
										placeholder="********"
										{...field}
										type="password"
										tabIndex={2}
									/>
								</FormControl>
								<FormMessage />
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="remember"
						render={({ field }) => (
							<FormItem className="flex items-center">
								<FormControl>
									<Checkbox
										ref={field.ref}
										id={field.name}
										name={field.name}
										checked={field.value}
										onCheckedChange={field.onChange}
										disabled={field.disabled}
										onBlur={field.onBlur}
										tabIndex={3}
									/>
								</FormControl>
								<FormLabel htmlFor="remember">
									Remember me
								</FormLabel>
							</FormItem>
						)}
					/>
					<FormField
						control={form.control}
						name="cf-turnstile"
						render={({ field }) => (
							<FormItem>
								<FormControl>
									<Turnstile
										tabIndex={-1}
										siteKey={
											clientEnv.NEXT_PUBLIC_TURNSTILE_SITE_KEY
										}
										options={{
											responseFieldName: field.name,
											size: "flexible",
										}}
										onBlur={field.onBlur}
										onSuccess={field.onChange}
										onExpire={() =>
											form.setError("cf-turnstile", {
												message: "Captcha expired",
											})
										}
										onTimeout={() =>
											form.setError("cf-turnstile", {
												message: "Captcha timed out",
											})
										}
										onError={(error) =>
											form.setError("cf-turnstile", {
												message: error,
											})
										}
									/>
								</FormControl>
							</FormItem>
						)}
					/>
				</CardContent>
				<CardFooter className="flex flex-col gap-2">
					<Button
						type="submit"
						className="w-full"
						loading={form.formState.isSubmitting}
						tabIndex={4}
					>
						<LogIn />
						Login
					</Button>
					<Button
						onClick={async () => {
							if (
								!form.getValues("email") ||
								!form.getValues("password")
							) {
								toast.error("Please fill in all fields");
								return;
							}

							await authClient.signUp
								.email({
									name: "Super Admin",
									email: form.getValues("email"),
									password: form.getValues("password"),
								})
								.catch((error) => {
									toast.error("Failed to register", {
										description: error.message,
									});
								});

							toast.success("Registration successful");
						}}
					>
						Register
					</Button>
				</CardFooter>
			</form>
		</Form>
	);
}
