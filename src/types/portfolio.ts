export interface Project {
  id: string;
  title: string;
  subtitle: string;
  category: string; // widened to string so admin can type any category
  year: string;
  role: string;
  image: string;
  summary: string;
  challenge: string;
  solution: string;
  metrics: { label: string; value: string }[];
  technologies: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
}

export interface Experience {
  id: string;
  period: string;
  role: string;
  company: string;
  location: string;
  type: string;
  description: string;
  achievements: string[];
  stack: string[];
}

export interface SkillCategory {
  name: string;
  skills: {
    name: string;
    level: number; // 1-100
    experience: string;
    focus: string;
  }[];
}

export interface EducationItem {
  id: string;
  degree: string;
  institution: string;
  period: string;
  location: string;
  honors?: string;
  description: string;
  coursework: string[];
}

export interface Certification {
  name: string;
  issuer: string;
  year: string;
  credentialId?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  date: string;
  readTime: string;
  category: string;
  excerpt: string;
  content: string;
  image?: string;
  featured?: boolean;
}

