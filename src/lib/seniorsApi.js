const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

async function seniorsRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Senior profile request failed.');
  }

  return payload;
}

export function getSupabaseSeniors() {
  return seniorsRequest('/api/seniors');
}

export function saveSeniorProfile(profile) {
  return seniorsRequest('/api/seniors', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify(profile),
  });
}
