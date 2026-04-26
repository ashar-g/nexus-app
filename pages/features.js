import Head from "next/head";
import { useSession, signIn } from "next-auth/react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Features.module.css";

const plans = [
  { name:"Starter", price:"$0", period:"/mo", desc:"For small teams getting started.", highlight:false,
    features:["Up to 5 services","1M events/day","7-day retention","Slack alerts","Community support"], cta:"Get started free" },
  { name:"Growth", price:"$149", period:"/mo", desc:"For scaling teams with complex infra.", highlight:true,
    features:["Unlimited services","10B events/day","90-day retention","AI anomaly detection","Automated runbooks","Okta SSO","Priority support"], cta:"Start free trial" },
  { name:"Enterprise", price:"Custom", period:"", desc:"For mission-critical deployments.", highlight:false,
    features:["Unlimited everything","Custom retention","Dedicated infra","Custom ML models","SLA guarantee","SAML/SCIM","Dedicated CSM"], cta:"Contact sales" },
];

const integrations = [
  ["AWS CloudWatch","Cloud"],["Google Cloud","Cloud"],["Azure Monitor","Cloud"],["Kubernetes","Infra"],
  ["Grafana","Observability"],["Datadog","Observability"],["PagerDuty","Alerting"],["Okta","Identity"],
  ["Slack","Collab"],["GitHub","DevOps"],["Terraform","DevOps"],["Prometheus","Metrics"],
];

export default function Features() {
  const { data: session } = useSession();
  return (
    <>
      <Head><title>Features — Nexus</title></Head>
      <Navbar />
      <main className={styles.main}>
        <section className={styles.header}>
          <span className={styles.eyebrow}>Platform</span>
          <h1>Everything you need.<br/>Nothing you don&apos;t.</h1>
          <p>Purpose-built for engineering teams who need deep visibility without stitching together ten different tools.</p>
        </section>

        <section className={styles.deepSection}>
          <div className="container">
            {[
              { tag:"Observability", title:"See everything. Miss nothing.", visual:"📡",
                desc:"Nexus ingests logs, metrics, and traces in a unified pipeline. Our streaming engine processes over 2 billion events per day with consistent sub-10ms latency.",
                points:["OpenTelemetry native","eBPF-based infrastructure metrics","Distributed tracing with flame graphs","Log aggregation with structured parsing"] },
              { tag:"AI & ML", title:"Intelligence built in, not bolted on.", visual:"🧠",
                desc:"Our models learn what 'normal' looks like for your systems and surface meaningful signals — not noise — before incidents escalate.",
                points:["Baseline learning in under 24 hours","Root cause correlation across services","Capacity forecasting (30/60/90-day)","Cost anomaly detection"] },
              { tag:"Automation", title:"Runbooks that run themselves.", visual:"🔁",
                desc:"When a threshold is breached, Nexus can automatically scale infrastructure, restart services, page the right person, and write an incident summary.",
                points:["Visual runbook builder","Git-backed automation as code","PagerDuty & Opsgenie integration","Full audit trail of every action"] },
            ].map((f, i) => (
              <div key={f.tag} className={`${styles.deepFeature} ${i % 2 === 1 ? styles.reverse : ""}`}>
                <div className={styles.deepVisual}>
                  <div className={styles.deepVisualBox}><span>{f.visual}</span></div>
                </div>
                <div className={styles.deepContent}>
                  <span className={styles.featureTag}>{f.tag}</span>
                  <h2>{f.title}</h2>
                  <p>{f.desc}</p>
                  <ul className={styles.featurePoints}>
                    {f.points.map(p => (
                      <li key={p}>
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="7" fill="#eff6ff"/>
                          <path d="M5 8l2 2 4-4" stroke="#0052ff" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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

        <section className={styles.intSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Integrates with your entire stack</h2>
              <p>Connect Nexus to the tools you already use in minutes.</p>
            </div>
            <div className={styles.intGrid}>
              {integrations.map(([name, cat]) => (
                <div key={name} className={styles.intCard}>
                  <span className={styles.intCategory}>{cat}</span>
                  <span className={styles.intName}>{name}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className={styles.pricingSection}>
          <div className="container">
            <div className={styles.sectionHeader}>
              <h2>Simple, transparent pricing</h2>
              <p>Start free. Scale as you grow. No surprise bills.</p>
            </div>
            <div className={styles.pricingGrid}>
              {plans.map(plan => (
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
                    {plan.features.map(f => (
                      <li key={f}>
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                          <path d="M2.5 7l3 3 6-6" stroke={plan.highlight ? "#0052ff" : "#05b169"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                        {f}
                      </li>
                    ))}
                  </ul>
                  <button
                    className={`btn ${plan.highlight ? "btn-primary" : "btn-secondary"}`}
                    style={{ width: "100%" }}
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
