import NextAuth from "next-auth";
import OktaProvider from "next-auth/providers/okta";

// ── Microsoft Entra External ID (CIAM) ───────────────────────────────────────
// The built-in AzureADProvider targets login.microsoftonline.com, which is NOT
// valid for External ID (CIAM) tenants.  CIAM tenants use a custom authority:
//   https://<subdomain>.ciamlogin.com/<tenantId>
//
// We therefore define a fully custom OAuth 2.0 / OIDC provider instead.
// The provider id is "microsoft-entra-external" — update your Azure App
// Registration redirect URI accordingly:
//   http://localhost:3000/api/auth/callback/microsoft-entra-external   (dev)
//   https://your-app.com/api/auth/callback/microsoft-entra-external    (prod)
// ─────────────────────────────────────────────────────────────────────────────

const tenantId        = process.env.ENTRA_TENANT_ID;
const tenantSubdomain = process.env.ENTRA_TENANT_SUBDOMAIN; // e.g. "mytenant" from mytenant.ciamlogin.com
const ciamBaseUrl     = `https://${tenantSubdomain}.ciamlogin.com/${tenantId}`;

const EntraCIAMProvider = {
  id:   "microsoft-entra-external",
  name: "Microsoft",
  type: "oauth",

  clientId:     process.env.ENTRA_CLIENT_ID,
  clientSecret: process.env.ENTRA_CLIENT_SECRET,

  // CIAM OpenID Connect discovery document
  wellKnown: `${ciamBaseUrl}/v2.0/.well-known/openid-configuration`,

  authorization: {
    url: `${ciamBaseUrl}/oauth2/v2.0/authorize`,
    params: {
      scope: "openid profile email offline_access",
    },
  },

  token:    `${ciamBaseUrl}/oauth2/v2.0/token`,
  userinfo: "https://graph.microsoft.com/oidc/userinfo",

  // Use PKCE + state for security (required by CIAM)
  checks:  ["pkce", "state"],
  idToken: true,

  profile(profile) {
    return {
      id:    profile.sub,
      name:  profile.name ?? profile.preferred_username,
      email: profile.email ?? profile.preferred_username,
      image: null,
    };
  },
};

export const authOptions = {
  providers: [
    // ── Provider 1: Okta ──────────────────────────────────────────────────────
    OktaProvider({
      clientId:     process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
      issuer:       process.env.OKTA_ISSUER,
      authorization: {
        params: {
          scope: "openid profile email groups offline_access",
        },
      },
    }),

    // ── Provider 2: Microsoft Entra External ID (CIAM) ────────────────────────
    EntraCIAMProvider,
  ],

  callbacks: {
    // ── jwt ───────────────────────────────────────────────────────────────────
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider    = account.provider;   // "okta" | "microsoft-entra-external"
        token.accessToken = account.access_token;
        token.idToken     = account.id_token;
        token.tokenType   = account.token_type;
        token.expiresAt   = account.expires_at;
        token.scope       = account.scope;
      }

      if (profile) {
        // ── Common OIDC claims (both providers) ──────────────────────────────
        token.sub           = profile.sub;
        token.name          = profile.name;
        token.email         = profile.email ?? profile.preferred_username;
        token.emailVerified = profile.email_verified ?? false;
        token.locale        = profile.locale;
        token.updatedAt     = profile.updated_at;

        if (account?.provider === "okta") {
          // ── Okta-specific ──────────────────────────────────────────────────
          token.givenName         = profile.given_name;
          token.familyName        = profile.family_name;
          token.middleName        = profile.middle_name;
          token.nickname          = profile.nickname;
          token.preferredUsername = profile.preferred_username;
          token.phoneNumber       = profile.phone_number;
          token.zoneinfo          = profile.zoneinfo;
          token.groups            = profile.groups || [];
          token.amr               = profile.amr    || [];
          token.idp               = profile.idp;
          token.idpName           = "Okta";

        } else if (account?.provider === "microsoft-entra-external") {
          // ── Entra External ID (CIAM) specific ────────────────────────────
          token.givenName         = profile.given_name;
          token.familyName        = profile.family_name;
          token.preferredUsername = profile.preferred_username ?? profile.email;
          token.phoneNumber       = null;
          token.zoneinfo          = null;
          token.middleName        = null;
          token.nickname          = null;
          token.groups            = profile.groups || [];
          token.tenantId          = profile.tid;
          token.objectId          = profile.oid;
          token.amr               = profile.amr || [];
          token.idp               = `https://${tenantSubdomain}.ciamlogin.com/${profile.tid}`;
          token.idpName           = "Microsoft Entra External ID";
        }
      }

      return token;
    },

    // ── session ───────────────────────────────────────────────────────────────
    async session({ session, token }) {
      session.provider = token.provider;

      session.user = {
        ...session.user,
        sub:               token.sub,
        name:              token.name,
        givenName:         token.givenName,
        familyName:        token.familyName,
        middleName:        token.middleName,
        nickname:          token.nickname,
        preferredUsername: token.preferredUsername,
        email:             token.email,
        emailVerified:     token.emailVerified,
        phoneNumber:       token.phoneNumber,
        locale:            token.locale,
        zoneinfo:          token.zoneinfo,
        updatedAt:         token.updatedAt,
        groups:            token.groups    || [],
        amr:               token.amr       || [],
        idp:               token.idp,
        idpName:           token.idpName,
        tenantId:          token.tenantId  || null,
        objectId:          token.objectId  || null,
      };

      session.token = {
        accessToken: token.accessToken,
        idToken:     token.idToken,
        tokenType:   token.tokenType,
        expiresAt:   token.expiresAt,
        scope:       token.scope,
      };

      return session;
    },
  },

  pages: {
    signIn: "/auth/signin",
    error:  "/auth/error",
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default NextAuth(authOptions);
