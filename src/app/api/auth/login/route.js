import { NextResponse } from 'next/server';
import {
  authEndpoint,
  authHeaders,
  isAuthConfigured,
  isUitEmail,
  setSessionCookies,
  UIT_EMAIL_DOMAIN,
  publicUser,
} from '@/lib/authServer';

export async function POST(request) {
  if (!isAuthConfigured()) {
    return NextResponse.json(
      { error: 'Supabase auth is not configured.' },
      { status: 503 },
    );
  }

  const { email, password } = await request.json();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!isUitEmail(normalizedEmail)) {
    return NextResponse.json(
      { error: `Please use your ${UIT_EMAIL_DOMAIN} email address.` },
      { status: 400 },
    );
  }

  const response = await fetch(authEndpoint('token?grant_type=password'), {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      email: normalizedEmail,
      password,
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: payload.msg || payload.error_description || payload.error || 'Login failed.' },
      { status: response.status },
    );
  }

  const result = NextResponse.json({
    user: publicUser(payload.user),
    message: 'Signed in successfully.',
  });

  return setSessionCookies(result, payload, payload.user?.email || normalizedEmail);
}
