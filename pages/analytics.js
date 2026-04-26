import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Analytics.module.css";

export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/signin?callbackUrl=/analytics", permanent: false } };
  }
  const user = {
    name:  session?.user?.name  || session?.user?.email?.split("@")[0] || "User",
    email: session?.user?.email || null,
  };
  return { props: { user } };
}

const topEndpoints = [
  { path: "/api/v2/events",   rpm: "48,291", p99: "12ms",  errors: "0.00%", trend: [60,72,65,80,75,85,88,82,90,85,92,89] },
  { path: "/api/v2/metrics",  rpm: "31,047", p99: "18ms",  errors: "0.01%", trend: [50,55,48,60,58,62,65,60,70,68,72,75] },
  { path: "/api/v2/traces",   rpm: "22,183", p99: "24ms",  errors: "0.00%", trend: [40,45,42,50,48,55,52,58,56,60,58,62] },
  { path: "/api/v2/alerts",   rpm: "8,492",  p99: "9ms",   errors: "0.03%", trend: [30,28,32,30,35,33,38,36,40,38,42,40] },
  { path: "/api/v2/runbooks", rpm: "2,841",  p99: "45ms",  errors: "0.09%", trend: [20,22,19,25,23,27,25,28,26,30,28,32] },
];

const costData = [
  { service: "Compute",  current: 12400, prev: 13100, pct: 74 },
  { service: "Storage",  current: 2800,  prev: 2650,  pct: 17 },
  { service: "Network",  current: 980,   prev: 920,   pct: 6  },
  { service: "Other",    current: 520,   prev: 510,   pct: 3  },
];

function Spark({ data }) {
  const max = Math.max(...data), min = Math.min(...data);
  const w = 80, h = 28;
  const step = w / (data.length - 1);
  const pts = data.map((v, i) => `${i * step},${h - ((v - min) / (max - min || 1)) * h}`).join(" ");
  return (
    <svg viewBox={`0 0 ${w} ${h}`} style={{ width: w, height: h, display: "block" }} preserveAspectRatio="none">
      <polyline points={pts} fill="none" stroke="#0052ff" strokeWidth="1.5" strokeLinejoin="round" strokeLinecap="round"/>
    </svg>
  );
}

export default function Analytics({ user }) {
  return (
    <>
      <Head><title>Analytics — Nexus</title></Head>
      <Navbar />
      <main className={styles.main}>
        <div className="container">
          <div className={styles.pageHead}>
            <div>
              <p className={styles.eyebrow}>Insights</p>
              <h1 className={styles.pageTitle}>Analytics</h1>
              <p className={styles.pageDesc}>Performance and cost data across all services.</p>
            </div>
            <div className={styles.controls}>
              <select className={styles.select}>
                <option>Last 24 hours</option>
                <option>Last 7 days</option>
                <option>Last 30 days</option>
              </select>
              <button className="btn btn-secondary btn-sm">Export CSV</button>
            </div>
          </div>

          {/* Metric tiles */}
          <div className={styles.tiles}>
            {[
              { label: "Total Requests",   value: "4.2B",   change: "+8.4%", good: true  },
              { label: "Avg Response",     value: "22ms",   change: "−3ms",  good: true  },
              { label: "Error Rate",       value: "0.08%",  change: "−0.02%",good: true  },
              { label: "Data Ingested",    value: "1.8TB",  change: "+12%",  good: true  },
            ].map(t => (
              <div key={t.label} className={styles.tile}>
                <span className={styles.tileLabel}>{t.label}</span>
                <span className={styles.tileValue}>{t.value}</span>
                <span className={`${styles.tileChange} ${t.good ? styles.good : styles.bad}`}>{t.change} vs yesterday</span>
              </div>
            ))}
          </div>

          {/* Charts row */}
          <div className={styles.chartsRow}>
            {/* Traffic chart */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h2>Request Volume</h2>
                  <p className={styles.cardSub}>Last 24 hours</p>
                </div>
                <div className={styles.legend}>
                  <span className={styles.legendItem}><span style={{background:"#0052ff"}}/> Requests</span>
                  <span className={styles.legendItem}><span style={{background:"#ef4444"}}/> Errors</span>
                </div>
              </div>
              <div className={styles.chartWrap}>
                <svg viewBox="0 0 560 120" preserveAspectRatio="none" className={styles.chart}>
                  <defs>
                    <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#0052ff" stopOpacity="0.12"/>
                      <stop offset="100%" stopColor="#0052ff" stopOpacity="0"/>
                    </linearGradient>
                  </defs>
                  {[30, 60, 90].map(y => <line key={y} x1="0" y1={y} x2="560" y2={y} stroke="#f1f5f9" strokeWidth="1"/>)}
                  <path d="M0,95 C30,88 60,55 90,50 C120,45 150,65 180,60 C210,55 240,28 270,24 C300,20 330,38 360,33 C390,28 420,18 450,20 C480,22 510,42 560,35 L560,120 L0,120Z" fill="url(#ag)"/>
                  <path d="M0,95 C30,88 60,55 90,50 C120,45 150,65 180,60 C210,55 240,28 270,24 C300,20 330,38 360,33 C390,28 420,18 450,20 C480,22 510,42 560,35" fill="none" stroke="#0052ff" strokeWidth="2"/>
                  <path d="M0,118 C80,116 160,115 240,114 C320,113 400,112 480,111 C510,111 540,110 560,110" fill="none" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4 3"/>
                </svg>
                <div className={styles.xLabels}>
                  {["00:00","04:00","08:00","12:00","16:00","20:00","Now"].map(t => <span key={t}>{t}</span>)}
                </div>
              </div>
            </div>

            {/* Cost */}
            <div className={styles.card}>
              <div className={styles.cardHead}>
                <div>
                  <h2>Cost Breakdown</h2>
                  <p className={styles.cardSub}>Current month</p>
                </div>
                <span className={styles.totalCost}>$16,700 / mo</span>
              </div>
              <div className={styles.costList}>
                {costData.map(c => {
                  const saved = c.current < c.prev;
                  const pctChange = ((Math.abs(c.current - c.prev) / c.prev) * 100).toFixed(1);
                  return (
                    <div key={c.service} className={styles.costRow}>
                      <div className={styles.costMeta}>
                        <span className={styles.costSvc}>{c.service}</span>
                        <span className={styles.costRight}>
                          <strong>${c.current.toLocaleString()}</strong>
                          <span className={saved ? styles.good : styles.bad}>{saved ? "↓" : "↑"}{pctChange}%</span>
                        </span>
                      </div>
                      <div className={styles.barTrack}>
                        <div className={styles.barFill} style={{ width: `${c.pct}%` }}/>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Endpoints table */}
          <div className={`${styles.card} ${styles.endpointCard}`}>
            <div className={styles.cardHead}>
              <div>
                <h2>Top Endpoints</h2>
                <p className={styles.cardSub}>Sorted by request volume</p>
              </div>
            </div>
            <div className={styles.epTable}>
              <div className={styles.epHead}>
                <span>Endpoint</span><span>RPM</span><span>P99</span><span>Errors</span><span>Trend</span>
              </div>
              {topEndpoints.map(e => (
                <div key={e.path} className={styles.epRow}>
                  <code className={styles.epPath}>{e.path}</code>
                  <span>{e.rpm}</span>
                  <span>{e.p99}</span>
                  <span className={e.errors === "0.00%" ? "" : styles.warnText}>{e.errors}</span>
                  <Spark data={e.trend}/>
                </div>
              ))}
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  );
}
