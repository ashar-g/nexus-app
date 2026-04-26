import Link from "next/link";
import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <Link href="/" className={styles.logo}>
            <div className={styles.logoMark}>
              <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                <path d="M3 8l3-3 3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M3 12l3-3 3 3 3-3" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.6"/>
              </svg>
            </div>
            Nexus
          </Link>
          <p>The intelligent platform for modern engineering teams.</p>
        </div>
        <div className={styles.cols}>
          {[
            { title: "Product", links: [["Features", "/features"], ["Dashboard", "/dashboard"], ["Analytics", "/analytics"]] },
            { title: "Company", links: [["About", "#"], ["Blog", "#"], ["Careers", "#"]] },
            { title: "Legal", links: [["Privacy", "#"], ["Terms", "#"], ["Security", "#"]] },
          ].map(col => (
            <div key={col.title} className={styles.col}>
              <span className={styles.colTitle}>{col.title}</span>
              {col.links.map(([label, href]) => (
                <Link key={label} href={href} className={styles.colLink}>{label}</Link>
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className={styles.bottom}>
        <span>© {new Date().getFullYear()} Nexus Technologies, Inc.</span>
        <span>Built with Next.js · Secured by Okta OIDC</span>
      </div>
    </footer>
  );
}
