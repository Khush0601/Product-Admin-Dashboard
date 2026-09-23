export function saveSession(token: string, user: Record<string, unknown>) {
  if (typeof window === 'undefined') return;

  localStorage.setItem('authToken', token);
  localStorage.setItem('authUser', JSON.stringify(user));
}

export function clearSession() {
  if (typeof window === 'undefined') return;

  localStorage.removeItem('authToken');
  localStorage.removeItem('authUser');
}

export function getToken() {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('authToken');
}

export function getUser() {
  if (typeof window === 'undefined') return null;

  const rawUser = localStorage.getItem('authUser');
  if (!rawUser) return null;

  try {
    return JSON.parse(rawUser);
  } catch {
    return null;
  }
}

export function isLoggedIn() {
  return !!getToken();
}
