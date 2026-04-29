import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useState } from "react";
import Head from "next/head";
import Link from "next/link";
import styles from "../../styles/SignIn.module.css";

export async function getServerSideProps(context) {
  const session = await getSession(context);
  if (session) return { redirect: { destination: "/dashboard", permanent: false } };
  return { props: {} };
}

const ERROR_MESSAGES = {
  OAuthSignin:    "Could not start the sign-in flow. Please try again.",
  OAuthCallback:  "Authentication callback failed. Please try again.",
  OAuthCreateAccount: "Could not create your account. Contact your administrator.",
  AccessDenied:   "Access denied. You may not have permission to use this app.",
  Default:        "Authentication failed. Please try again.",
};

export default function SignIn() {
  const router = useRouter();
  const callbackUrl = router.query.callbackUrl || "/dashboard";
  const error = router.query.error;
  const errorMsg = ERROR_MESSAGES[error] || (error ? ERROR_MESSAGES.Default : null);

  const [loading, setLoading] = useState(null); // "okta" | "azure-ad" | null

  const handleSignIn = async (provider) => {
    setLoading(provider);
    await signIn(provider, { callbackUrl });
    // signIn redirects — setLoading cleanup is for cancelled flows
    setLoading(null);
  };

  return (
    <>
      <Head><title>Sign In — Nexus</title></Head>
      <div className={styles.page}>

        {/* ── Left panel ── */}
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
            <p className={styles.sub}>
              Choose your organisation&apos;s identity provider to sign in.
            </p>

            {errorMsg && (
              <div className={styles.errorBanner}>
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none">
                  <circle cx="7.5" cy="7.5" r="6.5" stroke="#ef4444" strokeWidth="1.2"/>
                  <path d="M7.5 4.5v3M7.5 10v.5" stroke="#ef4444" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
                {errorMsg}
              </div>
            )}

            {/* ── Okta button ── */}
            <button
              className={`${styles.idpBtn} ${styles.idpBtnOkta} ${loading === "okta" ? styles.idpLoading : ""}`}
              onClick={() => handleSignIn("okta")}
              disabled={!!loading}
            >
              <span className={styles.idpIcon}>
                {/* Okta "O" mark */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="currentColor" strokeWidth="1.6"/>
                  <circle cx="10" cy="10" r="3.5" fill="currentColor"/>
                </svg>
              </span>
              <span className={styles.idpLabel}>
                <span className={styles.idpName}>Continue with Okta</span>
                <span className={styles.idpHint}>For Okta-managed identities</span>
              </span>
              {loading === "okta"
                ? <span className={styles.spinner}/>
                : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.idpArrow}>
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
            </button>

            {/* ── Divider ── */}
            <div className={styles.orDivider}>
              <span className={styles.orLine}/><span className={styles.orText}>or</span><span className={styles.orLine}/>
            </div>

            {/* ── Entra ID button ── */}
            <button
              className={`${styles.idpBtn} ${styles.idpBtnEntra} ${loading === "azure-ad" ? styles.idpLoading : ""}`}
              onClick={() => handleSignIn("azure-ad")}
              disabled={!!loading}
            >
              <span className={styles.idpIcon}>
                {/* Microsoft "4 squares" logo */}
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <rect x="1"  y="1"  width="8.5" height="8.5" fill="#f25022"/>
                  <rect x="10.5" y="1"  width="8.5" height="8.5" fill="#7fba00"/>
                  <rect x="1"  y="10.5" width="8.5" height="8.5" fill="#00a4ef"/>
                  <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="#ffb900"/>
                </svg>
              </span>
              <span className={styles.idpLabel}>
                <span className={styles.idpName}>Continue with Microsoft</span>
                <span className={styles.idpHint}>For Entra ID / Azure AD accounts</span>
              </span>
              {loading === "azure-ad"
                ? <span className={styles.spinner}/>
                : <svg width="16" height="16" viewBox="0 0 16 16" fill="none" className={styles.idpArrow}>
                    <path d="M6 4l4 4-4 4" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
              }
            </button>

            {/* ── Trust strip ── */}
            <div className={styles.trust}>
              {[["🔒","OIDC / OAuth 2.0"],["🛡","SOC 2 Type II"],["⚡","Instant SSO"]].map(([icon, label]) => (
                <div key={label} className={styles.trustItem}>
                  <span>{icon}</span><span>{label}</span>
                </div>
              ))}
            </div>

            <Link href="/" className={styles.back}>← Back to home</Link>
          </div>
        </div>

        {/* ── Right panel ── */}
        <div className={styles.right}>
          <div className={styles.rightContent}>
            {/* Provider badges */}
            <div className={styles.rightBadges}>
              <div className={styles.rightBadge}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <circle cx="10" cy="10" r="9" stroke="white" strokeWidth="1.6"/>
                  <circle cx="10" cy="10" r="3.5" fill="white"/>
                </svg>
                Okta
              </div>
              <div className={styles.rightBadgeSep}>+</div>
              <div className={styles.rightBadge}>
                <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
                  <rect x="1"  y="1"  width="8.5" height="8.5" fill="white" opacity="0.9"/>
                  <rect x="10.5" y="1"  width="8.5" height="8.5" fill="white" opacity="0.7"/>
                  <rect x="1"  y="10.5" width="8.5" height="8.5" fill="white" opacity="0.7"/>
                  <rect x="10.5" y="10.5" width="8.5" height="8.5" fill="white" opacity="0.5"/>
                </svg>
                Entra ID
              </div>
            </div>

            <div className={styles.rightHeading}>
              One platform, any identity provider.
            </div>
            <p className={styles.rightDesc}>
              Sign in with your organisation&apos;s existing SSO. No new passwords. Full OIDC compliance.
            </p>

            <div className={styles.quote}>
              &ldquo;Nexus cut our incident response time by 70%. The multi-IDP SSO meant zero friction rolling it out across our Okta and Azure teams.&rdquo;
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
