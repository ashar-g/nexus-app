import Head from "next/head";
import Link from "next/link";
import { useRouter } from "next/router";
import styles from "../../styles/AuthError.module.css";
const msgs = {
  Configuration:"Server configuration error. Please contact support.",
  AccessDenied:"You don't have permission to access this resource.",
  OAuthSignin:"Could not connect to Okta. Please try again.",
  OAuthCallback:"Authentication callback failed. Please try again.",
  Default:"An unexpected error occurred during authentication.",
};
export default function AuthError() {
  const { query } = useRouter();
  const message = msgs[query.error] || msgs.Default;
  return (
    <>
      <Head><title>Auth Error — Nexus</title></Head>
      <div className={styles.page}>
        <div className={styles.card}>
          <div className={styles.iconWrap}>
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
              <circle cx="14" cy="14" r="12" stroke="#ef4444" strokeWidth="1.8"/>
              <path d="M14 9v6M14 18v1" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round"/>
            </svg>
          </div>
          <h1 className={styles.title}>Authentication Error</h1>
          <p className={styles.desc}>{message}</p>
          {query.error && <code className={styles.errorCode}>Error: {query.error}</code>}
          <div className={styles.actions}>
            <Link href="/auth/signin" className="btn btn-primary">Try again</Link>
            <Link href="/" className="btn btn-secondary">Go home</Link>
          </div>
        </div>
      </div>
    </>
  );
}
