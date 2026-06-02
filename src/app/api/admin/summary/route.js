import { reviews } from '@/data/reviews';
import { companies as sampleCompanies } from '@/data/companies';
import { seniors as sampleSeniors } from '@/data/seniors';
import { requireAdmin } from '@/lib/adminServer';
import { mapCompanyRow } from '@/lib/companyMapper';
import { mapSeniorRow } from '@/lib/seniorMapper';
import { supabaseEndpoint, supabaseHeaders } from '@/lib/supabaseServer';

async function readSupabaseRows(path, accessToken) {
  const response = await fetch(supabaseEndpoint(path), {
    headers: supabaseHeaders({
      Authorization: `Bearer ${accessToken}`,
    }),
    cache: 'no-store',
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message);
  }

  return response.json();
}

export async function GET() {
  const admin = await requireAdmin();

  if (admin.error) return admin.error;

  try {
    const [seniorRows, reviewRows, companyRows] = await Promise.all([
      readSupabaseRows('seniors?select=*&order=approved.asc&order=created_at.desc', admin.accessToken),
      readSupabaseRows('reviews?select=id,company_id,reviewer_name,overall_rating,created_at&order=created_at.desc', admin.accessToken),
      readSupabaseRows('companies?select=*&order=active.desc&order=name.asc', admin.accessToken),
    ]);

    const seniorProfiles = seniorRows.map(mapSeniorRow);
    const managedCompanies = companyRows.map(mapCompanyRow);

    return Response.json({
      admin: admin.user,
      seniors: seniorProfiles,
      companies: managedCompanies,
      reviews: reviewRows,
      stats: {
        pendingSeniors: seniorProfiles.filter((senior) => !senior.approved).length,
        approvedSeniors: seniorProfiles.filter((senior) => senior.approved).length,
        sampleSeniors: sampleSeniors.length,
        managedCompanies: managedCompanies.length,
        sampleCompanies: sampleCompanies.length,
        reviews: reviewRows.length || reviews.length,
      },
    });
  } catch (error) {
    return Response.json(
      { error: `Admin data failed: ${error.message}` },
      { status: 500 },
    );
  }
}
