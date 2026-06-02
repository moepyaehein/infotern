import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const UIT_EMAIL_DOMAIN = '@uit.edu.mm';

const ACCESS_COOKIE = 'infotern_access_token';
const REFRESH_COOKIE = 'infotern_refresh_token';
const USER_COOKIE = 'infotern_user_email';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

export function isUitEmail(email = '') {
  return email.trim().toLowerCase().endsWith(UIT_EMAIL_DOMAIN);
}

export function isAuthConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

export function authEndpoint(path) {
  return `${SUPABASE_URL.replace(/\/$/, '')}/auth/v1/${path}`;
}

export function authHeaders(extra = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    ...extra,
  };
}

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge,
  };
}

export function setSessionCookies(response, session, email) {
  if (!session?.access_token) return response;

  response.cookies.set(
    ACCESS_COOKIE,
    session.access_token,
    cookieOptions(session.expires_in || 3600),
  );

  if (session.refresh_token) {
    response.cookies.set(
      REFRESH_COOKIE,
      session.refresh_token,
      cookieOptions(60 * 60 * 24 * 30),
    );
  }

  if (email) {
    response.cookies.set(
      USER_COOKIE,
      email,
      cookieOptions(60 * 60 * 24 * 30),
    );
  }

  return response;
}

export function clearSessionCookies(response = NextResponse.json({ ok: true })) {
  response.cookies.set(ACCESS_COOKIE, '', cookieOptions(0));
  response.cookies.set(REFRESH_COOKIE, '', cookieOptions(0));
  response.cookies.set(USER_COOKIE, '', cookieOptions(0));
  return response;
}

export async function getAccessToken() {
  const cookieStore = await cookies();
  return cookieStore.get(ACCESS_COOKIE)?.value || '';
}

export async function getSessionEmail() {
  const cookieStore = await cookies();
  return cookieStore.get(USER_COOKIE)?.value || '';
}

export function publicUser(user) {
  if (!user) return null;

  return {
    id: user.id,
    email: user.email,
    createdAt: user.created_at,
  };
}
