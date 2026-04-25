import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/AuthError.module.css";

const errorMessages = {
  Configuration: "Server configuration error. Please contact support.",
  AccessDenied: "You don't have permission to access this resource.",
  Verification: "The sign-in link has expired. Please request a new one.",
  OAuthSignin: "Could not connect to Okta. Please try again.",
  OAuthCallback: "Authentication callback failed. Please try again.",
  Default: "An unexpected error occurred during authentication.",
};

export default function AuthError() {
  const router = useRouter();
  const error = router.query.error;
  const message = errorMessages[error] || errorMessages.Default;

  return (
    <>
      <Head>
        <title>Auth Error — Nexus</title>
      </Head>

      <div className={styles.page}>
        <div className={styles.glow} />
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <circle cx="16" cy="16" r="14" stroke="#ff5a5a" strokeWidth="2" />
              <path d="M16 10v7M16 20.5v1" stroke="#ff5a5a" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </div>
          <h1 className={styles.title}>Authentication Error</h1>
          <p className={styles.description}>{message}</p>
          {error && <code className={styles.code}>Error code: {error}</code>}
          <div className={styles.actions}>
            <Link href="/auth/signin" className="btn btn-primary">Try Again</Link>
            <Link href="/" className="btn btn-ghost">Go Home</Link>
          </div>
        </div>
      </div>
    </>
  );
}
