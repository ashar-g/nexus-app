import NextAuth from "next-auth";
import OktaProvider from "next-auth/providers/okta";
import AzureADProvider from "next-auth/providers/azure-ad";

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

    // ── Provider 2: Microsoft Entra ID (Azure AD) ─────────────────────────────
    // next-auth's "azure-ad" provider implements the OIDC Authorization Code
    // flow against https://login.microsoftonline.com/{tenantId}/v2.0
    AzureADProvider({
      clientId:     process.env.ENTRA_CLIENT_ID,
      clientSecret: process.env.ENTRA_CLIENT_SECRET,
      tenantId:     process.env.ENTRA_TENANT_ID,
      // Request the profile, email, and offline_access scopes.
      // "User.Read" lets us fetch extra graph claims if needed later.
      authorization: {
        params: {
          scope: "openid profile email offline_access User.Read",
        },
      },
      // Entra returns a versioned profile endpoint — tell next-auth to use v2.0
      profileUrl: "https://graph.microsoft.com/oidc/userinfo",
    }),
  ],

  callbacks: {
    // ── jwt ───────────────────────────────────────────────────────────────────
    // Called whenever a JWT is created or updated.  `account.provider` tells us
    // which IDP was used so we can normalise the claim shapes.
    async jwt({ token, account, profile }) {
      if (account) {
        token.provider    = account.provider;   // "okta" | "azure-ad"
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

        } else if (account?.provider === "azure-ad") {
          // ── Entra ID / Microsoft-specific ────────────────────────────────
          // Entra uses different claim names — map to our canonical shape
          token.givenName         = profile.given_name;
          token.familyName        = profile.family_name;
          token.preferredUsername = profile.preferred_username ?? profile.email;
          // Entra does not provide phone_number or zoneinfo in the userinfo
          // endpoint by default — these require Microsoft Graph API calls
          token.phoneNumber       = null;
          token.zoneinfo          = null;
          token.middleName        = null;
          token.nickname          = null;
          // Entra puts groups in the access token if configured in the app manifest
          // (requires "groupMembershipClaims": "SecurityGroup" in the manifest)
          token.groups            = profile.groups || [];
          // Entra uses "tid" for tenant ID and "oid" for the object ID
          token.tenantId          = profile.tid;
          token.objectId          = profile.oid;
          token.amr               = profile.amr || [];
          token.idp               = `https://login.microsoftonline.com/${profile.tid}`;
          token.idpName           = "Microsoft Entra ID";
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
        // Entra-only fields (null for Okta sessions)
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
