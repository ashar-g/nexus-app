import { signIn } from "next-auth/react";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A2540]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div className="text-2xl font-bold text-blue-600">Nexus</div>
          <button
            onClick={() => signIn("okta")}
            className="rounded-xl bg-blue-600 px-5 py-2.5 font-medium text-white hover:bg-blue-700"
          >
            Sign In
          </button>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <p className="text-sm font-semibold text-blue-600">Enterprise Identity</p>
        <h1 className="mt-4 max-w-3xl text-6xl font-bold tracking-tight">
          Intelligence built in, not bolted on.
        </h1>
        <p className="mt-6 max-w-2xl text-lg text-slate-600">
          Secure identity access with modern authentication and a clean professional experience.
        </p>
      </section>
    </main>
  );
}
