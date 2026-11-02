import { Suspense } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import LoginForm from "@/components/auth/LoginForm";
import RedirectIfAuthed from "@/components/auth/RedirectIfAuthed";

export const metadata = { title: "Login" };

export default function LoginPage() {
  return (
    <AuthShell
      title="Welcome back"
      subtitle="Sign in to join events, create your own drives and manage what you have pledged to."
    >
      <RedirectIfAuthed />
      <Suspense fallback={<div className="skeleton-tint h-72 w-full rounded-2xl" />}>
        <LoginForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-base-content/70">
        New to Shongkolpo?{" "}
        <Link href="/register" className="link font-semibold text-primary">
          Create an account
        </Link>
      </p>
    </AuthShell>
  );
}
