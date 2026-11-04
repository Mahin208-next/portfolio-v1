import React from 'react';

// Real Official Brand Logos with Authentic Colors
export const BRAND_LOGOS: Record<string, () => React.ReactElement> = {
  // React - Official Cyan #61DAFB
  React: () => (
    <svg viewBox="-11.5 -10.23 23 20.46" className="w-5 h-5">
      <circle cx="0" cy="0" r="2.05" fill="#61DAFB" />
      <g stroke="#61DAFB" strokeWidth="1" fill="none">
        <ellipse rx="11" ry="4.2" />
        <ellipse rx="11" ry="4.2" transform="rotate(60)" />
        <ellipse rx="11" ry="4.2" transform="rotate(120)" />
      </g>
    </svg>
  ),

  // TypeScript - Official Blue #3178C6
  TypeScript: () => (
    <svg viewBox="0 0 128 128" className="w-5 h-5 rounded-sm overflow-hidden">
      <rect width="128" height="128" fill="#3178C6" rx="16" />
      <path fill="#ffffff" d="M68 40h-48v16h16v48h16V56h16V40zm38.5 28.5c0-4.7-3.8-8.5-8.5-8.5H82v44h16c8.8 0 16-7.2 16-16 0-5.8-3.1-10.8-7.5-13.5 3.7-1.4 6-4.6 6-6zm-12-3.5h2.5c2 0 3.5 1.6 3.5 3.5s-1.6 3.5-3.5 3.5H94.5V65zm3.5 23H94.5V76h3.5c2.5 0 4.5 2 4.5 4.5s-2 4.5-4.5 4.5z" />
    </svg>
  ),

  // Next.js - Official Monochrome Gradient
  Nextjs: () => (
    <svg viewBox="0 0 180 180" className="w-5 h-5" fill="none">
      <circle cx="90" cy="90" r="90" fill="#000000" />
      <path
        d="M149.5 158.5L74.8 62H58V118H70.6V77.8L139.8 165.7C143.2 163.5 146.5 161.1 149.5 158.5Z"
        fill="url(#next_grad)"
      />
      <rect x="109" y="62" width="12.6" height="56" fill="url(#next_grad_2)" />
      <defs>
        <linearGradient id="next_grad" x1="109" y1="116.5" x2="144.5" y2="160.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="next_grad_2" x1="115.3" y1="62" x2="115.3" y2="108.5" gradientUnits="userSpaceOnUse">
          <stop stopColor="#ffffff" />
          <stop offset="1" stopColor="#ffffff" stopOpacity="0.1" />
        </linearGradient>
      </defs>
    </svg>
  ),

  // Tailwind CSS - Official Teal #06B6D4
  TailwindCSS: () => (
    <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5">
      <path
        d="M12.001 4.8c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624C13.666 10.618 15.027 12 18.001 12c3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C16.336 6.182 14.975 4.8 12.001 4.8zm-6 7.2c-3.2 0-5.2 1.6-6 4.8 1.2-1.6 2.6-2.2 4.2-1.8.913.228 1.565.89 2.288 1.624 1.177 1.194 2.538 2.576 5.512 2.576 3.2 0 5.2-1.6 6-4.8-1.2 1.6-2.6 2.2-4.2 1.8-.913-.228-1.565-.89-2.288-1.624C10.336 13.382 8.975 12 6.001 12z"
        fill="#06B6D4"
      />
    </svg>
  ),

  // GSAP (GreenSock) - Official Vivid Green #0AE448
  GSAP: () => (
    <svg viewBox="0 0 100 100" fill="none" className="w-5 h-5">
      <rect width="100" height="100" rx="20" fill="#0E100F" />
      <circle cx="50" cy="50" r="38" stroke="#0AE448" strokeWidth="6" />
      <path d="M62 34H38c-3.3 0-6 2.7-6 6v20c0 3.3 2.7 6 6 6h24c3.3 0 6-2.7 6-6V50H48v6h12v4H38V40h24v-6z" fill="#0AE448" />
    </svg>
  ),

  // Three.js - Official triangular wireframe #049EF4
  Threejs: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M12 2L2 19.5h20L12 2zm0 3.8l6.7 11.7H5.3L12 5.8z" fill="#049EF4" />
      <circle cx="12" cy="12" r="2.5" fill="#ffffff" />
    </svg>
  ),

  // Motion / Framer - Official Blue #0055FF
  FramerMotion: () => (
    <svg viewBox="0 0 24 24" fill="#0055FF" className="w-5 h-5">
      <path d="M4 0h16v8h-8zM4 8h8l8 8H4zM4 16h8v8z" />
    </svg>
  ),

  // Node.js - Official Green #5FA04E
  Nodejs: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#5FA04E">
      <path d="M12 1.5L2 7.2v11.6l10 5.7 10-5.7V7.2L12 1.5zm-1 16.4c-3.1 0-4.3-1.4-4.3-3.8h2.3c0 1.2.6 1.8 2 1.8 1.4 0 1.9-.6 1.9-1.4 0-.8-.5-1.1-2.3-1.6-2.4-.6-3.7-1.3-3.7-3.3 0-2.2 1.6-3.4 3.9-3.4 2.8 0 4 1.3 4.1 3.4h-2.3c-.1-1.1-.6-1.5-1.8-1.5-1.1 0-1.7.5-1.7 1.3 0 .7.4 1.1 2.2 1.5 2.5.6 3.8 1.4 3.8 3.4 0 2.4-1.7 3.7-4.4 3.7z" />
    </svg>
  ),

  // Git - Official Orange-Red #F05032
  Git: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#F05032">
      <path d="M21.62 10.45l-8.07-8.07a2.53 2.53 0 0 0-3.58 0L8.1 4.25l2.45 2.45a2.5 2.5 0 0 1 3.17 3.18l2.94 2.94a2.5 2.5 0 0 1 2.37 3.42l2.59-2.59a2.53 2.53 0 0 0 0-3.8zM7.22 5.13L2.38 9.97a2.53 2.53 0 0 0 0 3.58l8.07 8.07a2.53 2.53 0 0 0 3.58 0l2.25-2.25-2.88-2.88a2.5 2.5 0 0 1-3.2-3.2L7.33 10.4a2.5 2.5 0 0 1-1.66-2.37c0-.73.31-1.39.81-1.85L7.22 5.13z" />
    </svg>
  ),

  // Design Systems / Figma - 5-Color Official
  DesignSystems: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path d="M8 24a4 4 0 0 1-4-4 4 4 0 0 1 4-4h4v4a4 4 0 0 1-4 4z" fill="#0ACF83" />
      <path d="M4 12a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#A259FF" />
      <path d="M4 4a4 4 0 0 1 4-4h4v8H8a4 4 0 0 1-4-4z" fill="#F24E1E" />
      <path d="M12 0h4a4 4 0 0 1 4 4 4 4 0 0 1-4 4h-4V0z" fill="#FF7262" />
      <path d="M20 12a4 4 0 0 1-4 4 4 4 0 0 1-4-4 4 4 0 0 1 4-4 4 4 0 0 1 4 4z" fill="#1ABCFE" />
    </svg>
  ),

  // Vite - Official Purple #BD34FE & Yellow #FFD62E
  Vite: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#BD34FE" d="M21.5 3.5L12.5 21l-2.2-4.2L6 20.5 2.5 3.5l19 0z" />
      <path fill="#FFD62E" d="M13 3.5l-4.5 9h3.5L9.5 20.5 18 10h-3.8l2.8-6.5z" />
    </svg>
  ),

  // WebSockets - Official Orange #E34F26
  WebSockets: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <circle cx="12" cy="12" r="10" stroke="#E34F26" strokeWidth="2" />
      <circle cx="12" cy="12" r="4" fill="#E34F26" />
      <path d="M12 2v4M12 18v4M2 12h4M18 12h4" stroke="#E34F26" strokeWidth="2" strokeLinecap="round" />
    </svg>
  ),

  // State Architecture / Redux - Official Purple #764ABC
  StateArchitecture: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <circle cx="12" cy="12" r="9" stroke="#764ABC" strokeWidth="2" />
      <path d="M8 12a4 4 0 1 1 8 0 4 4 0 0 1-8 0z" fill="#764ABC" />
    </svg>
  ),

  // Typography - Swiss Red #E11D48
  Typography: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <rect width="24" height="24" rx="4" fill="#E11D48" />
      <path d="M6 7h12v2.5h-4.5V18h-3V9.5H6V7z" fill="#ffffff" />
    </svg>
  ),

  // Web Accessibility - Accessibility Blue #0077DA
  Accessibility: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="#0077DA">
      <circle cx="12" cy="4" r="2.5" />
      <path d="M12 8c-3 0-6 .5-8 1.5l1 2.5c1.5-.8 3.5-1.2 5-1.2v4l-3.5 6.5 2.5 1.2 3-5.5 3 5.5 2.5-1.2L14 14.8V10.8c1.5 0 3.5.4 5 1.2l1-2.5C18 8.5 15 8 12 8z" />
    </svg>
  ),

  // Performance / Profiling - Chrome Emerald #10B981
  Performance: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none">
      <path d="M12 3a9 9 0 0 0-9 9c0 3.5 2 6.5 5 8h8c3-1.5 5-4.5 5-8a9 9 0 0 0-9-9z" stroke="#10B981" strokeWidth="2" />
      <path d="M12 12l4-4" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="12" cy="12" r="2" fill="#10B981" />
    </svg>
  ),

  // Python - Official Blue & Gold
  Python: () => (
    <svg viewBox="0 0 24 24" className="w-5 h-5">
      <path fill="#3776AB" d="M11.9 2c-3.1 0-5 1.4-5 3.5v2.5h6v1H4.5C2.5 9 1 10.7 1 13.8c0 3 1.6 4.2 4.2 4.2h1.8v-2.5c0-2.3 2-4.5 4.5-4.5h4v-1.5c0-2.3-1.8-4-4-4h.4v-3H11.9z" />
      <path fill="#FFD43B" d="M12.1 22c3.1 0 5-1.4 5-3.5V16h-6v-1h8.4c2 0 3.5-1.7 3.5-4.8 0-3-1.6-4.2-4.2-4.2H17v2.5c0 2.3-2 4.5-4.5 4.5h-4v1.5c0 2.3 1.8 4 4 4h-.4v3h.4z" />
    </svg>
  ),

  // GraphQL - Official Pink #E10098
  GraphQL: () => (
    <svg viewBox="0 0 24 24" fill="#E10098" className="w-5 h-5">
      <path d="M12 2l8.66 5v10L12 22l-8.66-5V7L12 2zm0 2.3L5.34 8.16v7.68L12 19.7l6.66-3.86V8.16L12 4.3z" />
      <circle cx="12" cy="2" r="2" />
      <circle cx="20.66" cy="7" r="2" />
      <circle cx="20.66" cy="17" r="2" />
      <circle cx="12" cy="22" r="2" />
      <circle cx="3.34" cy="17" r="2" />
      <circle cx="3.34" cy="7" r="2" />
    </svg>
  ),

  // Docker - Official Cyan-Blue #2496ED
  Docker: () => (
    <svg viewBox="0 0 24 24" fill="#2496ED" className="w-5 h-5">
      <path d="M13 4h2v2h-2V4zm-3 0h2v2h-2V4zm-3 0h2v2H7V4zm6 3h2v2h-2V7zm-3 0h2v2h-2V7zm-3 0h2v2H7V7zm-3 0h2v2H4V7zm12 3h2v2h-2v-2zm-3 0h2v2h-2v-2zm-3 0h2v2H7v-2zm-3 0h2v2H4v-2zm-3 0h2v2H1v-2zm21.5 2.5c-.3-.2-1.5-.4-2.5-.2-.1-.8-.5-1.5-1.1-2.1l-.6.5c.5.5.8 1.1.9 1.8-.8.3-1.7.5-2.2.5-.5 0-1.5-.2-2-.5H1v1c0 3.3 2.7 6 6 6h7c4.4 0 8-3.6 8-8 0-.4-.1-.8-.5-1z" />
    </svg>
  ),
};

export const AVAILABLE_ICON_NAMES = Object.keys(BRAND_LOGOS);

export function renderSkillIcon(skillNameOrIcon: string): React.ReactElement {
  // Normalize lookup string
  const key = (skillNameOrIcon || '').toLowerCase().replace(/[^a-z0-9]/g, '');

  if (key.includes('react')) return BRAND_LOGOS.React();
  if (key.includes('typescript') || key === 'ts') return BRAND_LOGOS.TypeScript();
  if (key.includes('next')) return BRAND_LOGOS.Nextjs();
  if (key.includes('tailwind')) return BRAND_LOGOS.TailwindCSS();
  if (key.includes('gsap') || key.includes('greensock')) return BRAND_LOGOS.GSAP();
  if (key.includes('three') || key.includes('webgl')) return BRAND_LOGOS.Threejs();
  if (key.includes('framer') || key.includes('motion')) return BRAND_LOGOS.FramerMotion();
  if (key.includes('node') || key.includes('express')) return BRAND_LOGOS.Nodejs();
  if (key.includes('git')) return BRAND_LOGOS.Git();
  if (key.includes('design') || key.includes('figma') || key.includes('token')) return BRAND_LOGOS.DesignSystems();
  if (key.includes('vite')) return BRAND_LOGOS.Vite();
  if (key.includes('websocket') || key.includes('socket')) return BRAND_LOGOS.WebSockets();
  if (key.includes('state') || key.includes('zustand') || key.includes('redux')) return BRAND_LOGOS.StateArchitecture();
  if (key.includes('type') || key.includes('font')) return BRAND_LOGOS.Typography();
  if (key.includes('access') || key.includes('a11y')) return BRAND_LOGOS.Accessibility();
  if (key.includes('perf') || key.includes('profile')) return BRAND_LOGOS.Performance();
  if (key.includes('python')) return BRAND_LOGOS.Python();
  if (key.includes('graphql')) return BRAND_LOGOS.GraphQL();
  if (key.includes('docker')) return BRAND_LOGOS.Docker();

  // If directly matching an icon name in BRAND_LOGOS
  const exact = BRAND_LOGOS[skillNameOrIcon];
  if (exact) return exact();

  // Default to React cyan logo
  return BRAND_LOGOS.React();
}
