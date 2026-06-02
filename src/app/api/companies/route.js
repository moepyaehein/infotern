import { companies as sampleCompanies } from '@/data/companies';
import { requireAdmin } from '@/lib/adminServer';
import { mapCompanyFormToRow, mapCompanyRow, slugifyCompanyName } from '@/lib/companyMapper';
import { isSupabaseConfigured, supabaseEndpoint, supabaseHeaders } from '@/lib/supabaseServer';

function mergeCompanies(remoteCompanies) {
  const remoteIds = new Set(remoteCompanies.map((company) => company.id));
  return [
    ...remoteCompanies,
    ...sampleCompanies.filter((company) => !remoteIds.has(company.id)),
  ];
}

function validateCompany(company) {
  const required = [
    'name',
    'description',
    'industry',
    'location',
    'size',
    'workingHours',
    'internDuration',
    'stipend',
  ];

  return (
    required.every((field) => String(company[field] || '').trim()) &&
    Array.isArray(company.majors) &&
    company.majors.length > 0 &&
    Array.isArray(company.roles) &&
    company.roles.length > 0
  );
}

export async function GET() {
  if (!isSupabaseConfigured()) {
    return Response.json({
      configured: false,
      companies: sampleCompanies,
    });
  }

  const response = await fetch(
    supabaseEndpoint('companies?select=*&active=eq.true&order=featured.desc&order=name.asc'),
    {
      headers: supabaseHeaders(),
      cache: 'no-store',
    },
  );

  if (!response.ok) {
    return Response.json({
      configured: true,
      companies: sampleCompanies,
    });
  }

  const rows = await response.json();
  const remoteCompanies = rows.map(mapCompanyRow);

  return Response.json({
    configured: true,
    companies: mergeCompanies(remoteCompanies),
  });
}

export async function POST(request) {
  const admin = await requireAdmin();

  if (admin.error) return admin.error;

  const company = await request.json();
  const id = company.id || slugifyCompanyName(company.name);

  if (!id || !validateCompany(company)) {
    return Response.json(
      { error: 'Please complete the required company fields.' },
      { status: 400 },
    );
  }

  const response = await fetch(supabaseEndpoint('companies'), {
    method: 'POST',
    headers: supabaseHeaders({
      Authorization: `Bearer ${admin.accessToken}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    }),
    body: JSON.stringify(mapCompanyFormToRow({ ...company, id })),
  });

  if (!response.ok) {
    const message = await response.text();
    return Response.json(
      { error: `Company create failed: ${message}` },
      { status: response.status },
    );
  }

  const [createdCompany] = await response.json();

  return Response.json({
    company: mapCompanyRow(createdCompany),
  });
}
