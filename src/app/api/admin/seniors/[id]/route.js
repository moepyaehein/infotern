import { requireAdmin } from '@/lib/adminServer';
import { mapSeniorRow } from '@/lib/seniorMapper';
import { supabaseEndpoint, supabaseHeaders } from '@/lib/supabaseServer';

function sanitizePatch(body) {
  const patch = {};

  if (typeof body.approved === 'boolean') patch.approved = body.approved;
  if (typeof body.available === 'boolean') patch.available = body.available;

  if (Number.isInteger(body.helpCount) && body.helpCount >= 0) {
    patch.help_count = body.helpCount;
  }

  patch.updated_at = new Date().toISOString();

  return patch;
}

export async function PATCH(request, { params }) {
  const admin = await requireAdmin();

  if (admin.error) return admin.error;

  const { id } = await params;
  const body = await request.json();
  const patch = sanitizePatch(body);

  if (Object.keys(patch).length <= 1) {
    return Response.json(
      { error: 'No valid senior profile changes were provided.' },
      { status: 400 },
    );
  }

  const response = await fetch(
    supabaseEndpoint(`seniors?id=eq.${encodeURIComponent(id)}`),
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
      { error: `Senior update failed: ${message}` },
      { status: response.status },
    );
  }

  const [senior] = await response.json();

  return Response.json({
    senior: mapSeniorRow(senior),
  });
}

export async function DELETE(_request, { params }) {
  const admin = await requireAdmin();

  if (admin.error) return admin.error;

  const { id } = await params;
  const response = await fetch(
    supabaseEndpoint(`seniors?id=eq.${encodeURIComponent(id)}`),
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
      { error: `Senior delete failed: ${message}` },
      { status: response.status },
    );
  }

  return Response.json({ ok: true });
}
