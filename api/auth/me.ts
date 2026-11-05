// GET /api/auth/me — verify current session
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { requireAuth } from '../_lib/auth';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const user = requireAuth(req);
  if (!user) return res.status(401).json({ authenticated: false });

  return res.status(200).json({ authenticated: true, id: user.id });
}

