import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Dashboard.module.css";

const services = [
  { name: "API Gateway", status: "healthy", latency: "8ms", rpm: "142K", errors: "0.01%" },
  { name: "Auth Service", status: "healthy", latency: "12ms", rpm: "98K", errors: "0.00%" },
  { name: "Data Pipeline", status: "degraded", latency: "240ms", rpm: "31K", errors: "1.4%" },
  { name: "ML Inference", status: "healthy", latency: "45ms", rpm: "8.2K", errors: "0.09%" },
  { name: "Notification Svc", status: "healthy", latency: "18ms", rpm: "4.1K", errors: "0.02%" },
  { name: "Storage Layer", status: "healthy", latency: "6ms", rpm: "210K", errors: "0.00%" },
];

const alerts = [
  { level: "warn", message: "Data Pipeline latency elevated (>200ms)", time: "3m ago", service: "Data Pipeline" },
  { level: "info", message: "Deployment completed: api-gateway v2.4.1", time: "14m ago", service: "API Gateway" },
  { level: "info", message: "Auto-scaling triggered: ML Inference +2 nodes", time: "32m ago", service: "ML Inference" },
  { level: "success", message: "Runbook executed: Cache flush resolved queue backup", time: "1h ago", service: "Data Pipeline" },
];

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/dashboard",
        permanent: false,
      },
    };
  }

  return {
    props: { session },
  };
}

export default function Dashboard({ session }) {
  const statusColor = { healthy: "#00e5a0", degraded: "#ffb547", down: "#ff5a5a" };

  return (
    <>
      <Head>
        <title>Dashboard — Nexus</title>
      </Head>

      <Navbar />

      <main className={styles.main}>
        <div className="container">
          {/* Page header */}
          <div className={styles.pageHeader}>
            <div>
              <h1>Dashboard</h1>
              <p>Welcome back, {session.user?.name || session.user?.email}. Here's your system overview.</p>
            </div>
            <div className={styles.headerMeta}>
              <div className={styles.liveTag}>
                <span className={styles.liveDot} />
                Live
              </div>
              <span className={styles.timestamp}>Updated just now</span>
            </div>
          </div>

          {/* KPI row */}
          <div className={styles.kpiRow}>
            {[
              { label: "Overall Health", value: "97.2%", trend: "+0.4%", good: true },
              { label: "Total RPS", value: "493K", trend: "+12%", good: true },
              { label: "P99 Latency", value: "240ms", trend: "+180ms", good: false },
              { label: "Active Alerts", value: "1", trend: "0 critical", good: true },
              { label: "Services", value: `${services.filter(s => s.status === "healthy").length}/${services.length}`, trend: "healthy", good: true },
            ].map((k) => (
              <div key={k.label} className={styles.kpiCard}>
                <span className={styles.kpiLabel}>{k.label}</span>
                <span className={styles.kpiValue}>{k.value}</span>
                <span className={`${styles.kpiTrend} ${k.good ? styles.good : styles.bad}`}>{k.trend}</span>
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            {/* Services table */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Services</h2>
                <button className="btn btn-ghost" style={{ fontSize: "13px", padding: "6px 14px" }}>View All</button>
              </div>
              <div className={styles.table}>
                <div className={styles.tableHead}>
                  <span>Service</span>
                  <span>Status</span>
                  <span>Latency</span>
                  <span>RPM</span>
                  <span>Error Rate</span>
                </div>
                {services.map((s) => (
                  <div key={s.name} className={styles.tableRow}>
                    <span className={styles.serviceName}>{s.name}</span>
                    <span className={styles.statusPill} style={{ "--dot": statusColor[s.status] }}>
                      <span className={styles.statusDot} />
                      {s.status}
                    </span>
                    <span className={s.status === "degraded" ? styles.warn : ""}>{s.latency}</span>
                    <span>{s.rpm}</span>
                    <span>{s.errors}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column */}
            <div className={styles.rightCol}>
              {/* Alerts */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Recent Alerts</h2>
                  <span className={styles.alertCount}>1 active</span>
                </div>
                <div className={styles.alertList}>
                  {alerts.map((a, i) => (
                    <div key={i} className={`${styles.alertItem} ${styles[a.level]}`}>
                      <div className={styles.alertIcon}>
                        {a.level === "warn" && "⚠"}
                        {a.level === "info" && "ℹ"}
                        {a.level === "success" && "✓"}
                      </div>
                      <div className={styles.alertBody}>
                        <p>{a.message}</p>
                        <span>{a.service} · {a.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick actions */}
              <div className={styles.panel}>
                <div className={styles.panelHeader}>
                  <h2>Quick Actions</h2>
                </div>
                <div className={styles.quickActions}>
                  {[
                    { label: "Trigger Runbook", icon: "🔁", color: "#4f7cff" },
                    { label: "Scale Service", icon: "⬆", color: "#00e5a0" },
                    { label: "Flush Cache", icon: "🗑", color: "#ffb547" },
                    { label: "Download Report", icon: "📥", color: "#7c4dff" },
                  ].map((a) => (
                    <button key={a.label} className={styles.quickAction}>
                      <span style={{ fontSize: "18px" }}>{a.icon}</span>
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
