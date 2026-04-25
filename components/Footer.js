import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <div className={styles.logo}>
            <svg width="24" height="24" viewBox="0 0 28 28" fill="none">
              <rect width="28" height="28" rx="8" fill="url(#footerLogoGrad)" />
              <path d="M8 14L12 10L16 14L20 10" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 18L12 14L16 18L20 14" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" opacity="0.5" />
              <defs>
                <linearGradient id="footerLogoGrad" x1="0" y1="0" x2="28" y2="28">
                  <stop stopColor="#4f7cff" />
                  <stop offset="1" stopColor="#7c4dff" />
                </linearGradient>
              </defs>
            </svg>
            <span>Nexus</span>
          </div>
          <p className={styles.tagline}>The intelligent platform for modern teams.</p>
        </div>

        <div className={styles.links}>
          <div className={styles.col}>
            <span className={styles.colTitle}>Product</span>
            <Link href="/features">Features</Link>
            <Link href="/dashboard">Dashboard</Link>
            <Link href="/analytics">Analytics</Link>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Company</span>
            <a href="#">About</a>
            <a href="#">Blog</a>
            <a href="#">Careers</a>
          </div>
          <div className={styles.col}>
            <span className={styles.colTitle}>Legal</span>
            <a href="#">Privacy</a>
            <a href="#">Terms</a>
            <a href="#">Security</a>
          </div>
        </div>
      </div>

      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Nexus Technologies, Inc. All rights reserved.</span>
        <span>Built with Next.js · Secured by Okta</span>
      </div>
    </footer>
  );
}
