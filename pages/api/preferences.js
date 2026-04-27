import { getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import fs from "fs";
import path from "path";

// File-based store — swap for DB (Postgres, Supabase, etc.) in production
const STORE_DIR = path.join(process.cwd(), ".preferences");

function storePath(userId) {
  // Sanitise the userId so it's safe as a filename
  const safe = userId.replace(/[^a-zA-Z0-9_-]/g, "_");
  return path.join(STORE_DIR, `${safe}.json`);
}

function readPrefs(userId) {
  try {
    const raw = fs.readFileSync(storePath(userId), "utf8");
    return JSON.parse(raw);
  } catch {
    return defaultPrefs();
  }
}

function writePrefs(userId, prefs) {
  if (!fs.existsSync(STORE_DIR)) fs.mkdirSync(STORE_DIR, { recursive: true });
  fs.writeFileSync(storePath(userId), JSON.stringify(prefs, null, 2));
}

function defaultPrefs() {
  return {
    theme:             "system",   // light | dark | system
    emailAlerts:       true,
    slackAlerts:       false,
    weeklyDigest:      true,
    mfaReminder:       true,
    defaultDashboard:  "overview", // overview | analytics
    timezone:          "auto",
    dateFormat:        "MMM D, YYYY",
    language:          "en",
    compactMode:       false,
    updatedAt:         null,
  };
}

export default async function handler(req, res) {
  const session = await getServerSession(req, res, authOptions);
  if (!session) return res.status(401).json({ error: "Unauthenticated" });

  const userId = session.user?.sub || session.user?.email;
  if (!userId) return res.status(400).json({ error: "No user identifier" });

  if (req.method === "GET") {
    return res.status(200).json(readPrefs(userId));
  }

  if (req.method === "PUT") {
    const current = readPrefs(userId);
    const allowed = Object.keys(defaultPrefs());
    const updates = {};
    for (const key of allowed) {
      if (key in req.body) updates[key] = req.body[key];
    }
    const next = { ...current, ...updates, updatedAt: new Date().toISOString() };
    writePrefs(userId, next);
    return res.status(200).json(next);
  }

  res.setHeader("Allow", ["GET", "PUT"]);
  return res.status(405).json({ error: "Method not allowed" });
}
