import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { redirect } from "next/navigation";

// Server-side authentication check
export async function requireAuth() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return session;
}

// Check if user is authenticated (doesn't redirect)
export async function getSession() {
  return await getServerSession(authOptions);
}

// Check if user email is verified
export async function requireVerifiedEmail() {
  const session = await requireAuth();

  if (!session.user.emailVerified) {
    redirect("/auth/verify-email");
  }

  return session;
}

// Get current user ID
export async function getCurrentUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user?.id || null;
}