"use client";
import { Suspense, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/loading";

const VerifyEmailForm = dynamic(
  () => import("@/components/auth/VerifyEmailForm"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

const EmailVerificationContent = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams?.get("email") ?? null;

  useEffect(() => {
    if (!email) {
      router.replace("/auth/login");
    }
  }, [email, router]);

  if (!email) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <VerifyEmailForm email={email} />
    </div>
  );
};

export default function VerifyEmailPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Suspense fallback={<LoadingSpinner />}>
        <EmailVerificationContent />
      </Suspense>
    </main>
  );
}
