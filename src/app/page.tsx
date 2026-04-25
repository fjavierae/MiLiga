import { AuthenticationImage } from "./components/auth/AuthenticationImage";
import { getSession } from "@/lib/auth";
import { UserRole } from "@/types";
import { redirect } from "next/navigation";


interface LoginPageProps {
  readonly searchParams?: Promise<Record<string, string | string[] | undefined>>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const session = await getSession();

  if (session?.role === UserRole.ADMIN) {
    redirect("/admin/dashboard");
  }

  if (session?.role === UserRole.MANAGER) {
    redirect("/manager/team");
  }

  if (session?.role === UserRole.PLAYER) {
    redirect("/player/dashboard");
  }

  const resolvedSearchParams = searchParams ? await searchParams : undefined;
  const errorParam = resolvedSearchParams?.error;
  const errorMessage = Array.isArray(errorParam) ? errorParam[0] : errorParam;

  return (
    <AuthenticationImage errorMessage={errorMessage} />
  );
}
