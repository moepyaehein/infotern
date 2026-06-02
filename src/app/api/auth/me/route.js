import { NextResponse } from 'next/server';
import {
  authEndpoint,
  authHeaders,
  clearSessionCookies,
  getAccessToken,
  isAuthConfigured,
  publicUser,
} from '@/lib/authServer';
import { isAdminUser } from '@/lib/adminServer';

export async function GET() {
  if (!isAuthConfigured()) {
    return NextResponse.json({ user: null, configured: false });
  }

  const accessToken = await getAccessToken();

  if (!accessToken) {
    return NextResponse.json({ user: null, configured: true });
  }

  const response = await fetch(authEndpoint('user'), {
    headers: authHeaders({
      Authorization: `Bearer ${accessToken}`,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return clearSessionCookies(
      NextResponse.json({ user: null, configured: true }),
    );
  }

  const user = await response.json();
  const normalizedUser = publicUser(user);

  return NextResponse.json({
    user: {
      ...normalizedUser,
      isAdmin: await isAdminUser(accessToken, normalizedUser.email),
    },
    configured: true,
  });
}
