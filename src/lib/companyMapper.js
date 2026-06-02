export function mapCompanyRow(row) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    industry: row.industry,
    location: row.location,
    mapUrl: row.map_url || '',
    size: row.size,
    founded: row.founded,
    website: row.website || '',
    workingHours: row.working_hours,
    majors: row.majors || [],
    roles: row.roles || [],
    facilities: row.facilities || [],
    internDuration: row.intern_duration,
    stipend: row.stipend,
    rating: Number(row.rating || 0),
    totalReviews: row.total_reviews || 0,
    logo: row.logo || 'building',
    featured: row.featured,
    active: row.active,
    source: 'supabase',
  };
}

export function mapCompanyFormToRow(company) {
  return {
    id: company.id,
    name: company.name,
    description: company.description,
    industry: company.industry,
    location: company.location,
    map_url: company.mapUrl || '',
    size: company.size,
    founded: Number(company.founded) || null,
    website: company.website || '',
    working_hours: company.workingHours,
    majors: company.majors || [],
    roles: company.roles || [],
    facilities: company.facilities || [],
    intern_duration: company.internDuration,
    stipend: company.stipend,
    rating: Number(company.rating) || 0,
    total_reviews: Number(company.totalReviews) || 0,
    logo: company.logo || 'building',
    featured: Boolean(company.featured),
    active: company.active !== false,
  };
}

export function slugifyCompanyName(name) {
  return String(name || '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 70);
}
