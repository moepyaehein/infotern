import { requireAdmin } from '@/lib/adminServer';
import { mapCompanyFormToRow, mapCompanyRow } from '@/lib/companyMapper';
import { supabaseEndpoint, supabaseHeaders } from '@/lib/supabaseServer';

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();

  if (admin.error) return admin.error;

  const { id } = await params;
  const body = await request.json();
  const patch = mapCompanyFormToRow({ ...body, id });
  delete patch.id;

  const response = await fetch(
    supabaseEndpoint(`companies?id=eq.${encodeURIComponent(id)}`),
    {
      method: 'PATCH',
      headers: supabaseHeaders({
        Authorization: `Bearer ${admin.accessToken}`,
        'Content-Type': 'application/json',
        Prefer: 'return=representation',
      }),
      body: JSON.stringify(patch),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    return Response.json(
      { error: `Company update failed: ${message}` },
      { status: response.status },
    );
  }

  const [company] = await response.json();

  return Response.json({
    company: mapCompanyRow(company),
  });
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();

  if (admin.error) return admin.error;

  const { id } = await params;
  const response = await fetch(
    supabaseEndpoint(`companies?id=eq.${encodeURIComponent(id)}`),
    {
      method: 'DELETE',
      headers: supabaseHeaders({
        Authorization: `Bearer ${admin.accessToken}`,
      }),
    },
  );

  if (!response.ok) {
    const message = await response.text();
    return Response.json(
      { error: `Company delete failed: ${message}` },
      { status: response.status },
    );
  }

  return Response.json({ ok: true });
}
