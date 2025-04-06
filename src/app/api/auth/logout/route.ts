// フェデレーションサインアウトを実現しようとしたが
// getTokenで取得したトークン値がNullになってしまうため廃止

// // Sign out from OIDC provider (Cognito)
// // redirected from signOut() like `signOut({ redirect: true, callbackUrl: "/api/auth/logout", });`
// import type { NextApiRequest, NextApiResponse } from 'next';
// import { getToken } from 'next-auth/jwt';
// import { NextResponse } from 'next/server';

// const logoutEndpointUrl = process.env.COGNITO_LOGOUT_ENDPOINT_URL || '';

// const params = new URLSearchParams({
//   client_id: process.env.COGNITO_CLIENT_ID || '',
//   redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/cognito`,
//   response_type: 'code'
// });
// // const logoutUrl = `${logoutEndpointUrl}?${params.toString()}`;

// export async function POST(req: Request, res: NextApiResponse) {
//   console.log('req', req);
//   const token = await getToken({
//     req,
//     secret: process.env.NEXTAUTH_SECRET
//   });
//   console.log('token', token);
//   const refreshToken = token?.refreshToken as string;
//   console.log('refreshToken', refreshToken);
//   //   res.redirect(logoutUrl);
//   // Sign out from auth provider
//   const logoutEndpointUrl = process.env.KEYCLOAK_LOGOUT_ENDPOINT_URL || '';
//   const params = new URLSearchParams({
//     client_id: process.env.KEYCLOAK_ID || '',
//     client_secret: process.env.KEYCLOAK_SECRET ?? '',
//     refreshToken: refreshToken
//   });

//   // const params = new URLSearchParams({
//   //   client_id: process.env.KEYCLOAK_ID || '',
//   //   redirect_uri: `${process.env.NEXTAUTH_URL}/api/auth/callback/keycloak`,
//   //   response_type: 'code'
//   // });
//   console.log('logoutEndpointUrl', logoutEndpointUrl, params);
//   const logoutResult = await fetch(logoutEndpointUrl, {
//     method: 'POST',
//     // body: JSON.stringify(params),
//     body: params,
//     headers: {
//       'Content-Type': 'application/x-www-form-urlencoded'
//     }
//   });
//   console.log('logoutResult', logoutResult);
//   return NextResponse.redirect(process.env.AUTH_URL ?? '');
// }
