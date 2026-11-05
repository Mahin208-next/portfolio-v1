// POST /api/auth/change-password
import type { VercelRequest, VercelResponse } from '@vercel/node';
import bcrypt from 'bcryptjs';
import { supabase } from '../_lib/db';
import { requireAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { currentPassword, newPassword } = req.body ?? {};

  if (!currentPassword || !newPassword) {
    return res.status(400).json({ error: 'currentPassword and newPassword required' });
  }
  if (newPassword.length < 8) {
    return res.status(400).json({ error: 'New password must be at least 8 characters' });
  }

  const { data, error } = await supabase
    .from('admin_credentials')
    .select('password_hash')
    .eq('id', 'admin')
    .single();

  if (error || !data) return res.status(500).json({ error: 'Admin not found' });

  const valid = await bcrypt.compare(currentPassword, data.password_hash);
  if (!valid) return res.status(401).json({ error: 'Current password is incorrect' });

  const hash = await bcrypt.hash(newPassword, 12);
  const { error: updateError } = await supabase
    .from('admin_credentials')
    .update({ password_hash: hash, updated_at: new Date().toISOString() })
    .eq('id', 'admin');

  if (updateError) return res.status(500).json({ error: 'Failed to update password' });

  return res.status(200).json({ success: true, message: 'Password updated successfully' });
}

