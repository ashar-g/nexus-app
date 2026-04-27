import NextAuth from "next-auth";
import OktaProvider from "next-auth/providers/okta";

export const authOptions = {
  providers: [
    OktaProvider({
      clientId: process.env.OKTA_CLIENT_ID,
      clientSecret: process.env.OKTA_CLIENT_SECRET,
      issuer: process.env.OKTA_ISSUER,
      // Request all standard OIDC scopes so we get the full profile
      authorization: {
        params: {
          scope: "openid profile email groups offline_access",
        },
      },
    }),
  ],
  callbacks: {
    async jwt({ token, account, profile }) {
      if (account) {
        token.accessToken  = account.access_token;
        token.idToken      = account.id_token;
        token.tokenType    = account.token_type;
        token.expiresAt    = account.expires_at;
        token.scope        = account.scope;
      }
      if (profile) {
        // Standard OIDC claims
        token.sub            = profile.sub;
        token.name           = profile.name;
        token.givenName      = profile.given_name;
        token.familyName     = profile.family_name;
        token.middleName     = profile.middle_name;
        token.nickname       = profile.nickname;
        token.preferredUsername = profile.preferred_username;
        token.email          = profile.email;
        token.emailVerified  = profile.email_verified;
        token.phoneNumber    = profile.phone_number;
        token.locale         = profile.locale;
        token.zoneinfo       = profile.zoneinfo;
        token.updatedAt      = profile.updated_at;
        // Okta-specific claims
        token.groups         = profile.groups || [];
        token.amr            = profile.amr    || [];   // auth methods (e.g. ["pwd", "mfa"])
        token.idp            = profile.idp;
        token.at_hash        = profile.at_hash;
      }
      return token;
    },
    async session({ session, token }) {
      // Attach everything to the session so pages can read it server-side
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
        groups:            token.groups  || [],
        amr:               token.amr     || [],
        idp:               token.idp,
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
