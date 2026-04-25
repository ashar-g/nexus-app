import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Analytics.module.css";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);

  if (!session) {
    return {
      redirect: {
        destination: "/auth/signin?callbackUrl=/analytics",
        permanent: false,
      },
    };
  }

  return { props: { session } };
}

// Simulated sparkline data
const generateSparkline = (points, min, max) => {
  const vals = Array.from({ length: points }, () => Math.floor(Math.random() * (max - min) + min));
  const w = 200;
  const h = 40;
  const step = w / (vals.length - 1);
  const scale = h / (max - min);
  const path = vals
    .map((v, i) => `${i === 0 ? "M" : "L"} ${i * step} ${h - (v - min) * scale}`)
    .join(" ");
  return { path, vals };
};

const metrics = [
  { label: "Requests Today", value: "4.2B", change: "+8.4%", good: true, ...generateSparkline(20, 50, 100) },
  { label: "Avg Response Time", value: "22ms", change: "-3ms", good: true, ...generateSparkline(20, 15, 40) },
  { label: "Error Rate", value: "0.08%", change: "-0.02%", good: true, ...generateSparkline(20, 0, 10) },
  { label: "Data Ingested", value: "1.8TB", change: "+12%", good: true, ...generateSparkline(20, 30, 80) },
];

const topEndpoints = [
  { path: "/api/v2/events", rpm: "48,291", p99: "12ms", errors: "0.00%" },
  { path: "/api/v2/metrics", rpm: "31,047", p99: "18ms", errors: "0.01%" },
  { path: "/api/v2/traces", rpm: "22,183", p99: "24ms", errors: "0.00%" },
  { path: "/api/v2/alerts", rpm: "8,492", p99: "9ms", errors: "0.03%" },
  { path: "/api/v2/runbooks", rpm: "2,841", p99: "45ms", errors: "0.09%" },
];

const costData = [
  { service: "Compute", current: 12400, prev: 13100, pct: 74 },
  { service: "Storage", current: 2800, prev: 2650, pct: 17 },
  { service: "Network", current: 980, prev: 920, pct: 6 },
  { service: "Other", current: 520, prev: 510, pct: 3 },
];

export default function Analytics({ session }) {
  return (
    <>
      <Head>
        <title>Analytics — Nexus</title>
      </Head>

      <Navbar />

      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHeader}>
            <div>
              <h1>Analytics</h1>
              <p>Aggregated performance and cost insights across all services.</p>
            </div>
            <div className={styles.controls}>
              <select className={styles.select}>
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
                <option>Last 90 days</option>
              </select>
              <button className="btn btn-ghost" style={{ fontSize: "13px", padding: "8px 16px" }}>
                Export CSV
              </button>
            </div>
          </div>

          {/* Metric cards with sparklines */}
          <div className={styles.metricsRow}>
            {metrics.map((m) => (
              <div key={m.label} className={styles.metricCard}>
                <div className={styles.metricTop}>
                  <span className={styles.metricLabel}>{m.label}</span>
                  <span className={`${styles.metricChange} ${m.good ? styles.good : styles.bad}`}>
                    {m.change}
                  </span>
                </div>
                <span className={styles.metricValue}>{m.value}</span>
                <div className={styles.sparkline}>
                  <svg viewBox={`0 0 200 40`} preserveAspectRatio="none">
                    <defs>
                      <linearGradient id={`sg-${m.label}`} x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#4f7cff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#4f7cff" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d={`${m.path} L 200 40 L 0 40 Z`}
                      fill={`url(#sg-${m.label})`}
                    />
                    <path d={m.path} fill="none" stroke="#4f7cff" strokeWidth="1.5" />
                  </svg>
                </div>
              </div>
            ))}
          </div>

          <div className={styles.grid}>
            {/* Traffic chart (simulated) */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Request Volume (24h)</h2>
                <div className={styles.legend}>
                  <span className={styles.legendDot} style={{ background: "#4f7cff" }} /> Requests
                  <span className={styles.legendDot} style={{ background: "#ff5a5a", marginLeft: 12 }} /> Errors
                </div>
              </div>
              <div className={styles.chartArea}>
                <svg viewBox="0 0 600 140" preserveAspectRatio="none" className={styles.mainChart}>
                  <defs>
                    <linearGradient id="mainGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#4f7cff" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#4f7cff" stopOpacity="0" />
                    </linearGradient>
                  </defs>
                  {/* Grid lines */}
                  {[0, 35, 70, 105].map(y => (
                    <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(99,140,255,0.08)" strokeWidth="1" />
                  ))}
                  {/* Area */}
                  <path
                    d="M0,100 C25,90 50,60 75,55 C100,50 125,70 150,65 C175,60 200,30 225,25 C250,20 275,35 300,30 C325,25 350,40 375,35 C400,30 425,20 450,22 C475,24 500,45 525,40 C550,35 575,25 600,20 L600,140 L0,140 Z"
                    fill="url(#mainGrad)"
                  />
                  <path
                    d="M0,100 C25,90 50,60 75,55 C100,50 125,70 150,65 C175,60 200,30 225,25 C250,20 275,35 300,30 C325,25 350,40 375,35 C400,30 425,20 450,22 C475,24 500,45 525,40 C550,35 575,25 600,20"
                    fill="none"
                    stroke="#4f7cff"
                    strokeWidth="2"
                  />
                  {/* Error line */}
                  <path
                    d="M0,135 C50,133 100,134 150,132 C200,130 250,128 300,130 C350,132 400,129 450,128 C500,127 550,126 600,125"
                    fill="none"
                    stroke="#ff5a5a"
                    strokeWidth="1.5"
                    strokeDasharray="4 2"
                  />
                </svg>
                <div className={styles.xAxis}>
                  {["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "Now"].map(t => (
                    <span key={t}>{t}</span>
                  ))}
                </div>
              </div>
            </div>

            {/* Cost breakdown */}
            <div className={styles.panel}>
              <div className={styles.panelHeader}>
                <h2>Cost Breakdown</h2>
                <span className={styles.totalCost}>$16,700 / mo</span>
              </div>
              <div className={styles.costList}>
                {costData.map((c) => (
                  <div key={c.service} className={styles.costRow}>
                    <div className={styles.costMeta}>
                      <span className={styles.costService}>{c.service}</span>
                      <span className={styles.costValues}>
                        <strong>${c.current.toLocaleString()}</strong>
                        <span className={c.current < c.prev ? styles.good : styles.bad}>
                          {c.current < c.prev ? "↓" : "↑"}
                          {Math.abs(((c.current - c.prev) / c.prev) * 100).toFixed(1)}%
                        </span>
                      </span>
                    </div>
                    <div className={styles.costBar}>
                      <div className={styles.costFill} style={{ width: `${c.pct}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Top endpoints */}
          <div className={styles.panel} style={{ marginTop: 20 }}>
            <div className={styles.panelHeader}>
              <h2>Top Endpoints</h2>
              <span className={styles.note}>Sorted by request volume</span>
            </div>
            <div className={styles.endpointTable}>
              <div className={styles.endpointHead}>
                <span>Endpoint</span>
                <span>RPM</span>
                <span>P99 Latency</span>
                <span>Error Rate</span>
                <span>Trend</span>
              </div>
              {topEndpoints.map((e) => {
                const spark = generateSparkline(12, 30, 90);
                return (
                  <div key={e.path} className={styles.endpointRow}>
                    <code className={styles.endpoint}>{e.path}</code>
                    <span>{e.rpm}</span>
                    <span>{e.p99}</span>
                    <span>{e.errors}</span>
                    <div className={styles.miniSpark}>
                      <svg viewBox="0 0 80 24" preserveAspectRatio="none">
                        <path
                          d={spark.path.replace(/200/g, "80").replace(/40/g, "24")}
                          fill="none"
                          stroke="#4f7cff"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
