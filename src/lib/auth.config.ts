import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import CognitoProvider from 'next-auth/providers/cognito';
import KeycloakProvider, {
  KeycloakProfile
} from 'next-auth/providers/keycloak';
import { AdapterSession, JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
    id_token?: string;
    provider?: string;
  }
}
declare module 'next-auth/jwt' {
  interface AdapterSession {
    id_token?: string;
    provider?: string;
  }
}

const authConfig = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_ID!,
      clientSecret: process.env.KEYCLOAK_SECRET!,
      issuer: process.env.KEYCLOAK_ISSUER!
    }),
    CognitoProvider({
      clientId: process.env.COGNITO_CLIENT_ID!,
      // clientSecret: process.env.COGNITO_CLIENT_SECRET!,
      issuer: process.env.COGNITO_ISSUER!,
      // redirectProxyUrl: 'http://localhost:3000/api/auth/callback/cognito',
      authorization: { params: { scope: 'openid email phone' } }
    }),
    GithubProvider({}),
    CredentialProvider({
      credentials: {
        email: {
          type: 'email'
        },
        password: {
          type: 'password'
        }
      },
      async authorize(credentials, req) {
        const user = {
          id: '1',
          name: 'John',
          email: credentials?.email as string
        };
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET, // ここが必要！
  debug: true,
  events: {
    async signOut(token: JWT) {
      const tokenActual: JWT = token.token as JWT;
      console.log(
        '-----------------signOut 実行--------------------',
        tokenActual
      );
      console.log(tokenActual.provider);
      console.log(tokenActual.provider == 'keycloak');
      if (tokenActual.provider == 'keycloak') {
        // const issuerUrl = (
        //   authConfig.providers.find(
        //     (p) => p.id === 'keycloak'
        //   ) as OAuthConfig<KeycloakProfile>
        // ).options!.issuer!;
        // const logOutUrl = new URL(
        //   `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`
        // );
        // logOutUrl.searchParams.set('id_token_hint', tokenActual.id_token!);
        // console.log('logOutUrl', logOutUrl);
        // const result = await fetch(logOutUrl);
        // console.log('result', result);

        // Sign out from auth provider
        const logoutEndpointUrl =
          process.env.KEYCLOAK_LOGOUT_ENDPOINT_URL || '';
        const params = new URLSearchParams({
          client_id: process.env.KEYCLOAK_ID || '',
          client_secret: process.env.KEYCLOAK_SECRET ?? '',
          refresh_token: tokenActual.refreshToken as string
        });

        // const params = new URLSearchParams({
        //   client_id: process.env.KEYCLOAK_ID || '',
        //   redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/keycloak`,
        //   response_type: 'code'
        // });
        console.log('logoutEndpointUrl', logoutEndpointUrl, params);
        const logoutResult = await fetch(logoutEndpointUrl, {
          method: 'POST',
          // body: JSON.stringify(params),
          body: params,
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        });
        console.log('logoutResult', logoutResult);
      }
    }
  },
  callbacks: {
    async jwt({ token, account }) {
      console.log('account', account);
      if (account) {
        console.log('account.access_token', account.access_token);
        console.log('account.refresh_token', account.refresh_token);
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
        console.log('token.access_token', token.accessToken);
        console.log('token.refresh_token', token.refreshToken);
      }
      return token;
    },
    async session({ session, token }) {
      // session.sessionToken = token.accessToken as string;
      session.sessionToken = token.refreshToken as string;
      return session;
    },
    redirect({ url, baseUrl }) {
      // Sign out from OAuth provider (KeyCloak)
      // call `signOut({ callbackUrl: "signOut" });` then this callback called
      // https://github.com/nextauthjs/next-auth/discussions/3938#discussioncomment-2231398
      if (url.startsWith(baseUrl)) return url;
      if (url === 'signOut' && process.env.KEYCLOAK_LOGOUT_ENDPOINT_URL) {
        // Sign out from auth provider
        const logoutEndpointUrl =
          process.env.KEYCLOAK_LOGOUT_ENDPOINT_URL || '';
        const params = {
          client_id: process.env.KEYCLOAK_ID || '',
          redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/keycloak`
          // refresh_token: get
        };
        // const params = new URLSearchParams({
        //   client_id: process.env.KEYCLOAK_ID || '',
        //   redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/keycloak`,
        //   response_type: 'code'
        // });
        // fetch(`${baseUrl}/api/auth/logout`, {
        //   method: 'POST',
        //   body: JSON.stringify(params)
        // });
        // return `${logoutEndpointUrl}?${params.toString()}`;
      }
      // Allows relative callback URLs
      if (url.startsWith('/')) return new URL(url, baseUrl).toString();
      // Redirect to root when the redirect URL is still an external domain
      return baseUrl;
    }
  },
  pages: {
    signIn: '/', //sigin page
    signOut: '/dashboard' // sign out page
  }
} satisfies NextAuthConfig;

export default authConfig;
