"use client";

import { useSession, signIn, signOut } from "next-auth/react";

export default function DashboardPage() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-lg rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Nexus Platform</p>
          <h1 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
            Loading your workspace
          </h1>
          <p className="mt-3 text-slate-600">
            Please wait while we securely verify your session.
          </p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="min-h-screen bg-slate-50 flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-3xl border border-slate-200 bg-white p-10 shadow-sm">
          <p className="text-sm font-semibold text-blue-600">Nexus Platform</p>
          <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
            Secure Identity Access
          </h1>
          <p className="mt-4 text-base leading-7 text-slate-600">
            Access your protected enterprise dashboard using secure SSO with Okta.
            Designed for a clean, modern and production-ready experience.
          </p>

          <button
            onClick={() => signIn("okta")}
            className="mt-8 w-full rounded-2xl bg-blue-600 px-6 py-4 text-base font-semibold text-white transition hover:bg-blue-700"
          >
            Sign in with Okta
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto max-w-7xl">
        <header className="mb-10 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">Nexus Platform</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight text-slate-900">
                Executive Dashboard
              </h1>
              <p className="mt-3 text-slate-600">
                Welcome back, {session.user?.name || session.user?.email || "User"}
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-2xl border border-slate-300 px-6 py-3 font-medium text-slate-700 hover:bg-slate-50"
            >
              Sign Out
            </button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">User Profile</h2>
            <p className="mt-3 text-sm text-slate-600">
              Live identity details from your authenticated Okta session.
            </p>
            <div className="mt-5 space-y-3 text-sm">
              <p><span className="font-semibold">Name:</span> {session.user?.name || "Not available"}</p>
              <p><span className="font-semibold">Email:</span> {session.user?.email || "Not available"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Security Status</h2>
            <p className="mt-3 text-sm text-slate-600">
              Authentication is protected through secure OIDC federation with Okta and managed session controls.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Deployment</h2>
            <p className="mt-3 text-sm text-slate-600">
              Optimized for production deployment on Vercel with a clean white, blue and black enterprise theme.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
