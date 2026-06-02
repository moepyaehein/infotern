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

  const { email, password, fullName } = await request.json();
  const normalizedEmail = String(email || '').trim().toLowerCase();

  if (!isUitEmail(normalizedEmail)) {
    return NextResponse.json(
      { error: `Please use your ${UIT_EMAIL_DOMAIN} email address.` },
      { status: 400 },
    );
  }

  if (!password || password.length < 6) {
    return NextResponse.json(
      { error: 'Password must be at least 6 characters.' },
      { status: 400 },
    );
  }

  const response = await fetch(authEndpoint('signup'), {
    method: 'POST',
    headers: authHeaders({
      'Content-Type': 'application/json',
    }),
    body: JSON.stringify({
      email: normalizedEmail,
      password,
      data: {
        full_name: fullName || '',
        university: 'UIT',
      },
    }),
  });

  const payload = await response.json();

  if (!response.ok) {
    return NextResponse.json(
      { error: payload.msg || payload.error_description || payload.error || 'Signup failed.' },
      { status: response.status },
    );
  }

  const result = NextResponse.json({
    user: publicUser(payload.user),
    needsEmailConfirmation: !payload.session,
    message: payload.session
      ? 'Account created. You are signed in.'
      : 'Account created. Please check your UIT email to confirm your account.',
  });

  return setSessionCookies(result, payload.session, payload.user?.email || normalizedEmail);
}
