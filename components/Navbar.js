import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navLinks = [
    { href: "/", label: "Home", public: true },
    { href: "/features", label: "Features", public: true },
    { href: "/dashboard", label: "Dashboard", public: false },
    { href: "/analytics", label: "Analytics", public: false },
  ];

  return (
    <nav className={styles.nav}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
            <rect width="28" height="28" rx="8" fill="url(#logoGrad)" />
            <path d="M8 14L12 10L16 14L20 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M8 18L12 14L16 18L20 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
            <defs>
              <linearGradient id="logoGrad" x1="0" y1="0" x2="28" y2="28" gradientUnits="userSpaceOnUse">
                <stop stopColor="#4f7cff" />
                <stop offset="1" stopColor="#7c4dff" />
              </linearGradient>
            </defs>
          </svg>
          <span>Nexus</span>
        </Link>

        <div className={styles.links}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.public || session ? link.href : "/auth/signin"}
              className={`${styles.link} ${router.pathname === link.href ? styles.active : ""}`}
            >
              {!link.public && (
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={styles.lockIcon}>
                  <rect x="2" y="5" width="8" height="7" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
                  <path d="M4 5V3.5a2 2 0 014 0V5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
                </svg>
              )}
              {link.label}
            </Link>
          ))}
        </div>

        <div className={styles.auth}>
          {session ? (
            <div className={styles.userMenu}>
              <div className={styles.avatar}>
                {session.user?.name?.[0] || session.user?.email?.[0] || "U"}
              </div>
              <span className={styles.userName}>{session.user?.name?.split(" ")[0]}</span>
              <button className="btn btn-ghost" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign Out
              </button>
            </div>
          ) : (
            <button
              className="btn btn-primary"
              onClick={() => signIn("okta", { callbackUrl: "/dashboard" })}
            >
              Sign In
            </button>
          )}
        </div>

        <button className={styles.mobileToggle} onClick={() => setMobileOpen(!mobileOpen)}>
          <span /><span /><span />
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.public || session ? link.href : "/auth/signin"}
              className={styles.mobileLink}
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
              {!link.public && <span className={styles.badge}>Pro</span>}
            </Link>
          ))}
          <div className={styles.mobileDivider} />
          {session ? (
            <button className="btn btn-ghost" style={{ width: "100%" }} onClick={() => signOut({ callbackUrl: "/" })}>
              Sign Out
            </button>
          ) : (
            <button className="btn btn-primary" style={{ width: "100%" }} onClick={() => signIn("okta")}>
              Sign In with Okta
            </button>
          )}
        </div>
      )}
    </nav>
  );
}
