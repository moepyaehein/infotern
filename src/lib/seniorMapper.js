export function mapSeniorRow(row) {
  return {
    id: row.id,
    userId: row.user_id,
    name: row.name,
    major: row.major,
    graduationYear: row.graduation_year,
    companyId: row.company_id,
    role: row.role,
    bio: row.bio,
    avatar: row.avatar || undefined,
    contact: {
      telegram: row.telegram || '',
      facebook: row.facebook || '',
      email: row.email || '',
    },
    available: row.available,
    approved: row.approved,
    helpCount: row.help_count || 0,
    createdAt: row.created_at,
  };
}

export function mapSeniorFormToRow(profile, user) {
  return {
    user_id: user.id,
    name: profile.name,
    major: profile.major,
    graduation_year: Number(profile.graduationYear),
    company_id: profile.companyId,
    role: profile.role,
    bio: profile.bio,
    telegram: profile.telegram || null,
    facebook: profile.facebook || null,
    email: user.email,
    available: Boolean(profile.available),
    approved: false,
  };
}
