async function companiesRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Company request failed.');
  }

  return payload;
}

export function fetchCompanies() {
  return companiesRequest('/api/companies');
}
