# Nexus — Tech App with Okta OIDC Auth

A production-ready 4-page Next.js application with enterprise Okta SSO authentication. Built for deployment on Vercel.

## Pages

| Page | Route | Access |
|------|--------|--------|
| Home | `/` | 🌐 Public |
| Features | `/features` | 🌐 Public |
| Dashboard | `/dashboard` | 🔒 Requires Login |
| Analytics | `/analytics` | 🔒 Requires Login |

## Tech Stack

- **Framework**: Next.js 14 (Pages Router)
- **Auth**: NextAuth.js v4 with Okta OIDC provider
- **Styling**: CSS Modules + CSS Variables
- **Fonts**: Syne (display) + DM Sans (body)
- **Deployment**: Vercel

---

## Setup Guide

### 1. Clone & Install

```bash
git clone https://github.com/YOUR_USERNAME/nexus-app.git
cd nexus-app
npm install
```

### 2. Configure Okta

#### A. Create an Okta Developer Account
1. Go to [developer.okta.com](https://developer.okta.com) and sign up for free
2. Your Okta domain will be something like `dev-12345678.okta.com`

#### B. Create an OIDC Application in Okta
1. In Okta Admin Console: **Applications → Create App Integration**
2. Choose **OIDC - OpenID Connect** → **Web Application**
3. Configure:
   - **App name**: Nexus App
   - **Grant type**: Authorization Code
   - **Sign-in redirect URIs**:
     - `http://localhost:3000/api/auth/callback/okta` (development)
     - `https://your-app.vercel.app/api/auth/callback/okta` (production)
   - **Sign-out redirect URIs**:
     - `http://localhost:3000`
     - `https://your-app.vercel.app`
4. **Save** and note down:
   - **Client ID**
   - **Client Secret**
   - Your **Okta domain** (e.g. `dev-12345678.okta.com`)

### 3. Set Environment Variables

Copy the example file and fill in your values:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

```env
OKTA_CLIENT_ID=0oaXXXXXXXXXXXXXXXXX
OKTA_CLIENT_SECRET=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
OKTA_ISSUER=https://dev-12345678.okta.com/oauth2/default

NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=<run: openssl rand -base64 32>
```

Generate a secure `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

### Option A: Via Vercel CLI

```bash
npm install -g vercel
vercel
```

### Option B: Via GitHub

1. Push to GitHub:
```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/YOUR_USERNAME/nexus-app.git
git push -u origin main
```

2. Go to [vercel.com](https://vercel.com) → **New Project** → Import your GitHub repo

3. Add Environment Variables in Vercel dashboard:
   - `OKTA_CLIENT_ID`
   - `OKTA_CLIENT_SECRET`
   - `OKTA_ISSUER`
   - `NEXTAUTH_URL` → set to your Vercel URL (e.g. `https://nexus-app.vercel.app`)
   - `NEXTAUTH_SECRET`

4. Deploy!

5. **Update Okta** with your production callback URL:
   - In Okta Admin Console, add `https://your-app.vercel.app/api/auth/callback/okta` to redirect URIs

---

## Project Structure

```
nexus-app/
├── pages/
│   ├── api/
│   │   └── auth/
│   │       └── [...nextauth].js    # NextAuth + Okta config
│   ├── auth/
│   │   ├── signin.js               # Custom sign-in page
│   │   └── error.js                # Auth error page
│   ├── _app.js                     # App wrapper with SessionProvider
│   ├── index.js                    # Home (public)
│   ├── features.js                 # Features (public)
│   ├── dashboard.js                # Dashboard (protected)
│   ├── analytics.js                # Analytics (protected)
│   └── 404.js                      # Custom 404
├── components/
│   ├── Navbar.js                   # Navigation with auth state
│   ├── Navbar.module.css
│   ├── Footer.js
│   └── Footer.module.css
├── styles/
│   ├── globals.css                 # Design tokens + global styles
│   ├── Home.module.css
│   ├── Features.module.css
│   ├── Dashboard.module.css
│   ├── Analytics.module.css
│   ├── SignIn.module.css
│   └── AuthError.module.css
├── .env.local.example              # Template — copy to .env.local
├── .gitignore                      # Excludes .env.local
├── next.config.js
└── package.json
```

## How Auth Works

1. User visits `/dashboard` or `/analytics`
2. `getServerSideProps` calls `getServerSession` — if no session, redirects to `/auth/signin`
3. Sign-in page calls `signIn("okta")` which initiates OIDC flow with Okta
4. Okta authenticates and redirects back to `/api/auth/callback/okta`
5. NextAuth creates a session and redirects to the original protected page
6. Session is available via `useSession()` client-side or `getServerSession()` server-side

## Security Notes

- ✅ `.env.local` is gitignored — secrets never committed
- ✅ Protected pages use server-side session check (not client-side only)
- ✅ NEXTAUTH_SECRET should be a strong random string (use `openssl rand -base64 32`)
- ✅ OIDC with PKCE via Okta — industry standard enterprise auth
