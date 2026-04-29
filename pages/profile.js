import { getServerSession } from "next-auth/next";
import { authOptions } from "./api/auth/[...nextauth]";
import Head from "next/head";
import { useState, useEffect, useCallback } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import styles from "../styles/Profile.module.css";

// ─── Server-side: pull session + prefs ───────────────────────────────────────
export async function getServerSideProps(context) {
  const session = await getServerSession(context.req, context.res, authOptions);
  if (!session) {
    return { redirect: { destination: "/auth/signin?callbackUrl=/profile", permanent: false } };
  }

  // Load prefs server-side so page renders correctly on first load
  const baseUrl = process.env.NEXTAUTH_URL || "http://localhost:3000";
  let initialPrefs = null;
  try {
    const r = await fetch(`${baseUrl}/api/preferences`, {
      headers: { cookie: context.req.headers.cookie || "" },
    });
    if (r.ok) initialPrefs = await r.json();
  } catch {}

  return {
    props: {
      serverSession: JSON.parse(JSON.stringify(session)), // serialise dates
      initialPrefs,
    },
  };
}

// ─── Helpers ─────────────────────────────────────────────────────────────────
function Badge({ children, variant = "default" }) {
  return <span className={`${styles.badge} ${styles['badge_' + variant]}`}>{children}</span>;
}

function ClaimRow({ label, value, mono = false, copyable = false }) {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard.writeText(String(value));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  if (value === undefined || value === null || value === "") return null;
  return (
    <div className={styles.claimRow}>
      <span className={styles.claimLabel}>{label}</span>
      <span className={`${styles.claimValue} ${mono ? styles.mono : ""}`}>
        {Array.isArray(value) ? value.join(", ") || "—" : String(value)}
      </span>
      {copyable && (
        <button className={styles.copyBtn} onClick={copy} title="Copy">
          {copied ? (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><path d="M2 6.5l3 3 6-6" stroke="#05b169" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          ) : (
            <svg width="13" height="13" viewBox="0 0 13 13" fill="none"><rect x="1" y="4" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.2"/><path d="M4 4V2.5A1.5 1.5 0 015.5 1H10.5A1.5 1.5 0 0112 2.5V7.5A1.5 1.5 0 0110.5 9H9" stroke="currentColor" strokeWidth="1.2"/></svg>
          )}
        </button>
      )}
    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className={styles.section}>
      <div className={styles.sectionHead}>
        <span className={styles.sectionIcon}>{icon}</span>
        <h2>{title}</h2>
      </div>
      <div className={styles.sectionBody}>{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      className={`${styles.toggle} ${checked ? styles.toggleOn : ""}`}
      onClick={() => onChange(!checked)}
    >
      <span className={styles.toggleThumb} />
    </button>
  );
}

function Select({ value, onChange, options }) {
  return (
    <select className={styles.select} value={value} onChange={e => onChange(e.target.value)}>
      {options.map(([val, label]) => <option key={val} value={val}>{label}</option>)}
    </select>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────
export default function Profile({ serverSession, initialPrefs }) {
  const u = serverSession?.user || {};
  const tk = serverSession?.token || {};

  const defaultPrefs = {
    theme: "system", emailAlerts: true, slackAlerts: false,
    weeklyDigest: true, mfaReminder: true,
    defaultDashboard: "overview", timezone: "auto",
    dateFormat: "MMM D, YYYY", language: "en",
    compactMode: false, updatedAt: null,
  };

  const [prefs, setPrefs] = useState(initialPrefs || defaultPrefs);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved]   = useState(false);
  const [dirty, setDirty]   = useState(false);
  const [activeTab, setActiveTab] = useState("identity");

  // Format token expiry
  const tokenExpiry = tk.expiresAt
    ? new Date(tk.expiresAt * 1000).toLocaleString()
    : null;

  // Update a preference field
  const setPref = useCallback((key, val) => {
    setPrefs(p => ({ ...p, [key]: val }));
    setDirty(true);
    setSaved(false);
  }, []);

  // Save preferences
  const savePrefs = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });
      if (res.ok) {
        const updated = await res.json();
        setPrefs(updated);
        setSaved(true);
        setDirty(false);
        setTimeout(() => setSaved(false), 3000);
      }
    } finally {
      setSaving(false);
    }
  };

  const initials = [u.givenName?.[0], u.familyName?.[0]].filter(Boolean).join("") ||
    u.name?.[0]?.toUpperCase() || u.email?.[0]?.toUpperCase() || "?";

  const tabs = [
    { id: "identity",    label: "Identity",    icon: "👤" },
    { id: "token",       label: "Token & Auth", icon: "🔐" },
    { id: "preferences", label: "Preferences",  icon: "⚙️" },
  ];

  return (
    <>
      <Head><title>My Profile — Nexus</title></Head>
      <Navbar />
      <main className={styles.main}>
        <div className="container">

          {/* Profile hero card */}
          <div className={styles.heroCard}>
            <div className={styles.avatarWrap}>
              <div className={styles.avatar}>{initials}</div>
              {u.emailVerified && (
                <div className={styles.verifiedBadge} title="Email verified">
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none">
                    <path d="M2 5l2 2 4-4" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
            <div className={styles.heroInfo}>
              <h1>{u.name || u.preferredUsername || u.email || "Unknown User"}</h1>
              <p className={styles.heroEmail}>{u.email}</p>
              <div className={styles.heroBadges}>
                {u.emailVerified && <Badge variant="green">✓ Verified</Badge>}
                {u.idpName && (
                  <Badge variant={u.idpName.includes("Microsoft") ? "entra" : "okta"}>
                    {u.idpName.includes("Microsoft") ? "⊞" : "○"} {u.idpName}
                  </Badge>
                )}
                {u.groups?.slice(0, 3).map(g => <Badge key={g} variant="blue">{g}</Badge>)}
                {u.amr?.includes("mfa") && <Badge variant="purple">MFA enabled</Badge>}
                {u.locale && <Badge variant="default">{u.locale}</Badge>}
              </div>
            </div>
            <div className={styles.heroActions}>
              {dirty && (
                <button
                  className={`btn btn-primary ${saving ? styles.saving : ""}`}
                  onClick={savePrefs}
                  disabled={saving}
                >
                  {saving ? "Saving…" : saved ? "✓ Saved" : "Save changes"}
                </button>
              )}
              {saved && !dirty && (
                <span className={styles.savedNote}>✓ Preferences saved</span>
              )}
            </div>
          </div>

          {/* Tabs */}
          <div className={styles.tabs}>
            {tabs.map(t => (
              <button
                key={t.id}
                className={`${styles.tab} ${activeTab === t.id ? styles.tabActive : ""}`}
                onClick={() => setActiveTab(t.id)}
              >
                <span>{t.icon}</span> {t.label}
              </button>
            ))}
          </div>

          <div className={styles.content}>

            {/* ── IDENTITY TAB ── */}
            {activeTab === "identity" && (
              <div className={styles.grid}>
                <Section title="Profile" icon="👤">
                  <ClaimRow label="Full name"           value={u.name} />
                  <ClaimRow label="Given name"          value={u.givenName} />
                  <ClaimRow label="Family name"         value={u.familyName} />
                  <ClaimRow label="Middle name"         value={u.middleName} />
                  <ClaimRow label="Nickname"            value={u.nickname} />
                  <ClaimRow label="Preferred username"  value={u.preferredUsername} />
                  <ClaimRow label="Locale"              value={u.locale} />
                  <ClaimRow label="Timezone"            value={u.zoneinfo} />
                  <ClaimRow label="Profile updated"     value={u.updatedAt ? new Date(u.updatedAt * 1000).toLocaleString() : null} />
                </Section>

                <Section title="Contact" icon="✉️">
                  <ClaimRow label="Email"               value={u.email}       copyable />
                  <ClaimRow label="Email verified"      value={u.emailVerified ? "Yes" : "No"} />
                  <ClaimRow label="Phone number"        value={u.phoneNumber} copyable />
                </Section>

                <Section title="Identity" icon="🪪">
                  <ClaimRow label="Subject (sub)"       value={u.sub}    mono copyable />
                  <ClaimRow label="Identity provider"   value={u.idp}    mono />
                  <ClaimRow label="Groups"              value={u.groups?.length ? u.groups : ["(none)"]} />
                  <ClaimRow label="Auth methods (amr)"  value={u.amr?.length   ? u.amr   : ["(none)"]} />
                  {/* Entra ID-specific */}
                  {u.tenantId && <ClaimRow label="Tenant ID (tid)"    value={u.tenantId}  mono copyable />}
                  {u.objectId && <ClaimRow label="Object ID (oid)"    value={u.objectId}  mono copyable />}
                </Section>

                <Section title="Raw OIDC Claims" icon="📄">
                  <div className={styles.rawBlock}>
                    <pre>{JSON.stringify({
                      sub:                u.sub,
                      name:               u.name,
                      given_name:         u.givenName,
                      family_name:        u.familyName,
                      preferred_username: u.preferredUsername,
                      email:              u.email,
                      email_verified:     u.emailVerified,
                      phone_number:       u.phoneNumber,
                      locale:             u.locale,
                      zoneinfo:           u.zoneinfo,
                      updated_at:         u.updatedAt,
                      groups:             u.groups,
                      amr:                u.amr,
                      idp:                u.idp,
                      idpName:            u.idpName,
                      // Entra ID only
                      tenantId:           u.tenantId || undefined,
                      objectId:           u.objectId || undefined,
                    }, null, 2)}</pre>
                    <button className={styles.copyRaw} onClick={() => {
                      navigator.clipboard.writeText(JSON.stringify(serverSession?.user, null, 2));
                    }}>Copy JSON</button>
                  </div>
                </Section>
              </div>
            )}

            {/* ── TOKEN TAB ── */}
            {activeTab === "token" && (
              <div className={styles.grid}>
                <Section title="Access Token" icon="🔑">
                  <ClaimRow label="Token type"  value={tk.tokenType} />
                  <ClaimRow label="Expires at"  value={tokenExpiry} />
                  <ClaimRow label="Scopes"      value={tk.scope} mono />
                  {tk.accessToken && (
                    <div className={styles.tokenBlock}>
                      <div className={styles.tokenLabel}>Access token (truncated)</div>
                      <div className={styles.tokenValue}>
                        {tk.accessToken.slice(0, 40)}…
                      </div>
                      <button className={styles.copyRaw} onClick={() => navigator.clipboard.writeText(tk.accessToken)}>
                        Copy full token
                      </button>
                    </div>
                  )}
                </Section>

                <Section title="Session Security" icon="🛡">
                  <ClaimRow label="Auth methods"    value={u.amr}    />
                  <ClaimRow label="MFA active"      value={u.amr?.includes("mfa") ? "Yes" : "No"} />
                  <ClaimRow label="Identity provider" value={u.idp}  mono />
                  <div className={styles.securityNote}>
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                      <circle cx="7" cy="7" r="6" stroke="#0052ff" strokeWidth="1.2"/>
                      <path d="M7 4v3M7 9v.5" stroke="#0052ff" strokeWidth="1.2" strokeLinecap="round"/>
                    </svg>
                    Token data is read-only and managed by Okta. To update your profile or reset credentials, visit your Okta user portal.
                  </div>
                </Section>

                <Section title="ID Token Claims" icon="📋">
                  <div className={styles.rawBlock}>
                    <pre>{JSON.stringify({
                      token_type: tk.tokenType,
                      scope:      tk.scope,
                      expires_at: tk.expiresAt,
                      has_access_token: !!tk.accessToken,
                      has_id_token:     !!tk.idToken,
                    }, null, 2)}</pre>
                  </div>
                </Section>
              </div>
            )}

            {/* ── PREFERENCES TAB ── */}
            {activeTab === "preferences" && (
              <div className={styles.grid}>
                <Section title="Appearance" icon="🎨">
                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Theme</span>
                      <span className={styles.prefDesc}>Choose your interface color scheme</span>
                    </div>
                    <Select
                      value={prefs.theme}
                      onChange={v => setPref("theme", v)}
                      options={[["light","Light"],["dark","Dark"],["system","System"]]}
                    />
                  </div>
                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Compact mode</span>
                      <span className={styles.prefDesc}>Reduce spacing and padding across the UI</span>
                    </div>
                    <Toggle checked={prefs.compactMode} onChange={v => setPref("compactMode", v)} />
                  </div>
                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Language</span>
                      <span className={styles.prefDesc}>Interface display language</span>
                    </div>
                    <Select
                      value={prefs.language}
                      onChange={v => setPref("language", v)}
                      options={[["en","English"],["es","Español"],["fr","Français"],["de","Deutsch"],["ja","日本語"]]}
                    />
                  </div>
                </Section>

                <Section title="Notifications" icon="🔔">
                  {[
                    { key: "emailAlerts",  label: "Email alerts",    desc: "Receive critical alerts via email" },
                    { key: "slackAlerts",  label: "Slack alerts",    desc: "Send alerts to your connected Slack workspace" },
                    { key: "weeklyDigest", label: "Weekly digest",   desc: "Summary of your infrastructure health every Monday" },
                    { key: "mfaReminder",  label: "MFA reminders",   desc: "Remind me to review MFA device enrollment" },
                  ].map(({ key, label, desc }) => (
                    <div key={key} className={styles.prefRow}>
                      <div className={styles.prefInfo}>
                        <span className={styles.prefLabel}>{label}</span>
                        <span className={styles.prefDesc}>{desc}</span>
                      </div>
                      <Toggle checked={!!prefs[key]} onChange={v => setPref(key, v)} />
                    </div>
                  ))}
                </Section>

                <Section title="Dashboard" icon="📊">
                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Default view</span>
                      <span className={styles.prefDesc}>Which page loads after sign-in</span>
                    </div>
                    <Select
                      value={prefs.defaultDashboard}
                      onChange={v => setPref("defaultDashboard", v)}
                      options={[["overview","Overview"],["analytics","Analytics"]]}
                    />
                  </div>
                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Timezone</span>
                      <span className={styles.prefDesc}>Override automatic timezone detection</span>
                    </div>
                    <Select
                      value={prefs.timezone}
                      onChange={v => setPref("timezone", v)}
                      options={[
                        ["auto","Auto (browser)"],
                        ["UTC","UTC"],
                        ["America/New_York","US Eastern"],
                        ["America/Chicago","US Central"],
                        ["America/Denver","US Mountain"],
                        ["America/Los_Angeles","US Pacific"],
                        ["Europe/London","London"],
                        ["Europe/Paris","Paris"],
                        ["Asia/Tokyo","Tokyo"],
                        ["Australia/Sydney","Sydney"],
                      ]}
                    />
                  </div>
                  <div className={styles.prefRow}>
                    <div className={styles.prefInfo}>
                      <span className={styles.prefLabel}>Date format</span>
                      <span className={styles.prefDesc}>How dates are displayed across the app</span>
                    </div>
                    <Select
                      value={prefs.dateFormat}
                      onChange={v => setPref("dateFormat", v)}
                      options={[
                        ["MMM D, YYYY","Jan 1, 2025"],
                        ["DD/MM/YYYY","01/01/2025"],
                        ["MM/DD/YYYY","01/01/2025 (US)"],
                        ["YYYY-MM-DD","2025-01-01 (ISO)"],
                      ]}
                    />
                  </div>
                </Section>

                {prefs.updatedAt && (
                  <div className={styles.prefsMeta}>
                    Last saved: {new Date(prefs.updatedAt).toLocaleString()}
                  </div>
                )}

                <div className={styles.saveBar}>
                  <button
                    className={`btn btn-primary ${!dirty ? styles.btnDisabled : ""}`}
                    onClick={savePrefs}
                    disabled={!dirty || saving}
                  >
                    {saving ? "Saving…" : "Save preferences"}
                  </button>
                  {saved && <span className={styles.savedNote}>✓ Preferences saved successfully</span>}
                  {dirty && !saved && <span className={styles.dirtyNote}>You have unsaved changes</span>}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
