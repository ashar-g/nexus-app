import Head from "next/head";
import Link from "next/link";
import { signIn, useSession } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

const stats = [
  { value: "99.99%", label: "Uptime SLA" },
  { value: "<10ms", label: "P99 Latency" },
  { value: "50K+", label: "Teams" },
  { value: "2B+", label: "Events/Day" },
];

const features = [
  { icon: "⚡", title: "Real-Time Observability", desc: "Sub-10ms event streaming across every service in your stack. Always know what's happening." },
  { icon: "🧠", title: "AI Anomaly Detection", desc: "ML models learn your baseline and surface issues before they escalate. Zero config required." },
  { icon: "🔒", title: "Enterprise SSO", desc: "OIDC with Okta, Azure AD, or any SAML provider. Full RBAC and audit trails included." },
  { icon: "📊", title: "Predictive Analytics", desc: "Forecast capacity, detect cost anomalies, and surface optimizations automatically." },
  { icon: "🔁", title: "Automated Runbooks", desc: "Trigger remediations automatically when thresholds breach. Reduce MTTR by 70%." },
  { icon: "🌐", title: "Multi-Cloud Native", desc: "First-class AWS, GCP, Azure, and Kubernetes support. One pane of glass." },
];

const logos = ["Stripe", "Shopify", "Figma", "Notion", "Vercel", "Linear"];

export default function Home() {
  const { data: session } = useSession();
  return (
    <>
      <Head>
        <title>Nexus — The Intelligent Platform for Modern Teams</title>
        <meta name="description" content="Real-time observability, AI analytics, and automated incident response for engineering teams." />
      </Head>
      <Navbar />
      <main className={styles.main}>

        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.heroInner}>
            <div className={styles.heroBadge}>
              <span className={styles.badgeDot}/>
              Now with AI-Powered Anomaly Detection
            </div>
            <h1 className={styles.heroTitle}>
              Your infrastructure,<br/>fully under control.
            </h1>
            <p className={styles.heroDesc}>
              Nexus gives engineering teams real-time observability, AI-powered analytics, and automated incident response — unified in one platform.
            </p>
            <div className={styles.heroCta}>
              {session ? (
                <Link href="/dashboard" className="btn btn-primary btn-lg">Go to Dashboard →</Link>
              ) : (
                <button className="btn btn-primary btn-lg" onClick={() => signIn("okta", { callbackUrl: "/dashboard" })}>
                  Get started free
                </button>
              )}
              <Link href="/features" className="btn btn-secondary btn-lg">See how it works</Link>
            </div>
            <p className={styles.heroNote}>Free plan available · No credit card required</p>
          </div>

          {/* Dashboard preview */}
          <div className={styles.heroVisual}>
            <div className={styles.mockWindow}>
              <div className={styles.mockTitleBar}>
                <div className={styles.mockDots}><span/><span/><span/></div>
                <div className={styles.mockAddr}>nexus.app/dashboard</div>
              </div>
              <div className={styles.mockBody}>
                <div className={styles.mockSidebar}>
                  {["Dashboard","Analytics","Services","Alerts","Runbooks"].map((item, i) => (
                    <div key={item} className={`${styles.mockSideItem} ${i===0 ? styles.mockSideActive : ""}`}>{item}</div>
                  ))}
                </div>
                <div className={styles.mockMain}>
                  <div className={styles.mockKpis}>
                    {[["99.9%","Uptime"],["8ms","Latency"],["0.02%","Errors"]].map(([v,l]) => (
                      <div key={l} className={styles.mockKpi}>
                        <span className={styles.mockKpiVal}>{v}</span>
                        <span className={styles.mockKpiLabel}>{l}</span>
                      </div>
                    ))}
                  </div>
                  <div className={styles.mockChart}>
                    <svg viewBox="0 0 260 60" preserveAspectRatio="none">
                      <defs>
                        <linearGradient id="hg" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#0052ff" stopOpacity="0.15"/>
                          <stop offset="100%" stopColor="#0052ff" stopOpacity="0"/>
                        </linearGradient>
                      </defs>
                      <path d="M0,45 C20,42 40,25 65,22 C90,19 110,30 130,27 C150,24 170,10 195,12 C215,14 235,28 260,22 L260,60 L0,60Z" fill="url(#hg)"/>
                      <path d="M0,45 C20,42 40,25 65,22 C90,19 110,30 130,27 C150,24 170,10 195,12 C215,14 235,28 260,22" fill="none" stroke="#0052ff" strokeWidth="1.5"/>
                    </svg>
                  </div>
                  <div className={styles.mockServices}>
                    {[["API Gateway","healthy"],["Auth Service","healthy"],["Data Pipeline","degraded"]].map(([name,status]) => (
                      <div key={name} className={styles.mockService}>
                        <span className={`${styles.mockDot2} ${styles[status]}`}/>
                        <span>{name}</span>
                        <span className={styles.mockStatus}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Trusted by */}
        <section className={styles.trustedSection}>
          <div className="container">
            <p className={styles.trustedLabel}>Trusted by engineering teams at</p>
            <div className={styles.logos}>
              {logos.map(l => <div key={l} className={styles.logoChip}>{l}</div>)}
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              {stats.map(s => (
                <div key={s.label} className={styles.statCard}>
                  <span className={styles.statVal}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Features */}
        <section className={styles.featSection}>
          <div className="container">
            <div className={styles.sectionHead}>
              <span className={styles.eyebrow}>Platform</span>
              <h2>Everything your team needs to move fast</h2>
              <p>Purpose-built for platform engineers who demand reliability, speed, and clarity at scale.</p>
            </div>
            <div className={styles.featGrid}>
              {features.map(f => (
                <div key={f.title} className={styles.featCard}>
                  <div className={styles.featIcon}>{f.icon}</div>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA banner */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaBox}>
              <div className={styles.ctaText}>
                <h2>Ready to get started?</h2>
                <p>Join 50,000+ teams who trust Nexus with their critical infrastructure.</p>
              </div>
              <div className={styles.ctaBtns}>
                {session ? (
                  <Link href="/dashboard" className="btn btn-primary btn-lg">Open Dashboard</Link>
                ) : (
                  <button className="btn btn-primary btn-lg" onClick={() => signIn("okta", { callbackUrl: "/dashboard" })}>
                    Start for free
                  </button>
                )}
                <Link href="/features" className="btn btn-secondary btn-lg">Learn more</Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
