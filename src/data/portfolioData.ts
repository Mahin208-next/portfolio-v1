import { Project, Experience, SkillCategory, EducationItem, Certification, BlogPost } from '../types/portfolio';

export const PERSONAL_INFO = {
  name: 'M. Hasan',
  fullName: 'Mossadik Hasan',
  title: 'Creative Technologist & Senior Frontend Engineer',
  heroHeadlineLine1: 'Creative',
  heroHeadlineAccent: 'technologist',
  heroHeadlineLine2: '& Senior Frontend Engineer',
  aboutHeading: 'This is Mossadik Hasan',
  tagline: 'Sculpting high-performance web systems with Swiss typographic discipline and kinetic precision.',
  email: 'hasan241-15-127@diu.edu.bd',
  location: 'Dhaka, Bangladesh · Available Worldwide',
  availability: 'Open for Select Contracts & Senior Roles',
  timezone: 'Asia/Dhaka',
  heroPortrait: '/src/assets/images/hero_creative_portrait_1793815484427.jpg',
  logoText: 'M. Hasan',
  logoImage: '',
  logoType: 'text' as 'text' | 'image' | 'both',
  logoFontSize: 'text-xl' as 'text-lg' | 'text-xl' | 'text-2xl',
  resumeUrl: '',
  stats: [
    { label: 'Years of Experience', value: '07+' },
    { label: 'Shipped Systems', value: '42' },
    { label: 'Lighthouse Performance', value: '99.8%' },
    { label: 'Lines of Code Refactored', value: '450k+' },
  ],
  socials: [
    { name: 'GitHub', url: 'https://github.com' },
    { name: 'LinkedIn', url: 'https://linkedin.com' },
    { name: 'Twitter / X', url: 'https://x.com' },
    { name: 'ReadCV', url: 'https://read.cv' },
  ],
};

export const PROJECTS: Project[] = [
  {
    id: 'kroma-terminal',
    title: 'Kroma Alpha Terminal',
    subtitle: 'Institutional-grade orderbook and liquidity visualization engine',
    category: 'Fintech',
    year: '2025',
    role: 'Lead Frontend Architect',
    image: '/src/assets/images/project_kroma_fintech_1793815484054.jpg',
    summary: 'A sub-millisecond market monitoring workspace built for algorithmic prop desks, rendering 12,000 live updates per second with zero thread blocking.',
    challenge: 'Conventional React DOM trees choked under high-frequency WebSocket order ticks, resulting in frame drops, input latency spikes, and 280ms render bottlenecks.',
    solution: 'Designed an off-screen canvas virtualization layer synchronized with an immutable state ring buffer. Layered GSAP kinetic transitions for instant spread shifts and tabular data precision.',
    metrics: [
      { label: 'Throughput', value: '12k events/sec' },
      { label: 'Frame Budget', value: '60 FPS stable' },
      { label: 'Latency Drop', value: '-84%' },
      { label: 'Daily Trading Volume', value: '$180M+' },
    ],
    technologies: ['React 19', 'TypeScript', 'GSAP', 'WebGL / Canvas', 'WebSockets', 'Tailwind CSS'],
    liveUrl: 'https://example.com/kroma',
    githubUrl: 'https://github.com/example/kroma-terminal',
    featured: true,
  },
  {
    id: 'aura-soundscape',
    title: 'Aura Kinetic Soundscape',
    subtitle: 'Interactive 3D audio-reactive typography visualizer',
    category: 'Creative & Audio',
    year: '2024',
    role: 'Creative Technologist',
    image: '/src/assets/images/project_sound_spatial_1793815485462.jpg',
    summary: 'An experimental digital instrument translating real-time FFT frequency spectrums into generative typographic ribbons and geometric sound fields.',
    challenge: 'Balancing computational Web Audio API analysis with smooth typographic glyph deformations without incurring garbage collection stutters.',
    solution: 'Implemented mathematical glyph contour displacement using GPU fragment shaders and GSAP tween coordination, allowing live microphone input or synthesized stems.',
    metrics: [
      { label: 'Audio Latency', value: '4.2ms' },
      { label: 'Frequencies Analyzed', value: '1024 bins' },
      { label: 'Awwwards Recognition', value: 'Site of the Day' },
      { label: 'User Retention', value: '4.8 min avg' },
    ],
    technologies: ['Web Audio API', 'GSAP 3', 'GLSL / Three.js', 'React', 'TypeScript'],
    liveUrl: 'https://example.com/aura',
    githubUrl: 'https://github.com/example/aura-soundscape',
    featured: true,
  },
  {
    id: 'monograph-studio',
    title: 'The Monograph Studio',
    subtitle: 'Swiss editorial publishing and typography formatting workspace',
    category: 'Publishing & Tools',
    year: '2024',
    role: 'Product Designer & Full-Stack Engineer',
    image: '/src/assets/images/project_editorial_studio_1793815486069.jpg',
    summary: 'A minimalist publishing environment featuring hyphenation algorithms, optical margin alignment, and print-ready vector PDF layout exports.',
    challenge: 'Standard browser text flow engines fail basic typographic rules—leaving widows, broken kerning pairs, and ragged columns.',
    solution: 'Engineered an in-browser Knuth-Plass line breaking simulation that computes optimal line breaks dynamically with real-time word-spacing adjustments.',
    metrics: [
      { label: 'Typographic Accuracy', value: '100% Knuth-Plass' },
      { label: 'Active Writers', value: '18,500+' },
      { label: 'Export Time', value: '< 1.2s' },
      { label: 'Community Rating', value: '4.95 / 5.0' },
    ],
    technologies: ['React 19', 'TypeScript', 'Tailwind CSS', 'Web Workers', 'Canvas2PDF'],
    liveUrl: 'https://example.com/monograph',
    githubUrl: 'https://github.com/example/monograph-studio',
    featured: true,
  },
  {
    id: 'strata-design-system',
    title: 'Strata Primitives',
    subtitle: 'Zero-runtime headless design system and accessible component matrix',
    category: 'Design Systems',
    year: '2023',
    role: 'Design Systems Lead',
    image: '/src/assets/images/project_kroma_fintech_1793815484054.jpg',
    summary: 'An enterprise token-driven design system powering 6 commercial products with automated WCAG AAA testing and deterministic CSS custom properties.',
    challenge: 'Inconsistent component implementations and redundant styling overhead caused bloated bundle sizes and recurring accessibility defects.',
    solution: 'Created an unopinionated composable API surface with 52 primitives, reducing cross-team regression tickets by 72% and saving 140KB in vendor bundle payloads.',
    metrics: [
      { label: 'Adopted Products', value: '6 Applications' },
      { label: 'Bundle Footprint', value: '4.8 kB gzip' },
      { label: 'WCAG Compliance', value: '100% Level AA' },
      { label: 'Dev Velocity Gain', value: '+35%' },
    ],
    technologies: ['TypeScript', 'React', 'Radix Primitives', 'Tailwind CSS', 'Storybook'],
    liveUrl: 'https://example.com/strata',
    githubUrl: 'https://github.com/example/strata-primitives',
    featured: false,
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp-1',
    period: '2023 — Present',
    role: 'Lead Frontend Engineer & Creative Technologist',
    company: 'Studio Monolith',
    location: 'Remote · Singapore / Global',
    type: 'Full-time',
    description: 'Directing frontend architecture and interactive craft for high-visibility clients across fintech, luxury editorial, and spatial software.',
    achievements: [
      'Spearheaded core frontend architecture for 4 enterprise platforms, driving 99+ Lighthouse performance scores.',
      'Authored internal kinetic animation guidelines combining GSAP with Motion for predictable 60fps mobile execution.',
      'Mentored 12 mid and senior frontend engineers across distributed time zones in modern TypeScript patterns and performance profiling.',
    ],
    stack: ['React 19', 'TypeScript', 'GSAP', 'Next.js', 'Tailwind CSS', 'WebGL'],
  },
  {
    id: 'exp-2',
    period: '2021 — 2023',
    role: 'Senior UI/UX Systems Engineer',
    company: 'Strata Software Labs',
    location: 'Dhaka & Singapore',
    type: 'Full-time',
    description: 'Led the Design Systems initiative, bridging product designers and engineering teams to establish single-source-of-truth component libraries.',
    achievements: [
      'Constructed accessible headless component matrix adopted by 6 production products serving 2M+ monthly active users.',
      'Cut design-to-production turnaround time by 38% through standardized token schemas and automated visual regression pipelines.',
      'Eliminated cumulative layout shift (CLS) across primary conversion funnels to zero.',
    ],
    stack: ['React', 'TypeScript', 'Tailwind CSS', 'Storybook', 'Figma Tokens', 'Vitest'],
  },
  {
    id: 'exp-3',
    period: '2019 — 2021',
    role: 'Frontend Engineer',
    company: 'Vertex Interactive',
    location: 'Dhaka, Bangladesh',
    type: 'Full-time',
    description: 'Engineered responsive web applications, interactive financial dashboards, and brand microsites with rich kinetic storytelling.',
    achievements: [
      'Built custom SVG and Canvas charting libraries for real-time portfolio analytics and historical backtesting data.',
      'Optimized asset delivery pipeline reducing average first-contentful-paint (FCP) from 2.8s to 0.7s.',
    ],
    stack: ['JavaScript (ESNext)', 'React', 'D3.js', 'CSS Modules', 'Redux Toolkit', 'Webpack'],
  },
  {
    id: 'exp-4',
    period: '2018 — 2019',
    role: 'Research Associate · HCI & Algorithmic UI',
    company: 'DIU Center for Computational Intelligence',
    location: 'Dhaka, Bangladesh',
    type: 'Academic Research',
    description: 'Investigated dynamic typographic optical sizing and responsive grid algorithms across multi-viewport devices.',
    achievements: [
      'Co-authored research on fluid typographic scaling algorithms reducing readability friction on high-density displays.',
      'Developed prototype tools for automated typographic contrast verification according to WCAG recommendations.',
    ],
    stack: ['JavaScript', 'Python', 'CSS Typography', 'Computational Geometry'],
  },
];

export const SKILL_CATEGORIES: SkillCategory[] = [
  {
    name: 'Frontend & Architecture',
    skills: [
      { name: 'React 19 / Modern Hooks', level: 98, experience: '7 yrs', focus: 'Concurrent rendering, server components, virtualization' },
      { name: 'TypeScript', level: 95, experience: '6 yrs', focus: 'Strict type safety, generics, schema validation (Zod)' },
      { name: 'Next.js & Vite', level: 92, experience: '5 yrs', focus: 'Streaming SSR, bundle splitting, modern toolchains' },
      { name: 'State Architecture', level: 90, experience: '6 yrs', focus: 'Zustand, XState deterministic machines, React Context' },
    ],
  },
  {
    name: 'Kinetic & Typography',
    skills: [
      { name: 'GSAP (GreenSock)', level: 96, experience: '5 yrs', focus: 'Timelines, ScrollTrigger, kinetic text, SVG paths' },
      { name: 'Tailwind CSS', level: 98, experience: '5 yrs', focus: 'Custom variants, token architecture, zero-slop utility craft' },
      { name: 'Micro-Typography', level: 94, experience: '7 yrs', focus: 'Fluid clamps, optical kerning, vertical rhythm, tabular nums' },
      { name: 'Motion / Framer Motion', level: 90, experience: '4 yrs', focus: 'Layout animations, gesture physics, orchestrations' },
    ],
  },
  {
    name: 'Graphics & Performance',
    skills: [
      { name: 'WebGL / Three.js', level: 82, experience: '3 yrs', focus: 'Custom shaders, particle simulations, 3D texturing' },
      { name: 'Web Audio API', level: 85, experience: '3 yrs', focus: 'Audio synthesis, FFT frequency analysis, generative sound' },
      { name: 'Performance Profiling', level: 94, experience: '6 yrs', focus: 'Chrome DevTools, 60fps budgets, memory leak mitigation' },
      { name: 'Web Accessibility (a11y)', level: 95, experience: '5 yrs', focus: 'WCAG 2.1 AA/AAA, ARIA patterns, keyboard navigation' },
    ],
  },
  {
    name: 'Systems & Protocols',
    skills: [
      { name: 'Design Tokens & Systems', level: 95, experience: '5 yrs', focus: 'Radix, headless primitives, atomic composition' },
      { name: 'Node.js & Express', level: 88, experience: '5 yrs', focus: 'REST APIs, server-side proxies, event streaming' },
      { name: 'WebSockets & Streaming', level: 86, experience: '4 yrs', focus: 'High-frequency telemetry, binary buffers, reconnection' },
      { name: 'Git & CI/CD Pipelines', level: 90, experience: '7 yrs', focus: 'Trunk-based workflow, automated linting, test suites' },
    ],
  },
];

export const EDUCATION_DATA: EducationItem[] = [
  {
    id: 'diu-degree',
    degree: 'Bachelor of Science in Computer Science & Engineering (B.Sc. CSE)',
    institution: 'Dhaka International University (DIU)',
    period: '2016 — 2020',
    location: 'Dhaka, Bangladesh',
    honors: 'Graduated with First Class Honors · Dean’s Academic Excellence Award',
    description: 'Rigorous 4-year curriculum covering data structures, algorithm design, software engineering methodologies, distributed systems, and computer human interaction.',
    coursework: [
      'Advanced Data Structures & Algorithms',
      'Human-Computer Interaction (HCI)',
      'Computer Graphics & Image Processing',
      'Software Architecture & Design Patterns',
      'Database Management Systems',
      'Artificial Intelligence & Automata Theory',
    ],
  },
];

export const CERTIFICATIONS: Certification[] = [
  {
    name: 'Advanced Web Performance Engineering',
    issuer: 'Frontend Masters / Web Performance Institute',
    year: '2024',
    credentialId: 'WPE-9482-HS',
  },
  {
    name: 'GSAP Animation Masterclass & Creative Coding',
    issuer: 'GreenSock Official Certification',
    year: '2023',
    credentialId: 'GSAP-CREATIVE-882',
  },
  {
    name: 'Enterprise Design Systems Architecture',
    issuer: 'Design System Alliance',
    year: '2023',
    credentialId: 'DSA-ARCH-7102',
  },
  {
    name: 'Certified Professional in Web Accessibility (CPACC)',
    issuer: 'IAAP (International Association of Accessibility)',
    year: '2022',
    credentialId: 'IAAP-CPACC-4911',
  },
];

export const BLOG_POSTS: BlogPost[] = [
  {
    id: 'post-1',
    title: 'The Mathematics of Typographic Rhythm in Modern Web Applications',
    slug: 'mathematics-of-typographic-rhythm',
    date: 'February 2026',
    readTime: '6 min read',
    category: 'Typography & Design',
    excerpt: 'Why arbitrary line-height values break visual cohesion and how mathematical baseline grids ensure effortless editorial scanning across viewport transitions.',
    image: '/src/assets/images/project_editorial_studio_1793815486069.jpg',
    content: `
Typography on the web is fundamentally architectural. When text fails to hold a disciplined mathematical relationship with surrounding viewport metrics, reader fatigue accumulates rapidly.

### 1. The Fluid Type Clamp Equation
Instead of discrete media query jumps that disrupt layout harmony, fluid typography utilizes linear interpolation across standard viewport limits:

$$V_{font} = clamp(V_{min}, V_{min} + (V_{max} - V_{min}) \\times \\frac{W - W_{min}}{W_{max} - W_{min}}, V_{max})$$

In CSS implementation:
\`\`\`css
font-size: clamp(2rem, 1.45rem + 2.75vw, 4.5rem);
line-height: clamp(1.15, 1.25 - 0.1vw, 1.05);
\`\`\`

### 2. Tabular Numeral Alignment
Financial data and technical metrics should never use proportional figures. Proportional numerals produce distracting horizontal wobbles as values update. Applying \`font-variant-numeric: tabular-nums\` forces fixed glyph widths, preserving vertical scanning lanes.

### 3. The 65-Character Measure
The eye exhausts itself when scanning lines broader than 75 characters or narrower than 45 characters. By constraining editorial containers to \`max-w-[68ch]\`, legibility remains preserved across arbitrary ultrawide displays.
    `,
  },
  {
    id: 'post-2',
    title: 'Deterministic Micro-Animations with GSAP: Eliminating UI Jitter',
    slug: 'deterministic-micro-animations-gsap',
    date: 'January 2026',
    readTime: '5 min read',
    category: 'Engineering & Motion',
    excerpt: 'An engineering deep dive into compositor-only properties, layout thrashing avoidance, and frame-budget preservation for high-frequency web apps.',
    image: '/src/assets/images/project_sound_spatial_1793815485462.jpg',
    content: `
Smooth motion is not an aesthetic decoration; it is functional visual feedback that establishes spatial permanence for the user. Yet many animations degrade performance by triggering browser layout recalibrations.

### 1. The Golden Rule: Transform and Opacity Only
Whenever you animate \`top\`, \`left\`, \`width\`, \`height\`, or \`margin\`, the browser invalidates layout trees across all parent nodes. By restricting animation curves strictly to \`transform\` (translateX, translateY, scale, rotate) and \`opacity\`, execution shifts entirely to the GPU compositor thread.

\`\`\`typescript
// High performance: GPU compositor layer
gsap.to(elementRef.current, {
  yPercent: -10,
  opacity: 1,
  duration: 0.6,
  ease: 'power3.out',
  force3D: true,
});
\`\`\`

### 2. Timeline Orchestration & Garbage Collection
Instantiating disconnected tweens causes timeline synchronization drifts. By structuring transitions into cohesive \`gsap.timeline({ defaults: { ease: 'power2.out' } })\` sequences and cleaning them up in React \`useEffect\` teardowns, memory leaks are completely mitigated.
    `,
  },
  {
    id: 'post-3',
    title: 'Zero-Layout-Shift Design Systems: A Practical Engineering Blueprint',
    slug: 'zero-layout-shift-design-systems',
    date: 'December 2025',
    readTime: '7 min read',
    category: 'Architecture',
    excerpt: 'How pre-allocated layout bounds, font-display swaps, and skeleton geometries eliminate Cumulative Layout Shift (CLS) on production portals.',
    image: '/src/assets/images/project_kroma_fintech_1793815484054.jpg',
    content: `
Cumulative Layout Shift (CLS) degrades both search ranking and user trust. A button shifting 4 pixels right as an asynchronous font or icon arrives turns intentional user interaction into misclicks.

### 1. Aspect Ratio Containers & Intrinsic Sizing
Never render an image or visual canvas without an explicit aspect ratio. Using CSS \`aspect-ratio: 16 / 9\` reserves the precise spatial footprint before the network payload completes.

### 2. Font Fallback Metrics Matching
When web fonts load, the sudden shift from system sans-serif to the loaded display face can trigger layout shifts. By tuning fallback font overrides (\`size-adjust\`, \`ascent-override\`, \`descent-override\`), the system font occupies the exact spatial metrics of the incoming web typeface.
    `,
  },
];
