/**
 * Helpers for resolving clean social platform names and valid external URLs
 */

export function getSocialDisplayName(social: { name: string; url?: string }): string {
  const name = (social.name || '').trim();

  // If user entered a clean platform name (not a URL), use it
  if (
    name &&
    !name.startsWith('http://') &&
    !name.startsWith('https://') &&
    !name.includes('www.') &&
    !name.includes('.com') &&
    !name.includes('.org') &&
    !name.includes('.io') &&
    !name.includes('.me') &&
    !name.includes('/')
  ) {
    return name;
  }

  // If name is a URL or empty, detect the platform from URL or name string
  const target = (name.startsWith('http') || name.includes('/')) ? name : (social.url || name);
  const lower = target.toLowerCase();

  if (lower.includes('facebook') || lower.includes('fb.com')) return 'Facebook';
  if (lower.includes('github')) return 'GitHub';
  if (lower.includes('linkedin')) return 'LinkedIn';
  if (lower.includes('twitter') || lower.includes('x.com')) return 'Twitter / X';
  if (lower.includes('instagram')) return 'Instagram';
  if (lower.includes('youtube')) return 'YouTube';
  if (lower.includes('read.cv') || lower.includes('readcv')) return 'ReadCV';
  if (lower.includes('dribbble')) return 'Dribbble';
  if (lower.includes('behance')) return 'Behance';
  if (lower.includes('discord')) return 'Discord';
  if (lower.includes('telegram') || lower.includes('t.me')) return 'Telegram';
  if (lower.includes('medium')) return 'Medium';
  if (lower.includes('substack')) return 'Substack';

  // Fallback: extract domain name
  try {
    const raw = target.startsWith('http') ? target : `https://${target}`;
    const host = new URL(raw).hostname.replace(/^www\./, '');
    const domainPart = host.split('.')[0];
    if (domainPart) {
      return domainPart.charAt(0).toUpperCase() + domainPart.slice(1);
    }
  } catch {}

  return name || 'Profile';
}

export function getSocialHref(social: { name: string; url?: string }): string {
  let url = (social.url || '').trim();

  // If URL field was left empty but name field contained the URL
  if (!url && (social.name.startsWith('http') || social.name.includes('.'))) {
    url = social.name.trim();
  }

  if (!url) return '#';
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('mailto:')) {
    return url;
  }

  return `https://${url}`;
}
