import { Suspense } from "react";
import Link from "next/link";
import AuthShell from "@/components/auth/AuthShell";
import RegisterForm from "@/components/auth/RegisterForm";
import RedirectIfAuthed from "@/components/auth/RedirectIfAuthed";

export const metadata = { title: "Create account" };

export default function RegisterPage() {
  return (
    <AuthShell
      title="Join the pledge"
      subtitle="Create an account to organise drives in your neighbourhood and join the ones already scheduled."
      side={{
        heading: "Every drive starts with one person saying yes.",
        body: "Create a profile, post the date and place, and let your neighbours find it. Shongkolpo keeps the list, so you can keep the promise.",
        points: [
          "Free for organisers and volunteers",
          "Your events stay editable, always",
          "Email, Google or GitHub sign-in",
        ],
      }}
    >
      <RedirectIfAuthed />
      <Suspense fallback={<div className="skeleton-tint h-[26rem] w-full rounded-2xl" />}>
        <RegisterForm />
      </Suspense>

      <p className="mt-6 text-center text-sm text-base-content/70">
        Already have an account?{" "}
        <Link href="/login" className="link font-semibold text-primary">
          Sign in
        </Link>
      </p>
    </AuthShell>
  );
}
