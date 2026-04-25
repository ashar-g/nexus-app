import Head from "next/head";
import Link from "next/link";
import { useSession, signIn } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Home.module.css";

const stats = [
  { value: "99.9%", label: "Uptime SLA" },
  { value: "12ms", label: "Avg. Response" },
  { value: "50K+", label: "Active Teams" },
  { value: "2B+", label: "Events/Day" },
];

const testimonials = [
  {
    quote: "Nexus cut our incident response time by 70%. It's the control center our engineering team needed.",
    name: "Sarah Chen",
    role: "VP Engineering, CloudStack",
    initial: "S",
  },
  {
    quote: "The analytics depth is unmatched. We finally have visibility into every layer of our infrastructure.",
    name: "Marcus Webb",
    role: "CTO, Finova",
    initial: "M",
  },
  {
    quote: "Deployment is dead simple. We were live in under an hour. The Okta SSO integration was flawless.",
    name: "Priya Nair",
    role: "Head of Platform, Luminara",
    initial: "P",
  },
];

export default function Home() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Nexus — The Intelligent Platform for Modern Teams</title>
        <meta name="description" content="Nexus gives engineering teams real-time observability, AI-powered analytics, and enterprise-grade security — all in one unified platform." />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Navbar />

      <main className={styles.main}>
        {/* Hero */}
        <section className={styles.hero}>
          <div className={styles.gridBg} aria-hidden="true" />
          <div className={styles.glow1} aria-hidden="true" />
          <div className={styles.glow2} aria-hidden="true" />

          <div className={styles.heroContent}>
            <div className={styles.badge}>
              <span className={styles.badgeDot} />
              Now with AI-Powered Anomaly Detection
            </div>
            <h1 className={styles.heroTitle}>
              Your infrastructure,<br />
              <span className="gradient-text">fully illuminated.</span>
            </h1>
            <p className={styles.heroDesc}>
              Nexus unifies real-time observability, predictive analytics, and automated incident response — 
              so your team spends less time firefighting and more time shipping.
            </p>
            <div className={styles.heroCta}>
              {session ? (
                <Link href="/dashboard" className="btn btn-primary">
                  Go to Dashboard →
                </Link>
              ) : (
                <button className="btn btn-primary" onClick={() => signIn("okta", { callbackUrl: "/dashboard" })}>
                  Get Started Free →
                </button>
              )}
              <Link href="/features" className="btn btn-ghost">
                Explore Features
              </Link>
            </div>
          </div>

          {/* Hero visual */}
          <div className={styles.heroVisual}>
            <div className={styles.mockDashboard}>
              <div className={styles.mockBar}>
                <div className={styles.mockDots}>
                  <span /><span /><span />
                </div>
                <span className={styles.mockUrl}>nexus.app/dashboard</span>
              </div>
              <div className={styles.mockContent}>
                <div className={styles.mockMetrics}>
                  {["CPU", "Memory", "Network", "Errors"].map((m, i) => (
                    <div key={m} className={styles.mockMetric}>
                      <span className={styles.mockMetricLabel}>{m}</span>
                      <div className={styles.mockBar2}>
                        <div
                          className={styles.mockBarFill}
                          style={{ width: `${[72, 48, 91, 12][i]}%`, '--delay': `${i * 0.1}s` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
                <div className={styles.mockChart}>
                  <svg viewBox="0 0 280 80" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f7cff" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="#4f7cff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path d="M0,60 C20,55 40,30 60,35 C80,40 100,20 120,25 C140,30 160,10 180,15 C200,20 220,35 240,30 C260,25 270,20 280,18 L280,80 L0,80 Z" fill="url(#chartGrad)" />
                    <path d="M0,60 C20,55 40,30 60,35 C80,40 100,20 120,25 C140,30 160,10 180,15 C200,20 220,35 240,30 C260,25 270,20 280,18" fill="none" stroke="#4f7cff" strokeWidth="2" />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats */}
        <section className={styles.statsSection}>
          <div className="container">
            <div className={styles.statsGrid}>
              {stats.map((s) => (
                <div key={s.label} className={styles.statCard}>
                  <span className={styles.statValue}>{s.value}</span>
                  <span className={styles.statLabel}>{s.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Feature highlights */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Everything your team needs to move fast</h2>
              <p>Built for platform engineers who demand reliability, speed, and clarity at scale.</p>
            </div>
            <div className={styles.featureGrid}>
              {[
                {
                  icon: "⚡",
                  title: "Real-Time Observability",
                  desc: "Stream millions of events per second with sub-10ms latency. See exactly what's happening across every service.",
                },
                {
                  icon: "🧠",
                  title: "AI Anomaly Detection",
                  desc: "Our ML models learn your baseline and surface anomalies before they become incidents. Zero config required.",
                },
                {
                  icon: "🔒",
                  title: "Enterprise SSO",
                  desc: "Secure access via OIDC with Okta, Azure AD, or any SAML provider. RBAC and audit logs included.",
                },
                {
                  icon: "📊",
                  title: "Predictive Analytics",
                  desc: "Forecast capacity needs, detect cost anomalies, and surface optimization opportunities automatically.",
                },
                {
                  icon: "🔁",
                  title: "Automated Runbooks",
                  desc: "Trigger remediations automatically when thresholds are breached. Reduce MTTR by orders of magnitude.",
                },
                {
                  icon: "🌐",
                  title: "Multi-Cloud Native",
                  desc: "First-class integrations with AWS, GCP, Azure, and Kubernetes. One pane of glass for all environments.",
                },
              ].map((f) => (
                <div key={f.title} className={styles.featureCard}>
                  <span className={styles.featureIcon}>{f.icon}</span>
                  <h3>{f.title}</h3>
                  <p>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className={styles.section}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Trusted by engineering leaders</h2>
              <p>Teams at Fortune 500s and hypergrowth startups rely on Nexus.</p>
            </div>
            <div className={styles.testimonialGrid}>
              {testimonials.map((t) => (
                <div key={t.name} className={styles.testimonialCard}>
                  <p className={styles.testimonialQuote}>&ldquo;{t.quote}&rdquo;</p>
                  <div className={styles.testimonialAuthor}>
                    <div className={styles.testimonialAvatar}>{t.initial}</div>
                    <div>
                      <strong>{t.name}</strong>
                      <span>{t.role}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className={styles.ctaSection}>
          <div className="container">
            <div className={styles.ctaBox}>
              <div className={styles.ctaGlow} />
              <h2>Ready to take control?</h2>
              <p>Join 50,000+ teams who trust Nexus with their critical infrastructure.</p>
              <div className={styles.ctaBtns}>
                {session ? (
                  <Link href="/dashboard" className="btn btn-primary">
                    Open Dashboard →
                  </Link>
                ) : (
                  <button className="btn btn-primary" onClick={() => signIn("okta", { callbackUrl: "/dashboard" })}>
                    Start Free Trial →
                  </button>
                )}
                <Link href="/features" className="btn btn-ghost">Learn More</Link>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
