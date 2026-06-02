async function adminRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Admin request failed.');
  }

  return payload;
}

export function fetchAdminSummary() {
  return adminRequest('/api/admin/summary');
}

export function updateSeniorAdmin(id, patch) {
  return adminRequest(`/api/admin/seniors/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(patch),
  });
}

export function deleteSeniorAdmin(id) {
  return adminRequest(`/api/admin/seniors/${id}`, {
    method: 'DELETE',
  });
}

export function createCompanyAdmin(company) {
  return adminRequest('/api/companies', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  });
}

export function updateCompanyAdmin(id, company) {
  return adminRequest(`/api/admin/companies/${id}`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(company),
  });
}

export function deleteCompanyAdmin(id) {
  return adminRequest(`/api/admin/companies/${id}`, {
    method: 'DELETE',
  });
}
