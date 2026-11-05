import jwt from 'jsonwebtoken';
import type { IncomingMessage } from 'http';

const JWT_SECRET = process.env.JWT_SECRET || 'typofolio-super-secret-jwt-key-change-in-prod-2026';

export function signToken(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): { id: string } | null {
  try {
    return jwt.verify(token, JWT_SECRET) as { id: string };
  } catch {
    return null;
  }
}

export function getTokenFromRequest(req: IncomingMessage): string | null {
  // Try Authorization header first
  const authHeader = req.headers['authorization'];
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.slice(7);
  }

  // Try cookie
  const cookies = req.headers['cookie'];
  if (cookies) {
    const match = cookies.match(/admin_token=([^;]+)/);
    if (match) return decodeURIComponent(match[1]);
  }

  return null;
}

export function requireAuth(req: IncomingMessage): { id: string } | null {
  const token = getTokenFromRequest(req);
  if (!token) return null;
  return verifyToken(token);
}

export function setCookieHeader(token: string): string {
  const maxAge = 7 * 24 * 60 * 60; // 7 days
  const isProduction = process.env.NODE_ENV === 'production';
  return `admin_token=${encodeURIComponent(token)}; Max-Age=${maxAge}; Path=/; HttpOnly; SameSite=Strict${isProduction ? '; Secure' : ''}`;
}

export function clearCookieHeader(): string {
  return `admin_token=; Max-Age=0; Path=/; HttpOnly; SameSite=Strict`;
}

