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
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close user menu on outside click
  useEffect(() => {
    if (!userMenuOpen) return;
    const handler = () => setUserMenuOpen(false);
    window.addEventListener("click", handler);
    return () => window.removeEventListener("click", handler);
  }, [userMenuOpen]);

  const navLinks = [
    { href: "/",          label: "Home",      protected: false },
    { href: "/features",  label: "Features",  protected: false },
    { href: "/dashboard", label: "Dashboard", protected: true  },
    { href: "/analytics", label: "Analytics", protected: true  },
  ];

  const initials = session
    ? ([session.user?.name?.split(" ")[0]?.[0], session.user?.name?.split(" ")[1]?.[0]]
        .filter(Boolean).join("") || session.user?.email?.[0] || "U").toUpperCase()
    : "";

  const displayName = session?.user?.name?.split(" ")[0]
    || session?.user?.preferredUsername
    || session?.user?.email?.split("@")[0]
    || "Account";

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
            <div className={styles.userArea} onClick={e => { e.stopPropagation(); setUserMenuOpen(o => !o); }}>
              <div className={styles.avatar}>{initials}</div>
              <span className={styles.userName}>{displayName}</span>
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" className={userMenuOpen ? styles.chevronUp : ""}>
                <path d="M3 4.5l3 3 3-3" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>

              {userMenuOpen && (
                <div className={styles.userMenu}>
                  <div className={styles.userMenuHeader}>
                    <div className={styles.menuAvatar}>{initials}</div>
                    <div>
                      <span className={styles.menuName}>{session.user?.name || displayName}</span>
                      <span className={styles.menuEmail}>{session.user?.email}</span>
                    </div>
                  </div>
                  <div className={styles.menuDivider}/>
                  <Link href="/profile" className={styles.menuItem}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><circle cx="7" cy="4.5" r="2.5" stroke="currentColor" strokeWidth="1.2"/><path d="M2 12c0-2.761 2.239-5 5-5s5 2.239 5 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    My Profile
                  </Link>
                  <Link href="/dashboard" className={styles.menuItem}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><rect x="1" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="1" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="1" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/><rect x="8" y="8" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.2"/></svg>
                    Dashboard
                  </Link>
                  <div className={styles.menuDivider}/>
                  <button className={styles.menuItemDanger} onClick={() => signOut({ callbackUrl: "/" })}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M5 7h7M9 5l3 2-3 2" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round"/><path d="M5 2H2a1 1 0 00-1 1v8a1 1 0 001 1h3" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round"/></svg>
                    Sign out
                  </button>
                </div>
              )}
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
              : <><path d="M3 6h14M3 10h14M3 14h14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/></>}
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
          {session && (
            <Link href="/profile" className={styles.mobileLink} onClick={() => setMobileOpen(false)}>
              My Profile
            </Link>
          )}
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
