import { LoginForm } from "~/components/modules/auth/login/form";
import { LoginThemeSwitch } from "~/components/modules/auth/login/theme-switch";
import { Card, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";

export default function LoginPage() {
  return (
    <div className="relative w-full min-h-screen grid place-items-center">
      <LoginThemeSwitch />
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>Login to your account to manage your secrets.</CardDescription>
        </CardHeader>
        <LoginForm />
      </Card>
    </div>
  );
}