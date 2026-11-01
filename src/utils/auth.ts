export interface AuthUser {
  id: string;
  fullName: string;
  email: string;
  role: 'Consumer / Device Owner' | 'Hardware Repair Technician' | 'Spare Parts Stockist';
  city: string;
  avatarUrl?: string;
  memberSince: string;
  verifiedAccount: boolean;
}

const AUTH_STORAGE_KEY = 'revtech_auth_session_v1';
const USERS_STORAGE_KEY = 'revtech_registered_users_v1';

export function getCurrentUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveUserSession(user: AuthUser) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
}

export function clearUserSession() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(AUTH_STORAGE_KEY);
}

export function getRegisteredUsers(): AuthUser[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function registerUser(user: AuthUser) {
  if (typeof window === 'undefined') return;
  const current = getRegisteredUsers();
  const exists = current.find((u) => u.email.toLowerCase() === user.email.toLowerCase());
  if (!exists) {
    current.push(user);
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(current));
  }
  saveUserSession(user);
}
