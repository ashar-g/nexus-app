"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-xl">
          <p className="text-sm font-semibold text-cyan-400">Nexus Platform</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight">Loading your secure workspace</h1>
          <p className="mt-3 text-slate-300">Please wait while your authenticated session is verified.</p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-3xl border border-slate-800 bg-slate-900 p-10 shadow-xl">
          <p className="text-sm font-semibold text-cyan-400">Nexus Platform</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight">Enterprise Identity Access</h1>
          <p className="mt-4 text-base leading-7 text-slate-300">
            Secure access powered by Okta SSO with a clean modern enterprise experience.
          </p>

          <button
            onClick={() => signIn("okta")}
            className="mt-8 w-full rounded-2xl bg-cyan-500 px-6 py-4 text-base font-semibold text-slate-950 transition hover:bg-cyan-400"
          >
            Sign in with Okta
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-3xl border border-slate-800 bg-slate-900 p-8 shadow-xl">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-cyan-400">Nexus Platform</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Executive Dashboard</h1>
              <p className="mt-3 text-slate-300">
                Welcome back, {session?.user?.name || session?.user?.email || "User"}
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-2xl border border-slate-700 px-6 py-3 font-medium text-white hover:bg-slate-800"
            >
              Sign Out
            </button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-lg">
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-3 text-sm text-slate-300">Live identity details from your authenticated Okta session.</p>
            <div className="mt-5 space-y-3 text-sm">
              <p><span className="font-semibold">Name:</span> {session?.user?.name || "Not available"}</p>
              <p><span className="font-semibold">Email:</span> {session?.user?.email || "Not available"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-lg">
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="mt-3 text-sm text-slate-300">OIDC authentication is enforced with secure session controls and protected access policies.</p>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900 p-7 shadow-lg">
            <h2 className="text-lg font-semibold">Intelligence Built In</h2>
            <p className="mt-3 text-sm text-slate-300">
              Removed legacy Brian image section. This section is now clean text-only content with improved visual consistency.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
