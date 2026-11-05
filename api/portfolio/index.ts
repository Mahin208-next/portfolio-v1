// GET /api/portfolio — fetch all portfolio data (public)
// PUT /api/portfolio — update portfolio data (admin only)
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { supabase } from '../_lib/db.ts';
import { requireAuth } from '../_lib/auth.ts';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Allow CORS for the frontend
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, PUT, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  // GET — public read
  if (req.method === 'GET') {
    const { data, error } = await supabase
      .from('portfolio_config')
      .select('*')
      .eq('id', 'main')
      .single();

    if (error || !data) {
      // Return empty — frontend will use localStorage defaults
      return res.status(404).json({ error: 'No portfolio data found' });
    }

    return res.status(200).json(data);
  }

  // PUT — protected write
  if (req.method === 'PUT') {
    const user = requireAuth(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized' });

    const body = req.body;
    if (!body) return res.status(400).json({ error: 'No data provided' });

    // Upsert into portfolio_config
    const { error } = await supabase
      .from('portfolio_config')
      .upsert({
        id: 'main',
        personal_info: body.personalInfo,
        about: { bio: body.aboutBio, pillars: body.pillars },
        skills: body.skills,
        projects: body.projects,
        experience: body.experiences,
        education: { items: body.education, certifications: body.certifications },
        blog_posts: body.blogPosts,
        updated_at: new Date().toISOString(),
      });

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ error: 'Failed to save data' });
    }

    return res.status(200).json({ success: true, savedAt: new Date().toISOString() });
  }

  return res.status(405).json({ error: 'Method not allowed' });
}

