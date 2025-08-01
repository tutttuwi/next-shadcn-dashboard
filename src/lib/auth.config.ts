import { NextAuthConfig } from 'next-auth';
import CredentialProvider from 'next-auth/providers/credentials';
import GithubProvider from 'next-auth/providers/github';
import CognitoProvider from 'next-auth/providers/cognito';
import KeycloakProvider from 'next-auth/providers/keycloak';
import { JWT } from 'next-auth/jwt';

declare module 'next-auth/jwt' {
  interface JWT {
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
  secret: process.env.NEXTAUTH_SECRET, // シークレット指定必須
  debug: true,
  events: {
    /**
     * サインアウトイベント発生時
     * フェデレーションサインアウトを実施
     *
     * メッセージオブジェクトには、JWTセッションを使うかデータベース永続化セッションを使うかによって、これらのいずれかが含まれます：
     * トークン： このセッションのJWT。
     * セッション： 終了するアダプタのセッション・オブジェクト。
     * @param message
     */
    async signOut(message: any) {
      const token: JWT = message.token as JWT;
      console.log('-----------------signOut 実行--------------------', token);
      if (token.provider === 'keycloak') {
        // フェデレーションサインアウト（KeyCloak）
        // GETリクエストでサインアウトできないため本メソッドでPOSTリクエストを実施
        const logoutEndpointUrl =
          process.env.KEYCLOAK_LOGOUT_ENDPOINT_URL || '';
        const params = new URLSearchParams({
          client_id: process.env.KEYCLOAK_ID || '',
          client_secret: process.env.KEYCLOAK_SECRET ?? '',
          refresh_token: token.refreshToken as string
        });
        // console.log('signOut request param', logoutEndpointUrl, params);
        const logoutResult = await fetch(logoutEndpointUrl, {
          method: 'POST',
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
    /**
     * このコールバックは、JSON Web Token が作成されたとき（サインイン時など）や更新されたとき
     * （クライアントでセッションにアクセスしたときなど）に呼び出されます。ここで返されるものはすべて JWT に保存され、
     * セッション・コールバックに転送されます。そこで、クライアントに返すべきものを制御できます。
     * それ以外のものは、フロントエンドから保持されます。JWTはデフォルトでAUTH_SECRET環境変数によって暗号化されます。
     * @param params
     * @returns
     */
    async jwt({ token, account }) {
      console.log('account', account);
      if (account) {
        // console.log('account.access_token', account.access_token);
        // console.log('account.refresh_token', account.refresh_token);
        token.accessToken = account.access_token;
        token.refreshToken = account.refresh_token;
        token.provider = account.provider;
        // console.log('token.access_token', token.accessToken);
        // console.log('token.refresh_token', token.refreshToken);
      }
      return token;
    },
    async session({ session, token }) {
      // session.sessionToken = token.accessToken as string;
      session.sessionToken = token.refreshToken as string;
      return session;
    },
    /**
     * このコールバックは、ユーザーがコールバックURLにリダイレクトされるたびに呼び出されます（サインイン時やサインアウト時など）。
     * デフォルトでは、オリジンと同じホスト上のURLのみが許可されます。
     * このコールバックを使用して、その動作をカスタマイズすることができます。
     * @param param0
     * @returns
     */
    redirect({ url, baseUrl }) {
      // リダイレクトでKeCloakのフェデレーションサインアウトを実現しようとしたが、
      // GETリクエストでKeyCloakのlogoutURLにリダイレクトするとログアウトしますか？画面を挟まないといけないため断念した
      // ログアウトしますかという画面を挟みたい場合はこちらの解決策が適している
      // Sign out from OAuth provider (KeyCloak)
      // call `signOut({ callbackUrl: "signOut" });` then this callback called
      // https://github.com/nextauthjs/next-auth/discussions/3938#discussioncomment-2231398
      console.log(
        '------------- redirect called!! -------------',
        url,
        baseUrl
      );
      if (url.startsWith(baseUrl)) return url;
      // if (url === 'signOut' && process.env.KEYCLOAK_LOGOUT_ENDPOINT_URL) {
      //   // Sign out from auth provider
      //   const logoutEndpointUrl =
      //     process.env.KEYCLOAK_LOGOUT_ENDPOINT_URL || '';
      //   const params = {
      //     client_id: process.env.KEYCLOAK_ID || '',
      //     redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/keycloak`
      //     // refresh_token: get
      //   };
      //   // const params = new URLSearchParams({
      //   //   client_id: process.env.KEYCLOAK_ID || '',
      //   //   redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/keycloak`,
      //   //   response_type: 'code'
      //   // });
      //   // fetch(`${baseUrl}/api/auth/logout`, {
      //   //   method: 'POST',
      //   //   body: JSON.stringify(params)
      //   // });
      //   // return `${logoutEndpointUrl}?${params.toString()}`;
      // }
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
