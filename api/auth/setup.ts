// POST /api/auth/setup — Initial admin password setup (only works if no password exists yet)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { supabase } from '../_lib/db';
import { signToken, setCookieHeader } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { password } = req.body ?? {};

  if (!password || typeof password !== 'string' || password.length < 8) {
    return res.status(400).json({ error: 'Password must be at least 8 characters' });
  }

  // Check if admin already exists
  const { data: existing } = await supabase
    .from('admin_credentials')
    .select('id')
    .eq('id', 'admin')
    .single();

  if (existing) {
    return res.status(409).json({ error: 'Admin already configured. Use /api/auth/change-password.' });
  }

  const hash = await bcrypt.hash(password, 12);

  const { error } = await supabase
    .from('admin_credentials')
    .insert({ id: 'admin', password_hash: hash });

  if (error) {
    return res.status(500).json({ error: 'Failed to create admin account' });
  }

  const token = signToken({ id: 'admin' });
  res.setHeader('Set-Cookie', setCookieHeader(token));
  return res.status(201).json({ success: true, message: 'Admin account created' });
}

