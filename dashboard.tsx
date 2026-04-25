import { getSession, signOut } from "next-auth/react";

type Props = {
  session?: {
    user?: {
      name?: string;
      email?: string;
    };
  };
};

export default function Dashboard({ session }: Props) {
  const user = session?.user;

  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 px-6 py-10">
      <div className="mx-auto max-w-6xl">
        <header className="mb-8 rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">Nexus Platform</p>
              <h1 className="mt-2 text-4xl font-bold tracking-tight">Executive Dashboard</h1>
              <p className="mt-3 text-slate-600">
                Welcome back, {user?.name || user?.email || "User"}
              </p>
            </div>

            <button
              onClick={() => signOut({ callbackUrl: "/" })}
              className="rounded-2xl border border-slate-300 bg-white px-6 py-3 font-medium text-slate-800 hover:bg-slate-50"
            >
              Sign Out
            </button>
          </div>
        </header>

        <section className="grid gap-6 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold">Profile</h2>
            <p className="mt-3 text-sm text-slate-600">Authenticated user details from Okta session.</p>
            <div className="mt-4 space-y-2 text-sm">
              <p><span className="font-semibold">Name:</span> {user?.name || "Not available"}</p>
              <p><span className="font-semibold">Email:</span> {user?.email || "Not available"}</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold">Security</h2>
            <p className="mt-3 text-sm text-slate-600">
              Secure OIDC authentication with protected session controls and enterprise-grade access.
            </p>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-7 shadow-sm">
            <h2 className="text-lg font-semibold">Environment</h2>
            <p className="mt-3 text-sm text-slate-600">
              Clean modern UI with lighter navigation and production-ready deployment for Vercel.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}

export async function getServerSideProps(context: any) {
  const session = await getSession(context);

  if (!session) {
    return {
      redirect: {
        destination: "/",
        permanent: false,
      },
    };
  }

  return {
    props: {
      session,
    },
  };
}
