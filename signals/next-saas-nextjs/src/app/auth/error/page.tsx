"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export const dynamic = 'force-dynamic';

const errorMessages: Record<string, { title: string; description: string; action: string }> = {
  DatabaseError: {
    title: "Database Connection Error",
    description: "We're experiencing technical difficulties. Please try again in a few moments.",
    action: "Try Again"
  },
  InvalidToken: {
    title: "Invalid Verification Link",
    description: "This verification link is invalid. Please request a new verification email.",
    action: "Get New Link"
  },
  ExpiredToken: {
    title: "Verification Link Expired",
    description: "This verification link has expired. Links are valid for 10 minutes. Please request a new one.",
    action: "Get New Link"
  },
  VerificationFailed: {
    title: "Verification Failed",
    description: "We couldn't verify your email. Please try again or contact support if the problem persists.",
    action: "Try Again"
  },
  Default: {
    title: "Verification Error",
    description: "Something went wrong during verification. Please try again.",
    action: "Try Again"
  }
};

function ErrorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const errorCode = searchParams?.get("error") || "Default";
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const errorInfo = errorMessages[errorCode] || errorMessages.Default;

  const handleResendLink = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setMessage("❌ Please enter your email address");
      return;
    }

    setIsLoading(true);
    setMessage("");

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, type: "magic-link" }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage("✅ New verification link sent! Check your email.");
      } else {
        setMessage("❌ " + (data.error || "Failed to send verification link"));
      }
    } catch (error) {
      setMessage("❌ Failed to send verification link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="rounded-full bg-red-100 p-3">
            <svg
              className="h-12 w-12 text-red-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
              />
            </svg>
          </div>
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          {errorInfo.title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 px-4">
          {errorInfo.description}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {(errorCode === "InvalidToken" || errorCode === "ExpiredToken" || errorCode === "VerificationFailed") && (
            <form onSubmit={handleResendLink} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    placeholder="Enter your email"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isLoading ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </span>
                  ) : (
                    <span>{errorInfo.action}</span>
                  )}
                </button>
              </div>

              {message && (
                <div className={`text-sm text-center p-3 rounded-md ${
                  message.includes("✅")
                    ? "bg-green-50 text-green-800 border border-green-200"
                    : "bg-red-50 text-red-800 border border-red-200"
                }`}>
                  {message}
                </div>
              )}
            </form>
          )}

          {errorCode === "DatabaseError" && (
            <div className="space-y-6">
              <div className="text-center">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  {errorInfo.action}
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-gray-200 pt-6">
            <div className="text-center space-y-3">
              <p className="text-sm text-gray-600">
                <button
                  onClick={() => router.push("/auth/signin")}
                  className="text-blue-600 hover:text-blue-500 font-medium"
                >
                  ← Back to Sign In
                </button>
              </p>
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <a href="/auth/register" className="text-blue-600 hover:text-blue-500 font-medium">
                  Sign up
                </a>
              </p>
              <p className="text-xs text-gray-500 mt-4">
                Need help? Contact support or check your spam folder for the verification email.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function AuthErrorPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    }>
      <ErrorContent />
    </Suspense>
  );
}
