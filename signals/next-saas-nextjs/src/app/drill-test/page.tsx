"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function DrillTestContent() {
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for success/error messages from URL params
    const verified = searchParams.get("verified");
    const message = searchParams.get("message");
    const error = searchParams.get("error");
    const verifiedEmail = searchParams.get("email");

    if (verified && message) {
      setStatus(`✅ ${message}`);
      if (verifiedEmail) {
        setEmail(verifiedEmail);
      }
    } else if (error) {
      setStatus(`❌ Error: ${error}`);
    }
  }, [searchParams]);

  const handleSendMagicLink = async () => {
    setLoading(true);
    setStatus("Sending magic link...");

    try {
      // Test the drill access endpoint
      const response = await fetch("/api/auth/drill-access", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "drill-test",
          action: "send-magic-link",
        }),
      });

      const data = await response.json();

      if (data.success) {
        let message = `✅ ${data.message}`;

        // Show development link if available
        if (data.developmentLink) {
          message += `\n\n🔗 Development Link:\n${data.developmentLink}`;
        }

        setStatus(message);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    setLoading(true);
    setStatus("Creating account...");

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          sendMagicLink: true,
        }),
      });

      const data = await response.json();

      if (data.success) {
        let message = `✅ ${data.message}`;

        // Show development link if available
        if (data.developmentLink) {
          message += `\n\n🔗 Development Link:\n${data.developmentLink}`;
        }

        setStatus(message);
      } else {
        setStatus(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setStatus(`❌ Failed: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold mb-6">Test Email Verification for Drills</h1>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your email"
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSendMagicLink}
              disabled={loading || !email}
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              Send Magic Link
            </button>

            <button
              onClick={handleRegister}
              disabled={loading || !email}
              className="flex-1 bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
            >
              Register & Send
            </button>
          </div>

          {status && (
            <div
              className={`p-4 rounded-md text-sm whitespace-pre-wrap break-all ${
                status.includes("✅")
                  ? "bg-green-50 text-green-800 border border-green-200"
                  : status.includes("❌")
                  ? "bg-red-50 text-red-800 border border-red-200"
                  : "bg-blue-50 text-blue-800 border border-blue-200"
              }`}
            >
              {status}
            </div>
          )}

          <div className="mt-6 p-4 bg-gray-50 rounded-md">
            <h3 className="font-semibold mb-2">How it works:</h3>
            <ol className="text-sm space-y-1 list-decimal list-inside">
              <li>Enter your email above</li>
              <li>Click "Send Magic Link"</li>
              <li>Check your email for the verification link</li>
              <li>Click the link to verify your account</li>
              <li>Access all drills with verified status!</li>
            </ol>
          </div>

          <div className="mt-4 text-xs text-gray-500">
            <p><strong>Note:</strong> Make sure email settings are configured in .env file:</p>
            <code className="block mt-1 p-2 bg-gray-100 rounded">
              EMAIL_SERVER_HOST, EMAIL_SERVER_USER, EMAIL_SERVER_PASSWORD
            </code>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function DrillTestPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 p-8 flex items-center justify-center">Loading...</div>}>
      <DrillTestContent />
    </Suspense>
  );
}