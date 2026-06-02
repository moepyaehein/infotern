import {
  authEndpoint,
  authHeaders,
  getAccessToken,
  publicUser,
} from '@/lib/authServer';
import {
  isSupabaseConfigured,
  supabaseEndpoint,
  supabaseHeaders,
} from '@/lib/supabaseServer';

export async function getAuthenticatedUser() {
  const accessToken = await getAccessToken();

  if (!accessToken) {
    return { accessToken: '', user: null };
  }

  const response = await fetch(authEndpoint('user'), {
    headers: authHeaders({
      Authorization: `Bearer ${accessToken}`,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    return { accessToken: '', user: null };
  }

  return {
    accessToken,
    user: publicUser(await response.json()),
  };
}

export async function isAdminUser(accessToken, email) {
  if (!isSupabaseConfigured() || !accessToken || !email) return false;

  const response = await fetch(
    supabaseEndpoint(`admins?select=email&email=eq.${encodeURIComponent(email)}&limit=1`),
    {
      headers: supabaseHeaders({
        Authorization: `Bearer ${accessToken}`,
      }),
      cache: 'no-store',
    },
  );

  if (!response.ok) return false;

  const rows = await response.json();
  return rows.length > 0;
}

export async function requireAdmin() {
  if (!isSupabaseConfigured()) {
    return {
      error: Response.json(
        { error: 'Supabase is not configured.' },
        { status: 503 },
      ),
    };
  }

  const { accessToken, user } = await getAuthenticatedUser();

  if (!user) {
    return {
      error: Response.json(
        { error: 'Please login before opening admin.' },
        { status: 401 },
      ),
    };
  }

  const admin = await isAdminUser(accessToken, user.email);

  if (!admin) {
    return {
      error: Response.json(
        { error: 'You do not have admin access.' },
        { status: 403 },
      ),
    };
  }

  return { accessToken, user };
}
