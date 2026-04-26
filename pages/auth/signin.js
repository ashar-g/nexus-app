import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/SignIn.module.css";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) return { redirect: { destination: "/dashboard", permanent: false } };
  return { props: {} };
}

export default function SignIn() {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || "/dashboard";
  const error = router.query.error;

  const errorMsg = {
    OAuthSignin: "Error connecting to Okta. Please try again.",
    OAuthCallback: "Authentication callback failed.",
    Default: "Authentication failed. Please try again.",
  }[error] || (error ? "Authentication failed. Please try again." : null);

  return (
    <>
      <Head><title>Sign In — Nexus</title></Head>
      <div className={styles.page}>
        <div className={styles.left}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoMark}>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3-3 3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12l3-3 3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
            </div>
            Nexus
          </Link>
          <div className={styles.card}>
            <h1 className={styles.title}>Welcome back</h1>
            <p className={styles.sub}>Sign in to access your dashboard and analytics.</p>

            {errorMsg && (
              <div className={styles.error}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none"><circle cx="7.5" cy="7.5" r="6.5" stroke="#ef4444" strokeWidth="1.2"/><path d="M7.5 4.5v3M7.5 10v.5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/></svg>
                {errorMsg}
              </div>
            )}

            <button className={styles.oktaBtn} onClick={() => signIn("okta", { callbackUrl })}>
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <circle cx="9" cy="9" r="7" stroke="currentColor" strokeWidth="1.4"/>
                <circle cx="9" cy="9" r="2.8" fill="currentColor"/>
              </svg>
              Continue with Okta SSO
            </button>

            <div className={styles.divider}><span>Secured by OpenID Connect</span></div>

            <div className={styles.trust}>
              {[["🔒","Enterprise SSO"], ["🛡","SOC 2 Type II"], ["⚡","Instant access"]].map(([icon, label]) => (
                <div key={label} className={styles.trustItem}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>

            <Link href="/" className={styles.back}>← Back to home</Link>
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.rightContent}>
            <div className={styles.quote}>
              &ldquo;Nexus cut our incident response time by 70%. It&apos;s the control center our engineering team needed.&rdquo;
            </div>
            <div className={styles.quoteAuthor}>
              <div className={styles.quoteAvatar}>S</div>
              <div>
                <strong>Sarah Chen</strong>
                <span>VP Engineering, CloudStack</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
