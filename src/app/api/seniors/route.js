import { companies } from '@/data/companies';
import { MAJORS } from '@/data/majors';
import {
  authEndpoint,
  authHeaders,
  getAccessToken,
  isAuthConfigured,
  isUitEmail,
  publicUser,
} from '@/lib/authServer';
import { mapSeniorFormToRow, mapSeniorRow } from '@/lib/seniorMapper';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function supabaseEndpoint(path) {
  return `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`;
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    ...extra,
  };
}

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function validateSeniorProfile(profile) {
  const requiredFields = ['name', 'major', 'graduationYear', 'companyId', 'role', 'bio'];
  const hasRequiredFields = requiredFields.every((field) => {
    const value = profile[field];
    return value !== undefined && value !== null && String(value).trim() !== '';
  });

  if (!hasRequiredFields) return false;

  const graduationYear = Number(profile.graduationYear);
  const majorExists = MAJORS.some((major) => major.code === profile.major);
  const companyExists = companies.some((company) => company.id === profile.companyId);

  return (
    majorExists &&
    companyExists &&
    Number.isInteger(graduationYear) &&
    graduationYear >= 2000 &&
    graduationYear <= 2100 &&
    String(profile.bio).trim().length >= 30
  );
}

async function getAuthenticatedUser(accessToken) {
  if (!accessToken) return null;

  const response = await fetch(authEndpoint('user'), {
    headers: authHeaders({
      Authorization: `Bearer ${accessToken}`,
    }),
    cache: 'no-store',
  });

  if (!response.ok) return null;

  return response.json();
}

export async function GET() {
  if (!isConfigured()) {
    return Response.json({
      configured: false,
      seniors: [],
      ownProfile: null,
    });
  }

  const accessToken = await getAccessToken();
  const headers = accessToken
    ? supabaseHeaders({ Authorization: `Bearer ${accessToken}` })
    : supabaseHeaders();

  const response = await fetch(
    supabaseEndpoint('seniors?select=*&order=approved.desc&order=created_at.desc'),
    {
      headers,
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    const message = await response.text();
    return Response.json(
      { error: `Supabase read failed: ${message}` },
      { status: response.status },
    );
  }

  const rows = await response.json();
  const user = await getAuthenticatedUser(accessToken);
  const mapped = rows.map(mapSeniorRow);

  return Response.json({
    configured: true,
    seniors: mapped.filter((senior) => senior.approved),
    ownProfile: user
      ? mapped.find((senior) => senior.userId === user.id) || null
      : null,
  });
}

export async function POST(request) {
  if (!isAuthConfigured()) {
    return Response.json(
      { error: 'Supabase auth is not configured.' },
      { status: 503 },
    );
  }

  const accessToken = await getAccessToken();
  const user = await getAuthenticatedUser(accessToken);

  if (!user) {
    return Response.json(
      { error: 'Please login with your UIT email before joining as a senior mentor.' },
      { status: 401 },
    );
  }

  if (!isUitEmail(user.email)) {
    return Response.json(
      { error: 'Only UIT email accounts can create senior mentor profiles.' },
      { status: 403 },
    );
  }

  const profile = await request.json();

  if (!validateSeniorProfile(profile)) {
    return Response.json(
      { error: 'Please complete all required fields. Bio must be at least 30 characters.' },
      { status: 400 },
    );
  }

  const response = await fetch(supabaseEndpoint('seniors?on_conflict=user_id'), {
    method: 'POST',
    headers: supabaseHeaders({
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation,resolution=merge-duplicates',
    }),
    body: JSON.stringify(mapSeniorFormToRow(profile, publicUser(user))),
  });

  if (!response.ok) {
    const message = await response.text();
    return Response.json(
      { error: `Supabase save failed: ${message}` },
      { status: response.status },
    );
  }

  const [createdProfile] = await response.json();

  return Response.json({
    senior: mapSeniorRow(createdProfile),
    message: 'Your senior mentor profile is saved and waiting for admin approval.',
  });
}
