import { getSession } from "next-auth/react";

export default function Dashboard({ user }) {
  return (
    <main className="min-h-screen bg-[#F7F9FC] text-[#0A2540]">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <div>
            <p className="text-sm font-semibold text-blue-600">Nexus Platform</p>
            <h1 className="text-2xl font-bold tracking-tight">Executive Dashboard</h1>
          </div>
          <a
            href="/"
            className="rounded-xl border border-slate-300 bg-white px-5 py-2.5 font-medium text-slate-800 hover:bg-slate-50"
          >
            Home
          </a>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-10">
        <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <p className="text-sm font-medium text-blue-600">Welcome</p>
          <h2 className="mt-2 text-4xl font-bold tracking-tight">
            {user?.name || user?.email || "User"}
          </h2>
          <p className="mt-4 max-w-2xl text-slate-600">
            Secure access powered by Okta OIDC with a clean Coinbase-inspired enterprise experience.
          </p>
        </div>
      </section>
    </main>
  );
}

export async function getServerSideProps(context) {
  const session = await getSession(context);

  if (!session || !session.user) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        name: session.user.name || null,
        email: session.user.email || null,
      },
    },
  };
}
