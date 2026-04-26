import Head from "next/head";
import Link from "next/link";
import styles from "../styles/404.module.css";

export default function NotFound() {
  return (
    <>
      <Head><title>404 — Nexus</title></Head>
      <div className={styles.page}>
        <div className={styles.content}>
          <span className={styles.code}>404</span>
          <h1 className={styles.title}>Page not found</h1>
          <p className={styles.desc}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
          <div className={styles.actions}>
            <Link href="/" className="btn btn-primary">Go Home</Link>
            <Link href="/features" className="btn btn-secondary">View Features</Link>
          </div>
        </div>
      </div>
    </>
  );
}
