import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Dashboard.module.css";

// ─── DATA ────────────────────────────────────────────────────────────────────
const services = [
  { name: "API Gateway",     status: "healthy",  latency: "8ms",   rpm: "142K",  errors: "0.01%" },
  { name: "Auth Service",    status: "healthy",  latency: "12ms",  rpm: "98K",   errors: "0.00%" },
  { name: "Data Pipeline",   status: "degraded", latency: "240ms", rpm: "31K",   errors: "1.40%" },
  { name: "ML Inference",    status: "healthy",  latency: "45ms",  rpm: "8.2K",  errors: "0.09%" },
  { name: "Notification Svc",status: "healthy",  latency: "18ms",  rpm: "4.1K",  errors: "0.02%" },
  { name: "Storage Layer",   status: "healthy",  latency: "6ms",   rpm: "210K",  errors: "0.00%" },
];

const alerts = [
  { level: "warn",    msg: "Data Pipeline latency elevated (>200ms)",       svc: "Data Pipeline",  ago: "3m ago" },
  { level: "info",    msg: "Deployment completed: api-gateway v2.4.1",      svc: "API Gateway",    ago: "14m ago" },
  { level: "info",    msg: "Auto-scaling triggered: ML Inference +2 nodes", svc: "ML Inference",   ago: "32m ago" },
  { level: "success", msg: "Runbook executed: cache flush resolved queue",  svc: "Data Pipeline",  ago: "1h ago" },
];

// ─── SERVER-SIDE AUTH (fixed) ────────────────────────────────────────────────
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: { destination: "/auth/signin?callbackUrl=/dashboard", permanent: false },
    };
  }

  // Safely extract user fields — Okta may return them in different shapes
  const user = {
    name:  session?.user?.name  || session?.user?.email?.split("@")[0] || "User",
    email: session?.user?.email || null,
  };

  return { props: { user } };
}

// ─── COMPONENT ───────────────────────────────────────────────────────────────
const statusMap = { healthy: { color: "#05b169", bg: "#ecfdf5", label: "Healthy" }, degraded: { color: "#f59e0b", bg: "#fffbeb", label: "Degraded" }, down: { color: "#ef4444", bg: "#fef2f2", label: "Down" } };
const alertIcon = { warn: "⚠", info: "ℹ", success: "✓" };
const alertColors = { warn: { bg: "#fffbeb", color: "#92400e", border: "#fde68a" }, info: { bg: "#eff6ff", color: "#1e40af", border: "#bfdbfe" }, success: { bg: "#ecfdf5", color: "#065f46", border: "#a7f3d0" } };

export default function Dashboard({ user }) {
  const healthyCount = services.filter(s => s.status === "healthy").length;

  return (
    <>
      <Head><title>Dashboard — Nexus</title></Head>
      <Navbar />
      <main className={styles.main}>
        <div className="container">

          {/* Page header */}
          <div className={styles.pageHead}>
            <div>
              <p className={styles.pageEyebrow}>Overview</p>
              <h1 className={styles.pageTitle}>Dashboard</h1>
            </div>
            <div className={styles.headRight}>
              <div className={styles.userChip}>
                <div className={styles.userAvatar}>{(user.name || "U")[0].toUpperCase()}</div>
                <div>
                  <span className={styles.userName}>{user.name}</span>
                  {user.email && <span className={styles.userEmail}>{user.email}</span>}
                </div>
              </div>
              <div className={styles.liveBadge}>
                <span className={styles.liveDot}/>
                Live
              </div>
            </div>
          </div>

          {/* KPI row */}
          <div className={styles.kpiRow}>
            {[
              { label: "System Health",  value: "97.2%",   sub: "+0.4% vs yesterday",  good: true  },
              { label: "Total RPS",       value: "493K",    sub: "↑ 12% this hour",     good: true  },
              { label: "P99 Latency",     value: "240ms",   sub: "↑ Data Pipeline",     good: false },
              { label: "Active Alerts",   value: "1",       sub: "0 critical",          good: true  },
              { label: "Healthy Services",value: `${healthyCount}/${services.length}`, sub: "1 degraded", good: true },
            ].map(k => (
              <div key={k.label} className={styles.kpiCard}>
                <span className={styles.kpiLabel}>{k.label}</span>
                <span className={styles.kpiValue}>{k.value}</span>
                <span className={`${styles.kpiSub} ${k.good ? styles.good : styles.warn}`}>{k.sub}</span>
              </div>
            ))}
          </div>

          {/* Main grid */}
          <div className={styles.grid}>

            {/* Services table */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <h2>Services</h2>
                <button className="btn btn-secondary btn-sm">View all</button>
              </div>
              <div className={styles.table}>
                <div className={styles.tableHead}>
                  <span>Service</span><span>Status</span><span>Latency</span><span>RPM</span><span>Errors</span>
                </div>
                {services.map(svc => {
                  const st = statusMap[svc.status];
                  return (
                    <div key={svc.name} className={styles.tableRow}>
                      <span className={styles.svcName}>{svc.name}</span>
                      <span>
                        <span className={styles.statusPill} style={{ background: st.bg, color: st.color }}>
                          <span className={styles.statusDot} style={{ background: st.color }}/>
                          {st.label}
                        </span>
                      </span>
                      <span className={svc.status === "degraded" ? styles.warnText : ""}>{svc.latency}</span>
                      <span>{svc.rpm}</span>
                      <span className={svc.errors !== "0.00%" && svc.errors !== "0.01%" && svc.errors !== "0.02%" && svc.errors !== "0.09%" ? styles.warnText : ""}>{svc.errors}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right column */}
            <div className={styles.rightCol}>

              {/* Alerts */}
              <div className={styles.card}>
                <div className={styles.cardHead}>
                  <h2>Alerts</h2>
                  <span className={styles.alertBadge}>1 active</span>
                </div>
                <div className={styles.alertList}>
                  {alerts.map((a, i) => {
                    const c = alertColors[a.level];
                    return (
                      <div key={i} className={styles.alertItem}>
                        <div className={styles.alertIcon} style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}` }}>
                          {alertIcon[a.level]}
                        </div>
                        <div className={styles.alertBody}>
                          <p>{a.msg}</p>
                          <span>{a.svc} · {a.ago}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Quick actions */}
              <div className={styles.card}>
                <div className={styles.cardHead}><h2>Quick Actions</h2></div>
                <div className={styles.actions}>
                  {[
                    { label: "Trigger Runbook", icon: "🔁" },
                    { label: "Scale Service",   icon: "⬆" },
                    { label: "Flush Cache",     icon: "🗑" },
                    { label: "Export Report",   icon: "📥" },
                  ].map(a => (
                    <button key={a.label} className={styles.actionBtn}>
                      <span className={styles.actionIcon}>{a.icon}</span>
                      <span>{a.label}</span>
                    </button>
                  ))}
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
