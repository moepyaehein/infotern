const JSON_HEADERS = {
  'Content-Type': 'application/json',
};

async function authRequest(path, options = {}) {
  const response = await fetch(path, {
    credentials: 'include',
    ...options,
  });

  const payload = await response.json();

  if (!response.ok) {
    throw new Error(payload.error || 'Authentication request failed.');
  }

  return payload;
}

export function loginWithEmail({ email, password }) {
  return authRequest('/api/auth/login', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password }),
  });
}

export function signupWithEmail({ email, password, fullName }) {
  return authRequest('/api/auth/signup', {
    method: 'POST',
    headers: JSON_HEADERS,
    body: JSON.stringify({ email, password, fullName }),
  });
}

export function getCurrentUser() {
  return authRequest('/api/auth/me');
}

export function logoutUser() {
  return authRequest('/api/auth/logout', {
    method: 'POST',
  });
}
