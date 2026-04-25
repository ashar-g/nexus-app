"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-2xl border border-gray-200 bg-white shadow-sm p-8 text-center">
          <h1 className="text-2xl font-semibold tracking-tight">Loading Dashboard</h1>
          <p className="mt-3 text-sm text-gray-600">Please wait while we verify your session.</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-white text-black flex items-center justify-center px-6">
        <div className="w-full max-w-md rounded-3xl border border-gray-200 bg-white shadow-md p-8">
          <div className="mb-6">
            <p className="text-sm font-medium text-blue-600">Nexus App</p>
            <h1 className="mt-2 text-3xl font-bold tracking-tight">Secure Dashboard Access</h1>
            <p className="mt-3 text-gray-600 leading-relaxed">
              Sign in using your Okta account to access your protected application dashboard.
            </p>
          </div>

          <button
            onClick={() => signIn("okta")}
            className="w-full rounded-xl bg-blue-600 px-5 py-3 text-white font-medium transition hover:bg-blue-700"
          >
            Login with Okta
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white text-black px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm font-medium text-blue-600">Nexus App</p>
            <h1 className="text-4xl font-bold tracking-tight">Dashboard</h1>
            <p className="mt-2 text-gray-600">
              Welcome back, {session.user?.name || session.user?.email || "User"}
            </p>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: "/" })}
            className="rounded-xl border border-gray-300 px-5 py-3 font-medium hover:bg-gray-50"
          >
            Sign Out
          </button>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-3 text-sm text-gray-600">Signed in user details from Okta session.</p>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-medium">Name:</span> {session.user?.name || "Not available"}</p>
              <p><span className="font-medium">Email:</span> {session.user?.email || "Not available"}</p>
            </div>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="mt-3 text-sm text-gray-600">
              Authentication is handled securely through Okta OIDC with protected sessions.
            </p>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-semibold">Environment</h2>
            <p className="mt-3 text-sm text-gray-600">
              Production-ready layout optimized for Vercel deployment.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
