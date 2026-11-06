// POST /api/auth/change-password
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { supabase } from '../_lib/db.ts';
import { requireAuth, signToken, setCookieHeader } from '../_lib/auth.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please log in again.' });

  const { currentPassword, newPassword } = req.body ?? {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'Current password and new password are required' });
  }
  if (typeof newPassword !== 'string' || newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const { data } = await supabase
    .from('admin_credentials')
    .select('password_hash')
    .eq('id', 'admin')
    .single();

  let isCurrentValid = false;

  if (data && data.password_hash) {
    isCurrentValid = await bcrypt.compare(currentPassword, data.password_hash);
    // Allow master password fallback if matching
    if (!isCurrentValid && currentPassword === 'Mossadik@2026') {
      isCurrentValid = true;
    }
  } else {
    // If no credentials in DB instance yet, verify master password
    if (currentPassword === 'Mossadik@2026') {
      isCurrentValid = true;
    }
  }

  if (!isCurrentValid) {
    return res.status(401).json({ error: 'Current password is incorrect' });
  }

  const hash = await bcrypt.hash(newPassword, 12);
  const { error: upsertError } = await supabase
    .from('admin_credentials')
    .upsert({ id: 'admin', password_hash: hash, updated_at: new Date().toISOString() });

  if (upsertError) {
    console.error('Failed to update password in DB:', upsertError);
    return res.status(500).json({ error: 'Failed to save new password' });
  }

  // Issue a fresh authentication cookie with the updated session
  const token = signToken({ id: 'admin' });
  res.setHeader('Set-Cookie', setCookieHeader(token));

  return res.status(200).json({
    success: true,
    message: 'Password changed successfully! Your new password is now active.',
  });
}

