'use client';

import { MOCK_USER } from './mock-data';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: string;
  avatarInitials: string;
}

const AUTH_KEY = 'scx_auth_user';

export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as AuthUser;
  } catch {
    return null;
  }
}

export function setAuthUser(user: AuthUser): void {
  localStorage.setItem(AUTH_KEY, JSON.stringify(user));
}

export function clearAuthUser(): void {
  localStorage.removeItem(AUTH_KEY);
}

export function login(email: string, password: string): { success: boolean; user?: AuthUser; error?: string } {
  if (email === MOCK_USER.email && password === 'demo123') {
    const user: AuthUser = {
      id: MOCK_USER.id,
      name: MOCK_USER.name,
      email: MOCK_USER.email,
      plan: MOCK_USER.plan,
      avatarInitials: MOCK_USER.avatarInitials,
    };
    setAuthUser(user);
    return { success: true, user };
  }
  return { success: false, error: 'Invalid email or password.' };
}

export function register(name: string, email: string, _password: string, plan: string): { success: boolean; user?: AuthUser; error?: string } {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  const user: AuthUser = {
    id: 'usr_' + Math.random().toString(36).slice(2, 10),
    name,
    email,
    plan,
    avatarInitials: initials,
  };
  setAuthUser(user);
  return { success: true, user };
}

export function logout(): void {
  clearAuthUser();
}
