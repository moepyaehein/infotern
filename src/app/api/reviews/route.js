import { reviewFromSupabase, reviewToSupabase } from '@/lib/reviewMapper';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY =
  process.env.SUPABASE_PUBLISHABLE_KEY ||
  process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

function isConfigured() {
  return Boolean(SUPABASE_URL && SUPABASE_KEY);
}

function supabaseHeaders(extra = {}) {
  return {
    apikey: SUPABASE_KEY,
    Authorization: `Bearer ${SUPABASE_KEY}`,
    ...extra,
  };
}

function supabaseEndpoint(path) {
  return `${SUPABASE_URL.replace(/\/$/, '')}/rest/v1/${path}`;
}

function validateReview(review) {
  const requiredFields = [
    'companyId',
    'reviewerName',
    'major',
    'role',
    'overallRating',
    'workLifeBalance',
    'learningOpportunity',
    'mentorship',
    'pros',
    'cons',
  ];

  const hasRequiredFields = requiredFields.every((field) => {
    const value = review[field];
    return value !== undefined && value !== null && value !== '';
  });

  const hasValidRatings = [
    review.overallRating,
    review.workLifeBalance,
    review.learningOpportunity,
    review.mentorship,
  ].every((rating) => Number.isInteger(rating) && rating >= 1 && rating <= 5);

  return hasRequiredFields && hasValidRatings;
}

export async function GET() {
  if (!isConfigured()) {
    return Response.json({
      configured: false,
      reviews: [],
    });
  }

  const response = await fetch(
    supabaseEndpoint('reviews?select=*&order=created_at.desc'),
    {
      headers: supabaseHeaders(),
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

  return Response.json({
    configured: true,
    reviews: rows.map(reviewFromSupabase),
  });
}

export async function POST(request) {
  if (!isConfigured()) {
    return Response.json(
      { error: 'Supabase is not configured. Add your Supabase URL and publishable key to .env.local.' },
      { status: 503 },
    );
  }

  const review = await request.json();

  if (!validateReview(review)) {
    return Response.json(
      { error: 'Missing required review fields.' },
      { status: 400 },
    );
  }

  const response = await fetch(supabaseEndpoint('reviews'), {
    method: 'POST',
    headers: supabaseHeaders({
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify(reviewToSupabase(review)),
  });

  if (!response.ok) {
    const message = await response.text();
    return Response.json(
      { error: `Supabase insert failed: ${message}` },
      { status: response.status },
    );
  }

  const [createdReview] = await response.json();

  return Response.json({
    review: reviewFromSupabase(createdReview),
  });
}
