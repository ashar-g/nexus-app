import { useSession, signIn, signOut } from "next-auth/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState, useEffect } from "react";
import styles from "./Navbar.module.css";

export default function Navbar() {
  const { data: session } = useSession();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: "Home" },
    { href: "/features", label: "Features" },
    { href: "/dashboard", label: "Dashboard", protected: true },
    { href: "/analytics", label: "Analytics", protected: true },
  ];

  return (
    <nav className={`${styles.nav} ${scrolled ? styles.scrolled : ""}`}>
      <div className={styles.inner}>
        <Link href="/" className={styles.logo}>
          <div className={styles.logoMark}>
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8l3-3 3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M3 12l3-3 3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
            </svg>
          </div>
          <span>Nexus</span>
        </Link>

        <div className={styles.links}>
          {navLinks.map(link => (
            <Link
              key={link.href}
              href={link.protected && !session ? "/auth/signin" : link.href}
              className={`${styles.link} ${router.pathname === link.href ? styles.active : ""}`}
            >
              {link.label}
              {link.protected && !session && (
                <svg width="11" height="11" viewBox="0 0 12 12" fill="none" className={styles.lock}>
                  <rect x="2" y="5.5" width="8" height="6" rx="1.5" stroke="currentColor" strokeWidth="1.2"/>
                  <path d="M4 5.5V4a2 2 0 014 0v1.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/>
                </svg>
              )}
            </Link>
          ))}
        </div>

        <div className={styles.actions}>
          {session ? (
            <div className={styles.userArea}>
              <div className={styles.avatar}>
                {(session.user?.name || session.user?.email || "U")[0].toUpperCase()}
              </div>
              <span className={styles.userName}>
                {session.user?.name?.split(" ")[0] || session.user?.email?.split("@")[0]}
              </span>
              <button className="btn btn-secondary btn-sm" onClick={() => signOut({ callbackUrl: "/" })}>
                Sign out
              </button>
            </div>
          ) : (
            <div className={styles.authBtns}>
              <button className="btn btn-ghost btn-sm" onClick={() => signIn("okta")}>Sign in</button>
              <button className="btn btn-primary btn-sm" onClick={() => signIn("okta", { callbackUrl: "/dashboard" })}>
                Get started
              </button>
            </div>
          )}
        </div>

        <button className={styles.mobileBtn} onClick={() => setMobileOpen(!mobileOpen)}>
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
            {mobileOpen
              ? <><path d="M5 5l10 10M15 5L5 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
              : <><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>
            }
          </svg>
        </button>
      </div>

      {mobileOpen && (
        <div className={styles.mobileMenu}>
          {navLinks.map(link => (
            <Link key={link.href} href={link.protected && !session ? "/auth/signin" : link.href}
              className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
              {link.label}
            </Link>
          ))}
          <div className={styles.mobileDivider}/>
          {session
            ? <button className="btn btn-secondary" style={{width:"100%"}} onClick={() => signOut({callbackUrl:"/"})}>Sign out</button>
            : <button className="btn btn-primary" style={{width:"100%"}} onClick={() => signIn("okta", {callbackUrl:"/dashboard"})}>Sign in with Okta</button>
          }
        </div>
      )}
    </nav>
  );
}
