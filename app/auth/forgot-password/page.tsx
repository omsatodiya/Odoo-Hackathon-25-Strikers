"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import LoadingSpinner from "@/components/ui/loading";

const ForgotPasswordForm = dynamic(
  () => import("@/components/auth/ForgotPasswordForm"),
  {
    ssr: false,
    loading: () => <LoadingSpinner />,
  }
);

export default function ForgotPassword() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Suspense fallback={<LoadingSpinner />}>
        <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <ForgotPasswordForm />
        </div>
      </Suspense>
    </main>
  );
}
