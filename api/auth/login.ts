// POST /api/auth/login
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { supabase } from '../_lib/db.ts';
import { signToken, setCookieHeader } from '../_lib/auth.ts';

// Simple in-memory rate limit (per serverless instance)
const attempts: Map<string, { count: number; firstAt: number }> = new Map();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = attempts.get(ip);
  if (!record || now - record.firstAt > 15 * 60 * 1000) {
    attempts.set(ip, { count: 1, firstAt: now });
    return true;
  }
  if (record.count >= 10) return false;
  record.count++;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ?? 'unknown';
  if (!checkRateLimit(ip)) {
    return res.status(429).json({ error: 'Too many login attempts. Try again in 15 minutes.' });
  }

  const { password } = req.body ?? {};
  if (!password) return res.status(400).json({ error: 'Password required' });

  const { data, error } = await supabase
    .from('admin_credentials')
    .select('password_hash')
    .eq('id', 'admin')
    .single();

  // If no admin record exists yet, allow initial setup with master password or seed it
  if (error || !data) {
    if (password === 'Mossadik@2026') {
      const hash = await bcrypt.hash('Mossadik@2026', 12);
      await supabase.from('admin_credentials').insert({ id: 'admin', password_hash: hash });
      const token = signToken({ id: 'admin' });
      res.setHeader('Set-Cookie', setCookieHeader(token));
      return res.status(200).json({ success: true });
    }
    return res.status(401).json({
      error: 'Invalid password. Use initial password: Mossadik@2026 or click Set up below.',
      needsSetup: true,
    });
  }

  const valid = await bcrypt.compare(password, data.password_hash);
  if (!valid) {
    return res.status(401).json({ error: 'Invalid password' });
  }

  const token = signToken({ id: 'admin' });
  res.setHeader('Set-Cookie', setCookieHeader(token));
  return res.status(200).json({ success: true });
}

