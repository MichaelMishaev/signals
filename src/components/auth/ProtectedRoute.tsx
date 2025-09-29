"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireVerified?: boolean;
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  requireVerified = false,
  redirectTo = "/auth/signin",
}: ProtectedRouteProps) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;

    if (!session) {
      router.push(redirectTo);
    } else if (requireVerified && !session.user.emailVerified) {
      router.push("/auth/verify-email");
    }
  }, [session, status, router, redirectTo, requireVerified]);

  if (status === "loading") {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (requireVerified && !session.user.emailVerified) {
    return null;
  }

  return <>{children}</>;
}