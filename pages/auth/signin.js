import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/SignIn.module.css";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) {
    return { redirect: { destination: "/dashboard", permanent: false } };
  }
  return { props: {} };
}

export default function SignIn() {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || "/dashboard";
  const error = router.query.error;

  return (
    <>
      <Head>
        <title>Sign In — Nexus</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.glow} />
        <div className={styles.gridBg} />

        <nav className={styles.nav}>
          <Link href="/" className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#siLogoGrad)" />
              <path d="M8 14L12 10L16 14L20 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 18L12 14L16 18L20 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              <defs>
                <linearGradient id="siLogoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#4f7cff" />
                  <stop offset="1" stopColor="#7c4dff" />
                </linearGradient>
              </defs>
            </svg>
            Nexus
          </Link>
        </nav>

        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.lockIcon}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <rect x="3" y="11" width="18" height="13" rx="3" stroke="#4f7cff" strokeWidth="1.5" />
                <path d="M7 11V7a5 5 0 0110 0v4" stroke="#4f7cff" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
            </div>
            <h1>Welcome back</h1>
            <p>Sign in to access your dashboard and analytics.</p>
          </div>

          {error && (
            <div className={styles.error}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <circle cx="8" cy="8" r="7" stroke="#ff5a5a" strokeWidth="1.5" />
                <path d="M8 5v3M8 10.5v.5" stroke="#ff5a5a" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              {error === "OAuthSignin"
                ? "Error connecting to Okta. Please try again."
                : "Authentication failed. Please try again."}
            </div>
          )}

          <button
            className={styles.oktaBtn}
            onClick={() => signIn("okta", { callbackUrl })}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
              <circle cx="12" cy="12" r="3.5" fill="currentColor" />
            </svg>
            Continue with Okta
          </button>

          <div className={styles.divider}>
            <span>Secured by OIDC · Single Sign-On</span>
          </div>

          <div className={styles.footer}>
            <p>By signing in, you agree to our <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.</p>
            <Link href="/" className={styles.backLink}>← Back to home</Link>
          </div>
        </div>

        <div className={styles.features}>
          {[
            { icon: "🔒", text: "Enterprise-grade SSO via Okta OIDC" },
            { icon: "⚡", text: "Instant access to real-time dashboards" },
            { icon: "🛡", text: "SOC 2 Type II certified" },
          ].map((f) => (
            <div key={f.text} className={styles.featureItem}>
              <span>{f.icon}</span>
              <span>{f.text}</span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
