import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Project,
  Experience,
  EducationItem,
  Certification,
  BlogPost,
} from '../types/portfolio';
import {
  PERSONAL_INFO as defaultPersonalInfo,
  PROJECTS as defaultProjects,
  EXPERIENCES as defaultExperiences,
  EDUCATION_DATA as defaultEducation,
  CERTIFICATIONS as defaultCertifications,
  BLOG_POSTS as defaultBlogPosts,
} from '../data/portfolioData';
import { fetchPortfolioData } from '../hooks/useApi';

export interface TechSkillItem {
  id: string;
  name: string;
  category: string;
  iconName: string;
}

export const DEFAULT_SKILLS: TechSkillItem[] = [
  { id: 'sk-1', name: 'React 19', category: 'Frontend', iconName: 'React' },
  { id: 'sk-2', name: 'TypeScript', category: 'Frontend', iconName: 'TypeScript' },
  { id: 'sk-3', name: 'Next.js', category: 'Frontend', iconName: 'Nextjs' },
  { id: 'sk-4', name: 'Tailwind CSS', category: 'Frontend', iconName: 'TailwindCSS' },
  { id: 'sk-5', name: 'GSAP 3', category: 'Kinetic', iconName: 'GSAP' },
  { id: 'sk-6', name: 'Three.js / WebGL', category: 'Kinetic', iconName: 'Threejs' },
  { id: 'sk-7', name: 'Framer Motion', category: 'Kinetic', iconName: 'FramerMotion' },
  { id: 'sk-8', name: 'Node.js & Express', category: 'Backend & Tools', iconName: 'Nodejs' },
  { id: 'sk-9', name: 'Git & CI/CD', category: 'Backend & Tools', iconName: 'Git' },
  { id: 'sk-10', name: 'Docker', category: 'Backend & Tools', iconName: 'Docker' },
];

export interface PillarItem {
  index: string;
  title: string;
  description: string;
}

export const DEFAULT_PILLARS: PillarItem[] = [
  {
    index: '01',
    title: 'Typographic Discipline',
    description:
      'Treating optical kerning, baseline equations, and proportional scale as structural engineering problems for effortless scanning and visual calm.',
  },
  {
    index: '02',
    title: 'Deterministic Performance',
    description:
      'Restricting animations strictly to compositor threads and zero layout shifts (CLS < 0.01) to guarantee uninterrupted 60 FPS speed.',
  },
  {
    index: '03',
    title: 'Design Systems',
    description:
      'Constructing accessible, headless component matrices with atomic tokens that eliminate regression defects across production codebases.',
  },
];

export interface PortfolioDataState {
  personalInfo: typeof defaultPersonalInfo;
  pillars: PillarItem[];
  aboutBio: string[];
  skills: TechSkillItem[];
  projects: Project[];
  experiences: Experience[];
  education: EducationItem[];
  certifications: Certification[];
  blogPosts: BlogPost[];
}

// IMPORTANT: Never wipe this key list — always add new versions, never remove old ones.
// This ensures user data is migrated forward rather than lost on version bumps.
const STORAGE_KEY = 'm_hasan_portfolio_state_v4';
const LEGACY_KEYS = [
  'm_hasan_portfolio_state_v3',
  'm_hasan_portfolio_state_v2',
  'm_hasan_portfolio_state_v1',
];

const defaultState: PortfolioDataState = {
  personalInfo: defaultPersonalInfo,
  pillars: DEFAULT_PILLARS,
  aboutBio: [
    'I am a Senior Frontend Engineer and Creative Technologist based in Dhaka, building high-throughput web applications, design systems, and typographic digital products.',
    'I focus on the intersection of algorithmic precision and Swiss editorial clarity: every interface is stripped to its essential communicative purpose with zero visual noise.',
  ],
  skills: DEFAULT_SKILLS,
  projects: defaultProjects,
  experiences: defaultExperiences,
  education: defaultEducation,
  certifications: defaultCertifications,
  blogPosts: defaultBlogPosts,
};

/**
 * Load saved state with forward migration.
 * Priority: current key → most recent legacy key → default state.
 * User data is NEVER lost on version bumps — it is migrated and patched.
 */
function loadStateWithMigration(): PortfolioDataState {
  try {
    // 1. Try current key first
    const current = localStorage.getItem(STORAGE_KEY);
    if (current) {
      return JSON.parse(current);
    }

    // 2. Try legacy keys in reverse order (most recent first)
    for (const legacyKey of LEGACY_KEYS) {
      const legacy = localStorage.getItem(legacyKey);
      if (legacy) {
        const parsed: PortfolioDataState = JSON.parse(legacy);

        // Patch any specific field changes introduced in this version:
        // v4 patch: remove honors from education entries so the badge is hidden
        if (parsed.education) {
          parsed.education = parsed.education.map((edu) => ({
            ...edu,
            honors: '',
          }));
        }

        // Save migrated data to new key and clean up old key
        localStorage.setItem(STORAGE_KEY, JSON.stringify(parsed));
        localStorage.removeItem(legacyKey);
        console.info(`[Portfolio] Migrated data from ${legacyKey} → ${STORAGE_KEY}`);
        return parsed;
      }
    }
  } catch (e) {
    console.error('[Portfolio] Failed to load/migrate state:', e);
  }

  // 3. No saved data anywhere — use defaults
  return defaultState;
}

interface PortfolioContextType {
  data: PortfolioDataState;
  updatePersonalInfo: (info: Partial<typeof defaultPersonalInfo>) => void;
  updateAboutBio: (bio: string[]) => void;
  updatePillars: (pillars: PillarItem[]) => void;
  // Skills
  addSkill: (skill: Omit<TechSkillItem, 'id'>) => void;
  updateSkill: (id: string, skill: Partial<TechSkillItem>) => void;
  deleteSkill: (id: string) => void;
  // Projects
  addProject: (project: Project) => void;
  updateProject: (id: string, project: Partial<Project>) => void;
  deleteProject: (id: string) => void;
  // Experience
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  deleteExperience: (id: string) => void;
  // Education & Certifications
  updateEducation: (edu: EducationItem[]) => void;
  updateCertifications: (certs: Certification[]) => void;
  // Blog
  addBlogPost: (post: BlogPost) => void;
  updateBlogPost: (id: string, post: Partial<BlogPost>) => void;
  deleteBlogPost: (id: string) => void;
  // Persistence
  resetToDefaults: () => void;
  saveData: (newData: PortfolioDataState) => void;
}

const PortfolioContext = createContext<PortfolioContextType | null>(null);

export const PortfolioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<PortfolioDataState>(() => {
    return loadStateWithMigration();
  });

  // On mount, try to fetch latest data from backend (overrides localStorage if DB has data)
  useEffect(() => {
    fetchPortfolioData().then((dbData) => {
      if (!dbData) return; // No backend data yet — keep localStorage
      try {
        const merged: PortfolioDataState = {
          personalInfo: (dbData.personal_info as typeof defaultPersonalInfo) ?? data.personalInfo,
          pillars: (dbData.about as any)?.pillars ?? data.pillars,
          aboutBio: (dbData.about as any)?.bio ?? data.aboutBio,
          skills: (dbData.skills as any) ?? data.skills,
          projects: (dbData.projects as any) ?? data.projects,
          experiences: (dbData.experience as any) ?? data.experiences,
          education: (dbData.education as any)?.items ?? data.education,
          certifications: (dbData.education as any)?.certifications ?? data.certifications,
          blogPosts: (dbData.blog_posts as any) ?? data.blogPosts,
        };
        setData(merged);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      } catch (e) {
        console.error('Failed to merge DB data:', e);
      }
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const persist = (nextState: PortfolioDataState) => {
    setData(nextState);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextState));
    } catch (e) {
      console.error('Failed to save to localStorage', e);
    }
  };

  const updatePersonalInfo = (info: Partial<typeof defaultPersonalInfo>) => {
    persist({
      ...data,
      personalInfo: {
        ...data.personalInfo,
        ...info,
      },
    });
  };

  const updateAboutBio = (bio: string[]) => {
    persist({ ...data, aboutBio: bio });
  };

  const updatePillars = (pillars: PillarItem[]) => {
    persist({ ...data, pillars });
  };

  const addSkill = (skill: Omit<TechSkillItem, 'id'>) => {
    const newItem: TechSkillItem = {
      ...skill,
      id: 'sk-' + Date.now(),
    };
    persist({ ...data, skills: [...data.skills, newItem] });
  };

  const updateSkill = (id: string, updated: Partial<TechSkillItem>) => {
    persist({
      ...data,
      skills: data.skills.map((s) => (s.id === id ? { ...s, ...updated } : s)),
    });
  };

  const deleteSkill = (id: string) => {
    persist({
      ...data,
      skills: data.skills.filter((s) => s.id !== id),
    });
  };

  const addProject = (project: Project) => {
    persist({ ...data, projects: [project, ...data.projects] });
  };

  const updateProject = (id: string, updated: Partial<Project>) => {
    persist({
      ...data,
      projects: data.projects.map((p) => (p.id === id ? { ...p, ...updated } : p)),
    });
  };

  const deleteProject = (id: string) => {
    persist({
      ...data,
      projects: data.projects.filter((p) => p.id !== id),
    });
  };

  const addExperience = (exp: Experience) => {
    persist({ ...data, experiences: [exp, ...data.experiences] });
  };

  const updateExperience = (id: string, updated: Partial<Experience>) => {
    persist({
      ...data,
      experiences: data.experiences.map((e) => (e.id === id ? { ...e, ...updated } : e)),
    });
  };

  const deleteExperience = (id: string) => {
    persist({
      ...data,
      experiences: data.experiences.filter((e) => e.id !== id),
    });
  };

  const updateEducation = (education: EducationItem[]) => {
    persist({ ...data, education });
  };

  const updateCertifications = (certifications: Certification[]) => {
    persist({ ...data, certifications });
  };

  const addBlogPost = (post: BlogPost) => {
    persist({ ...data, blogPosts: [post, ...data.blogPosts] });
  };

  const updateBlogPost = (id: string, updated: Partial<BlogPost>) => {
    persist({
      ...data,
      blogPosts: data.blogPosts.map((b) => (b.id === id ? { ...b, ...updated } : b)),
    });
  };

  const deleteBlogPost = (id: string) => {
    persist({
      ...data,
      blogPosts: data.blogPosts.filter((b) => b.id !== id),
    });
  };

  const resetToDefaults = () => {
    persist(defaultState);
  };

  const saveData = (newData: PortfolioDataState) => {
    persist(newData);
  };

  return (
    <PortfolioContext.Provider
      value={{
        data,
        updatePersonalInfo,
        updateAboutBio,
        updatePillars,
        addSkill,
        updateSkill,
        deleteSkill,
        addProject,
        updateProject,
        deleteProject,
        addExperience,
        updateExperience,
        deleteExperience,
        updateEducation,
        updateCertifications,
        addBlogPost,
        updateBlogPost,
        deleteBlogPost,
        resetToDefaults,
        saveData,
      }}
    >
      {children}
    </PortfolioContext.Provider>
  );
};

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within a PortfolioProvider');
  }
  return context;
};
