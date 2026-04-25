import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import Link from "next/link";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Features.module.css";

const plans = [
  {
    name: "Starter",
    price: "$0",
    period: "/mo",
    desc: "Perfect for small teams getting started.",
    features: ["Up to 5 services", "1M events/day", "7-day retention", "Slack alerts", "Community support"],
    cta: "Get Started Free",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$149",
    period: "/mo",
    desc: "For scaling teams with complex infrastructure.",
    features: ["Unlimited services", "10B events/day", "90-day retention", "AI anomaly detection", "Automated runbooks", "Priority support", "SSO via Okta/Azure"],
    cta: "Start Free Trial",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For organizations with mission-critical needs.",
    features: ["Unlimited everything", "Custom retention", "Dedicated infrastructure", "Custom ML models", "SLA guarantees", "SAML/SCIM provisioning", "Dedicated CSM"],
    cta: "Contact Sales",
    highlight: false,
  },
];

const integrations = [
  { name: "AWS CloudWatch", category: "Cloud" },
  { name: "Google Cloud", category: "Cloud" },
  { name: "Azure Monitor", category: "Cloud" },
  { name: "Kubernetes", category: "Infra" },
  { name: "Datadog", category: "Observability" },
  { name: "Grafana", category: "Observability" },
  { name: "PagerDuty", category: "Alerting" },
  { name: "Okta", category: "Identity" },
  { name: "Slack", category: "Collab" },
  { name: "GitHub", category: "DevOps" },
  { name: "Terraform", category: "DevOps" },
  { name: "Prometheus", category: "Metrics" },
];

export default function Features() {
  const { data: session } = useSession();

  return (
    <>
      <Head>
        <title>Features — Nexus</title>
        <meta name="description" content="Explore Nexus features: real-time observability, AI anomaly detection, automated runbooks, and enterprise SSO." />
      </Head>

      <Navbar />

      <main className={styles.main}>
        {/* Header */}
        <section className={styles.header}>
          <div className={styles.headerGlow} />
          <div className="container">
            <h1>Everything you need.<br /><span className="gradient-text">Nothing you don't.</span></h1>
            <p>Nexus is purpose-built for engineering teams who need deep visibility without the complexity of stitching together ten different tools.</p>
          </div>
        </section>

        {/* Deep features */}
        <section className={styles.deepSection}>
          <div className="container">
            {[
              {
                tag: "Observability",
                title: "See everything. Miss nothing.",
                desc: "Nexus ingests logs, metrics, and traces in a unified pipeline. Our streaming engine processes over 2 billion events per day with consistent sub-10ms latency — so you always have a live, accurate picture of your systems.",
                points: ["OpenTelemetry native", "eBPF-based infrastructure metrics", "Distributed tracing with flame graphs", "Log aggregation with structured parsing"],
                visual: "📡",
              },
              {
                tag: "AI & ML",
                title: "Intelligence built in, not bolted on.",
                desc: "Our models are trained on infrastructure telemetry at scale. They learn what 'normal' looks like for your systems and surface meaningful signals — not noise — before incidents escalate.",
                points: ["Baseline learning in under 24 hours", "Root cause correlation across services", "Capacity forecasting (30/60/90-day)", "Cost anomaly detection"],
                visual: "🧠",
              },
              {
                tag: "Automation",
                title: "Runbooks that run themselves.",
                desc: "Define response workflows with a visual builder or code. When a threshold is breached, Nexus can automatically scale infrastructure, restart services, page the right person, and write an incident summary — all without human intervention.",
                points: ["Visual runbook builder", "Git-backed automation as code", "Integrates with PagerDuty, Opsgenie", "Full audit trail of every action"],
                visual: "🔁",
              },
            ].map((f, i) => (
              <div key={f.tag} className={`${styles.deepFeature} ${i % 2 === 1 ? styles.reverse : ""}`}>
                <div className={styles.deepVisual}>
                  <div className={styles.deepVisualBox}>
                    <span>{f.visual}</span>
                  </div>
                </div>
                <div className={styles.deepContent}>
                  <span className={styles.featureTag}>{f.tag}</span>
                  <h2>{f.title}</h2>
                  <p>{f.desc}</p>
                  <ul className={styles.featurePoints}>
                    {f.points.map((p) => (
                      <li key={p}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" stroke="#4f7cff" strokeWidth="1.5" />
                          <path d="M5 8l2 2 4-4" stroke="#4f7cff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Integrations */}
        <section className={styles.intSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Integrates with your entire stack</h2>
              <p>Connect Nexus to the tools you already use in minutes.</p>
            </div>
            <div className={styles.intGrid}>
              {integrations.map((i) => (
                <div key={i.name} className={styles.intCard}>
                  <span className={styles.intCategory}>{i.category}</span>
                  <span className={styles.intName}>{i.name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className={styles.pricingSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Simple, transparent pricing</h2>
              <p>Start free. Scale as you grow. No surprise bills.</p>
            </div>
            <div className={styles.pricingGrid}>
              {plans.map((plan) => (
                <div key={plan.name} className={`${styles.planCard} ${plan.highlight ? styles.planHighlight : ""}`}>
                  {plan.highlight && <div className={styles.planBadge}>Most Popular</div>}
                  <div className={styles.planHeader}>
                    <h3>{plan.name}</h3>
                    <div className={styles.planPrice}>
                      <span className={styles.planAmount}>{plan.price}</span>
                      <span className={styles.planPeriod}>{plan.period}</span>
                    </div>
                    <p>{plan.desc}</p>
                  </div>
                  <ul className={styles.planFeatures}>
                    {plan.features.map((f) => (
                      <li key={f}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M3 7l2.5 2.5L11 4" stroke={plan.highlight ? "#4f7cff" : "#00e5a0"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn ${plan.highlight ? "btn-primary" : "btn-ghost"}`}
                    style={{ width: "100%", justifyContent: "center" }}
                    onClick={() => !session && signIn("okta", { callbackUrl: "/dashboard" })}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </>
  );
}
