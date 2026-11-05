// API client for portfolio backend
const BASE = '/api';

export type SaveStatus = 'idle' | 'saving' | 'saved' | 'error';

// Check if the user is authenticated
export async function checkAuth(): Promise<boolean> {
  try {
    const res = await fetch(`${BASE}/auth/me`, { credentials: 'include' });
    const data = await res.json();
    return data.authenticated === true;
  } catch {
    return false;
  }
}

// Login
export async function login(password: string): Promise<{ success: boolean; error?: string; needsSetup?: boolean }> {
  try {
    const res = await fetch(`${BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) return { success: true };
    return { success: false, error: data.error, needsSetup: data.needsSetup };
  } catch {
    return { success: false, error: 'Network error. Check your connection.' };
  }
}

// First-time setup
export async function setupAdmin(password: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}/auth/setup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ password }),
    });
    const data = await res.json();
    if (res.ok) return { success: true };
    return { success: false, error: data.error };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Logout
export async function logout(): Promise<void> {
  try {
    await fetch(`${BASE}/auth/logout`, { method: 'POST', credentials: 'include' });
  } catch {}
}

// Change password
export async function changePassword(currentPassword: string, newPassword: string): Promise<{ success: boolean; error?: string }> {
  try {
    const res = await fetch(`${BASE}/auth/change-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify({ currentPassword, newPassword }),
    });
    const data = await res.json();
    if (res.ok) return { success: true };
    return { success: false, error: data.error };
  } catch {
    return { success: false, error: 'Network error' };
  }
}

// Fetch portfolio data from DB
export async function fetchPortfolioData(): Promise<Record<string, unknown> | null> {
  try {
    const res = await fetch(`${BASE}/portfolio`, { credentials: 'include' });
    if (!res.ok) return null;
    return await res.json();
  } catch {
    return null;
  }
}

// Save all portfolio data to DB
export async function savePortfolioData(data: unknown): Promise<{ success: boolean; savedAt?: string; error?: string }> {
  try {
    const res = await fetch(`${BASE}/portfolio`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(data),
    });
    const result = await res.json();
    if (res.ok) return { success: true, savedAt: result.savedAt };
    return { success: false, error: result.error };
  } catch {
    return { success: false, error: 'Network error — changes saved locally' };
  }
}

