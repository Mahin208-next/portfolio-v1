import React, { useState } from 'react';
import {
  ArrowLeft, User, FileText, Sparkles, Layers, Briefcase,
  GraduationCap, BookOpen, Mail, Settings, RotateCcw,
  Plus, Trash2, Upload, ChevronDown, ChevronUp, Eye, EyeOff,
  Check, AlertCircle, Loader2, LogOut, Image as ImageIcon,
  ArrowUp, ArrowDown, Share2, FileCheck, Palette, ExternalLink,
  Sliders, ShieldCheck, Sun, Moon
} from 'lucide-react';
import { usePortfolio, TechSkillItem, PillarItem } from '../../context/PortfolioContext';
import { AVAILABLE_ICON_NAMES, renderSkillIcon } from '../../utils/skillIcons';
import { Project, Experience, Certification, BlogPost } from '../../types/portfolio';
import { useAutoSave } from '../../hooks/useAutoSave';
import { logout, changePassword } from '../../hooks/useApi';

interface AdminPanelProps {
  onBackToSite: () => void;
  onLogout: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export type SidebarSection =
  | 'overview'
  | 'branding'
  | 'hero'
  | 'about'
  | 'skills'
  | 'experience'
  | 'projects'
  | 'education'
  | 'blog'
  | 'contact'
  | 'socials'
  | 'resume'
  | 'theme'
  | 'settings';

const SIDEBAR_ITEMS: { id: SidebarSection; label: string; icon: React.ElementType; group: string }[] = [
  { id: 'overview',    label: 'Dashboard',         icon: Sparkles,       group: 'Main' },
  { id: 'branding',    label: 'Website Branding',  icon: ImageIcon,      group: 'Content' },
  { id: 'hero',        label: 'Hero / Home',       icon: User,           group: 'Content' },
  { id: 'about',       label: 'About Section',     icon: FileText,       group: 'Content' },
  { id: 'skills',      label: 'Skills Matrix',     icon: Sparkles,       group: 'Content' },
  { id: 'experience',  label: 'Experience',         icon: Briefcase,      group: 'Content' },
  { id: 'projects',    label: 'Projects',          icon: Layers,         group: 'Content' },
  { id: 'education',   label: 'Education & Certs', icon: GraduationCap,  group: 'Content' },
  { id: 'blog',        label: 'Blog Section',      icon: BookOpen,       group: 'Content' },
  { id: 'contact',     label: 'Contact Info',      icon: Mail,           group: 'Content' },
  { id: 'socials',     label: 'Social Media',      icon: Share2,         group: 'Content' },
  { id: 'resume',      label: 'Resume / CV',       icon: FileCheck,      group: 'Content' },
  { id: 'theme',       label: 'Theme & Style',     icon: Palette,        group: 'Admin' },
  { id: 'settings',    label: 'General & Password',icon: Settings,       group: 'Admin' },
];

const inputCls = 'w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 transition-colors placeholder-zinc-400';
const labelCls = 'block text-xs font-medium text-zinc-500 dark:text-zinc-400 mb-1 uppercase tracking-wider';

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToSite, onLogout, darkMode, setDarkMode,
}) => {
  const {
    data, updatePersonalInfo, updateAboutBio, updatePillars,
    addSkill, updateSkill, deleteSkill,
    addProject, updateProject, deleteProject,
    addExperience, updateExperience, deleteExperience,
    updateEducation, updateCertifications,
    addBlogPost, updateBlogPost, deleteBlogPost,
    resetToDefaults, saveData,
  } = usePortfolio();

  const [activeSection, setActiveSection] = useState<SidebarSection>('overview');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Auto-save to backend database
  const { status: saveStatus, lastSavedAt } = useAutoSave(data, true);

  // Password change state
  const [pwCurrent, setPwCurrent] = useState('');
  const [pwNew, setPwNew] = useState('');
  const [pwConfirm, setPwConfirm] = useState('');
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);
  const [showCurrentPw, setShowCurrentPw] = useState(false);
  const [showNewPw, setShowNewPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      if (typeof ev.target?.result === 'string') callback(ev.target.result);
    };
    reader.readAsDataURL(file);
  };

  const handleLogout = async () => {
    await logout();
    onLogout();
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwError('');
    setPwSuccess('');
    if (pwNew !== pwConfirm) { setPwError('Passwords do not match'); return; }
    if (pwNew.length < 8) { setPwError('New password must be at least 8 characters'); return; }
    setPwLoading(true);
    const result = await changePassword(pwCurrent, pwNew);
    setPwLoading(false);
    if (result.success) {
      setPwSuccess('Password changed successfully!');
      setPwCurrent(''); setPwNew(''); setPwConfirm('');
    } else {
      setPwError(result.error ?? 'Failed to change password');
    }
  };

  // Reordering helpers
  const reorder = <T,>(list: T[], index: number, direction: 'up' | 'down'): T[] => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= list.length) return list;
    const copy = [...list];
    const [moved] = copy.splice(index, 1);
    copy.splice(targetIndex, 0, moved);
    return copy;
  };

  const SaveBadge = () => {
    if (saveStatus === 'saving') return (
      <span className="flex items-center gap-1.5 text-xs text-zinc-400 font-mono">
        <Loader2 size={12} className="animate-spin text-yellow-400" /> Saving to database...
      </span>
    );
    if (saveStatus === 'saved') return (
      <span className="flex items-center gap-1.5 text-xs text-emerald-500 font-mono">
        <Check size={12} /> Auto-Saved
      </span>
    );
    if (saveStatus === 'error') return (
      <span className="flex items-center gap-1.5 text-xs text-red-400 font-mono">
        <AlertCircle size={12} /> Save failed
      </span>
    );
    if (lastSavedAt) return (
      <span className="text-xs text-zinc-500 font-mono">
        Synced {lastSavedAt.toLocaleTimeString()}
      </span>
    );
    return (
      <span className="flex items-center gap-1 text-xs text-zinc-400 font-mono">
        <ShieldCheck size={12} className="text-emerald-500" /> Auto-save active
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-100 flex">
      {/* ═══════════ SIDEBAR ═══════════ */}
      <aside className={`${sidebarOpen ? 'w-60' : 'w-16'} shrink-0 bg-white dark:bg-zinc-900 border-r border-zinc-200 dark:border-zinc-800 flex flex-col transition-all duration-300 sticky top-0 h-screen select-none`}>
        {/* Logo Header */}
        <div className="h-16 px-4 flex items-center justify-between border-b border-zinc-100 dark:border-zinc-800 shrink-0">
          <div className="flex items-center gap-2 overflow-hidden">
            <span className="text-yellow-400 font-extrabold font-mono text-xl">✦</span>
            {sidebarOpen && (
              <span className="text-sm font-bold text-zinc-900 dark:text-white truncate">
                Admin Console
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 p-1 rounded-md"
            title={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
          >
            {sidebarOpen ? <ChevronUp size={14} className="rotate-90" /> : <ChevronDown size={14} className="rotate-90" />}
          </button>
        </div>

        {/* Sidebar Nav */}
        <nav className="flex-1 py-3 overflow-y-auto px-2 space-y-4">
          {['Main', 'Content', 'Admin'].map((group) => {
            const items = SIDEBAR_ITEMS.filter((item) => item.group === group);
            if (!items.length) return null;
            return (
              <div key={group} className="space-y-1">
                {sidebarOpen && (
                  <p className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
                    {group}
                  </p>
                )}
                {items.map((item) => {
                  const Icon = item.icon;
                  const active = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setActiveSection(item.id)}
                      className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${
                        active
                          ? 'bg-yellow-400 text-zinc-950 font-bold shadow-sm'
                          : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800'
                      }`}
                      title={item.label}
                    >
                      <Icon size={15} className="shrink-0" />
                      {sidebarOpen && <span className="truncate">{item.label}</span>}
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>

        {/* Footer actions */}
        <div className="border-t border-zinc-100 dark:border-zinc-800 p-3 shrink-0 space-y-1">
          <button
            type="button"
            onClick={onBackToSite}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <ArrowLeft size={14} className="shrink-0" />
            {sidebarOpen && 'View Live Website'}
          </button>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 text-xs text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
          >
            <LogOut size={14} className="shrink-0" />
            {sidebarOpen && 'Logout'}
          </button>
        </div>
      </aside>

      {/* ═══════════ MAIN CONTENT AREA ═══════════ */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 h-16 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-base text-zinc-900 dark:text-white">
              {SIDEBAR_ITEMS.find((i) => i.id === activeSection)?.label}
            </h2>
          </div>
          <div className="flex items-center gap-4">
            <SaveBadge />
            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 text-zinc-500 hover:text-zinc-800 dark:hover:text-zinc-200 rounded-lg hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors text-xs"
              title="Toggle theme"
            >
              {darkMode ? <Sun size={15} /> : <Moon size={15} />}
            </button>
            <button
              type="button"
              onClick={onBackToSite}
              className="px-3.5 py-1.5 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-lg shadow-sm transition-colors"
            >
              Live Site →
            </button>
          </div>
        </header>

        {/* Scrollable Container */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 max-w-5xl">

          {/* ════ 1. DASHBOARD OVERVIEW ════ */}
          {activeSection === 'overview' && (
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Portfolio Overview</h1>
                <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-1">
                  Control every element of your portfolio in real time. Changes automatically persist to the database.
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                {[
                  { label: 'Projects',   count: data.projects.length,    icon: '🗂️' },
                  { label: 'Blog Posts', count: data.blogPosts.length,   icon: '✍️' },
                  { label: 'Skills',     count: data.skills.length,      icon: '⚡' },
                  { label: 'Experience', count: data.experiences.length, icon: '🏢' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-4 shadow-xs">
                    <div className="text-2xl mb-1.5">{stat.icon}</div>
                    <div className="text-2xl font-bold">{stat.count}</div>
                    <div className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              <SectionCard title="Quick Management Links" description="Jump directly to any section to start editing.">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {SIDEBAR_ITEMS.filter((i) => i.group === 'Content').map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setActiveSection(item.id)}
                        className="flex items-center gap-2 p-3 text-xs font-medium rounded-lg border border-zinc-200 dark:border-zinc-800 hover:border-yellow-400 hover:bg-yellow-400/5 hover:text-yellow-500 transition-all text-left"
                      >
                        <Icon size={14} className="shrink-0 text-yellow-400" />
                        <span className="truncate">{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════ 2. WEBSITE BRANDING ════ */}
          {activeSection === 'branding' && (
            <div className="space-y-6">
              <SectionCard title="Website Logo & Brand Display" description="Customize how your name and logo appear in the navigation bar.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Logo Text">
                    <input
                      type="text"
                      className={inputCls}
                      value={data.personalInfo.logoText || data.personalInfo.name}
                      onChange={(e) => updatePersonalInfo({ logoText: e.target.value })}
                      placeholder="M. Hasan"
                    />
                    <p className="mt-1 text-[11px] text-zinc-500">First letter is highlighted with the yellow accent color.</p>
                  </Field>

                  <Field label="Display Mode">
                    <select
                      className={inputCls}
                      value={data.personalInfo.logoType || 'text'}
                      onChange={(e) => updatePersonalInfo({ logoType: e.target.value as any })}
                    >
                      <option value="text">Text Only (Modern Minimal)</option>
                      <option value="image">Image / Icon Only</option>
                      <option value="both">Image + Text Combined</option>
                    </select>
                  </Field>

                  <Field label="Logo Font Size">
                    <select
                      className={inputCls}
                      value={data.personalInfo.logoFontSize || 'text-xl'}
                      onChange={(e) => updatePersonalInfo({ logoFontSize: e.target.value as any })}
                    >
                      <option value="text-base">Small (text-base)</option>
                      <option value="text-lg">Medium (text-lg)</option>
                      <option value="text-xl">Default Large (text-xl)</option>
                      <option value="text-2xl">Extra Large (text-2xl)</option>
                    </select>
                  </Field>

                  <Field label="Full Display Name (Used across page)">
                    <input
                      type="text"
                      className={inputCls}
                      value={data.personalInfo.fullName || ''}
                      onChange={(e) => updatePersonalInfo({ fullName: e.target.value })}
                      placeholder="Mossadik Hasan"
                    />
                  </Field>
                </div>

                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <Field label="Brand / Profile Image (Optional Icon/Avatar)">
                    <div className="flex gap-4 items-center">
                      <input
                        type="text"
                        className={inputCls + ' font-mono text-xs'}
                        value={data.personalInfo.logoImage || ''}
                        onChange={(e) => updatePersonalInfo({ logoImage: e.target.value })}
                        placeholder="Image URL or upload below..."
                      />
                      <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg cursor-pointer shrink-0 transition-colors">
                        <Upload size={13} />
                        Upload
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (b64) => updatePersonalInfo({ logoImage: b64 }))}
                        />
                      </label>
                    </div>
                  </Field>
                </div>

                {/* Live Preview */}
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                  <p className="text-xs font-mono uppercase text-zinc-500 mb-2">Live Logo Navbar Preview</p>
                  <div className="p-4 rounded-xl bg-white dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      {((data.personalInfo.logoType === 'image' || data.personalInfo.logoType === 'both') && data.personalInfo.logoImage) && (
                        <img src={data.personalInfo.logoImage} alt="Logo preview" className="w-8 h-8 rounded-lg object-cover ring-1 ring-zinc-300 dark:ring-zinc-700" />
                      )}
                      {(data.personalInfo.logoType !== 'image' || !data.personalInfo.logoImage) && (
                        <div className={`font-bold font-mono ${data.personalInfo.logoFontSize || 'text-xl'}`}>
                          <span className="text-yellow-400 font-extrabold">
                            {(data.personalInfo.logoText || data.personalInfo.name).charAt(0)}
                          </span>
                          <span className="text-zinc-900 dark:text-white">
                            {(data.personalInfo.logoText || data.personalInfo.name).slice(1)}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-[11px] font-mono text-zinc-400">Preview</span>
                  </div>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════ 3. HERO / HOME SECTION ════ */}
          {activeSection === 'hero' && (
            <div className="space-y-6">
              <SectionCard title="Hero Headlines & Tagline" description="Main banner typography seen when visitors first land on your portfolio.">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <Field label="Headline Line 1">
                    <input
                      type="text"
                      className={inputCls}
                      value={(data.personalInfo as any).heroHeadlineLine1 || 'Creative'}
                      onChange={(e) => updatePersonalInfo({ heroHeadlineLine1: e.target.value } as any)}
                    />
                  </Field>
                  <Field label="Accent Keyword (Italicized/Highlighted)">
                    <input
                      type="text"
                      className={inputCls}
                      value={(data.personalInfo as any).heroHeadlineAccent || 'technologist'}
                      onChange={(e) => updatePersonalInfo({ heroHeadlineAccent: e.target.value } as any)}
                    />
                  </Field>
                  <Field label="Headline Line 2">
                    <input
                      type="text"
                      className={inputCls}
                      value={(data.personalInfo as any).heroHeadlineLine2 || '& Senior Frontend Engineer'}
                      onChange={(e) => updatePersonalInfo({ heroHeadlineLine2: e.target.value } as any)}
                    />
                  </Field>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Professional Title">
                    <input
                      type="text"
                      className={inputCls}
                      value={data.personalInfo.title}
                      onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                    />
                  </Field>
                  <Field label="Availability Status">
                    <input
                      type="text"
                      className={inputCls}
                      value={data.personalInfo.availability || ''}
                      onChange={(e) => updatePersonalInfo({ availability: e.target.value })}
                    />
                  </Field>
                </div>

                <Field label="Tagline / Manifesto">
                  <textarea
                    rows={2}
                    className={inputCls}
                    value={data.personalInfo.tagline}
                    onChange={(e) => updatePersonalInfo({ tagline: e.target.value })}
                  />
                </Field>
              </SectionCard>

              <SectionCard title="Hero Portrait Imagery" description="Upload your creative headshot or project visual.">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
                  <div className="md:col-span-8 space-y-3">
                    <Field label="Portrait Image URL or Path">
                      <input
                        type="text"
                        className={inputCls + ' font-mono text-xs'}
                        value={data.personalInfo.heroPortrait}
                        onChange={(e) => updatePersonalInfo({ heroPortrait: e.target.value })}
                      />
                    </Field>
                    <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-lg transition-colors">
                      <Upload size={14} />
                      Upload New Image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleFileUpload(e, (b64) => updatePersonalInfo({ heroPortrait: b64 }))}
                      />
                    </label>
                  </div>
                  <div className="md:col-span-4 rounded-xl overflow-hidden bg-zinc-900 aspect-[4/5] border border-zinc-200 dark:border-zinc-800 max-w-[200px]">
                    <img src={data.personalInfo.heroPortrait} alt="Portrait preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Metrics & Performance Counters" description="The 4 stat counters featured in the hero section.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.personalInfo.stats.map((stat, i) => (
                    <div key={i} className="p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 space-y-2">
                      <Field label={`Stat #${i + 1} Value`}>
                        <input
                          type="text"
                          className={inputCls + ' font-bold text-yellow-500 font-mono'}
                          value={stat.value}
                          onChange={(e) => {
                            const next = [...data.personalInfo.stats];
                            next[i] = { ...next[i], value: e.target.value };
                            updatePersonalInfo({ stats: next });
                          }}
                        />
                      </Field>
                      <Field label="Label">
                        <input
                          type="text"
                          className={inputCls}
                          value={stat.label}
                          onChange={(e) => {
                            const next = [...data.personalInfo.stats];
                            next[i] = { ...next[i], label: e.target.value };
                            updatePersonalInfo({ stats: next });
                          }}
                        />
                      </Field>
                    </div>
                  ))}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════ 4. ABOUT SECTION ════ */}
          {activeSection === 'about' && (
            <div className="space-y-6">
              <SectionCard title="About Heading" description="The large heading displayed at the top of the About section.">
                <Field label="Section Heading Text">
                  <input
                    type="text"
                    className={inputCls}
                    value={(data.personalInfo as any).aboutHeading || 'This is Mossadik Hasan'}
                    onChange={(e) => updatePersonalInfo({ aboutHeading: e.target.value } as any)}
                    placeholder="e.g. This is Mossadik Hasan"
                  />
                </Field>
              </SectionCard>

              <SectionCard title="Info Card Items" description="The label/value pairs shown in the card on the right side of the About section (Location, Education, Focus, Email, etc). Toggle 'Email link' to make a row render as a clickable mailto link.">
                {(() => {
                  const rawItems = (data.personalInfo as any)?.aboutInfoItems;
                  const currentItems: { label: string; value: string; isEmail: boolean }[] =
                    Array.isArray(rawItems) && rawItems.length > 0
                      ? rawItems.map((it) => ({
                          label: it?.label || '',
                          value: it?.value || '',
                          isEmail: Boolean(it?.isEmail),
                        }))
                      : [
                          { label: 'Location', value: data.personalInfo?.location || 'Dhaka, Bangladesh', isEmail: false },
                          { label: 'Education', value: 'B.Sc. in CSE (DIU)', isEmail: false },
                          { label: 'Focus', value: 'Software Development & IoT', isEmail: false },
                          { label: 'Direct Email', value: data.personalInfo?.email || 'hasan241-15-127@diu.edu.bd', isEmail: true },
                        ];

                  const updateItems = (next: { label: string; value: string; isEmail: boolean }[]) => {
                    updatePersonalInfo({ aboutInfoItems: next } as any);
                  };

                  return (
                    <div className="space-y-3">
                      {currentItems.map((item, i) => (
                        <div key={i} className="p-3 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-2">
                          <div className="flex items-center justify-between">
                            <span className="text-xs font-mono font-bold text-yellow-500">Row #{i + 1}</span>
                            <button
                              type="button"
                              onClick={() => {
                                updateItems(currentItems.filter((_, j) => j !== i));
                              }}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                              title="Delete row"
                            >
                              <Trash2 size={13} />
                            </button>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <Field label="Label">
                              <input
                                type="text"
                                className={inputCls}
                                value={item.label}
                                placeholder="e.g. Location"
                                onChange={(e) => {
                                  const updated = [...currentItems];
                                  updated[i] = { ...updated[i], label: e.target.value };
                                  updateItems(updated);
                                }}
                              />
                            </Field>
                            <Field label="Value">
                              <input
                                type="text"
                                className={inputCls}
                                value={item.value}
                                placeholder="e.g. Dhaka, Bangladesh"
                                onChange={(e) => {
                                  const updated = [...currentItems];
                                  updated[i] = { ...updated[i], value: e.target.value };
                                  updateItems(updated);
                                }}
                              />
                            </Field>
                          </div>
                          <label className="flex items-center gap-2 cursor-pointer select-none">
                            <input
                              type="checkbox"
                              checked={item.isEmail}
                              onChange={(e) => {
                                const updated = [...currentItems];
                                updated[i] = { ...updated[i], isEmail: e.target.checked };
                                updateItems(updated);
                              }}
                              className="w-3.5 h-3.5 accent-yellow-400"
                            />
                            <span className="text-xs text-zinc-500">Email link (renders as clickable mailto)</span>
                          </label>
                        </div>
                      ))}

                      <button
                        type="button"
                        onClick={() => {
                          updateItems([
                            ...currentItems,
                            { label: 'New Label', value: 'New Value', isEmail: false },
                          ]);
                        }}
                        className="flex items-center gap-1.5 text-xs font-semibold text-yellow-500 hover:text-yellow-400 mt-2"
                      >
                        <Plus size={14} /> Add Info Row
                      </button>
                    </div>
                  );
                })()}
              </SectionCard>

              <SectionCard title="Bio Paragraphs" description="Add, edit, or remove paragraphs in your about section.">
                <div className="space-y-3">
                  {data.aboutBio.map((para, i) => (
                    <div key={i} className="flex gap-2">
                      <textarea
                        rows={3}
                        className={inputCls + ' resize-none'}
                        value={para}
                        onChange={(e) => {
                          const copy = [...data.aboutBio];
                          copy[i] = e.target.value;
                          updateAboutBio(copy);
                        }}
                      />
                      <button
                        type="button"
                        onClick={() => updateAboutBio(data.aboutBio.filter((_, j) => j !== i))}
                        className="p-2 text-zinc-400 hover:text-red-500 self-start rounded-md hover:bg-red-50 dark:hover:bg-red-950/20"
                        title="Delete paragraph"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                  <button
                    type="button"
                    onClick={() => updateAboutBio([...data.aboutBio, 'New bio paragraph...'])}
                    className="flex items-center gap-1.5 text-xs font-semibold text-yellow-500 hover:text-yellow-400"
                  >
                    <Plus size={14} /> Add Paragraph
                  </button>
                </div>
              </SectionCard>

              <SectionCard title="Core Engineering Pillars" description="The philosophy cards in the About section.">
                {data.pillars.map((pillar, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 mb-3">
                    {/* Card header with pillar number and delete button */}
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-bold text-yellow-500">Pillar #{i + 1}</span>
                      <button
                        type="button"
                        onClick={() => updatePillars(data.pillars.filter((_, j) => j !== i))}
                        className="p-1.5 rounded-lg text-zinc-400 hover:text-red-400 hover:bg-red-950/30 transition-colors"
                        title="Delete pillar"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                    <div className="grid grid-cols-5 gap-3">
                      <Field label="Number" className="col-span-1">
                        <input
                          type="text"
                          className={inputCls + ' text-center font-mono'}
                          value={pillar.index}
                          onChange={(e) => {
                            const p = [...data.pillars];
                            p[i] = { ...p[i], index: e.target.value };
                            updatePillars(p);
                          }}
                        />
                      </Field>
                      <Field label="Title" className="col-span-4">
                        <input
                          type="text"
                          className={inputCls}
                          value={pillar.title}
                          onChange={(e) => {
                            const p = [...data.pillars];
                            p[i] = { ...p[i], title: e.target.value };
                            updatePillars(p);
                          }}
                        />
                      </Field>
                    </div>
                    <Field label="Description">
                      <textarea
                        rows={2}
                        className={inputCls + ' resize-none'}
                        value={pillar.description}
                        onChange={(e) => {
                          const p = [...data.pillars];
                          p[i] = { ...p[i], description: e.target.value };
                          updatePillars(p);
                        }}
                      />
                    </Field>
                  </div>
                ))}
                {/* Add Pillar Button */}
                <button
                  type="button"
                  onClick={() =>
                    updatePillars([
                      ...data.pillars,
                      {
                        index: String(data.pillars.length + 1).padStart(2, '0'),
                        title: 'New Pillar',
                        description: 'Describe this engineering philosophy...',
                      },
                    ])
                  }
                  className="flex items-center gap-1.5 text-xs font-semibold text-yellow-500 hover:text-yellow-400 mt-1"
                >
                  <Plus size={14} /> Add Pillar
                </button>
              </SectionCard>
            </div>
          )}

          {/* ════ 5. SKILLS MATRIX ════ */}
          {activeSection === 'skills' && (
            <div className="space-y-6">
              <SectionCard title={`Skills Matrix (${data.skills.length})`} description="Manage technical skills, assign categories, and reorder.">
                <div className="space-y-2 mb-4">
                  {data.skills.map((skill, index) => (
                    <div key={skill.id} className="flex items-center gap-2 p-2.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                      <div className="flex flex-col gap-0.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => saveData({ ...data, skills: reorder(data.skills, index, 'up') })}
                          disabled={index === 0}
                          className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
                          title="Move up"
                        >
                          <ArrowUp size={11} />
                        </button>
                        <button
                          type="button"
                          onClick={() => saveData({ ...data, skills: reorder(data.skills, index, 'down') })}
                          disabled={index === data.skills.length - 1}
                          className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
                          title="Move down"
                        >
                          <ArrowDown size={11} />
                        </button>
                      </div>
                      <span className="text-zinc-500 shrink-0 w-6 flex justify-center">{renderSkillIcon(skill.iconName)}</span>
                      <input
                        type="text"
                        className={inputCls + ' flex-1 py-1.5 text-xs'}
                        value={skill.name}
                        onChange={(e) => updateSkill(skill.id, { name: e.target.value })}
                      />
                      <input
                        type="text"
                        className={inputCls + ' w-32 py-1.5 text-xs'}
                        value={skill.category}
                        onChange={(e) => updateSkill(skill.id, { category: e.target.value })}
                        placeholder="Category"
                      />
                      <select
                        className={inputCls + ' w-32 py-1.5 text-xs'}
                        value={skill.iconName}
                        onChange={(e) => updateSkill(skill.id, { iconName: e.target.value })}
                      >
                        {AVAILABLE_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                      </select>
                      <button
                        type="button"
                        onClick={() => deleteSkill(skill.id)}
                        className="p-1.5 text-zinc-400 hover:text-red-500 shrink-0"
                        title="Delete skill"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <AddSkillForm onAdd={(skill) => addSkill(skill)} />
              </SectionCard>
            </div>
          )}

          {/* ════ 6. EXPERIENCE SECTION ════ */}
          {activeSection === 'experience' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Experience ({data.experiences.length})</h2>
                  <p className="text-xs text-zinc-500">Work history, roles, and technologies used.</p>
                </div>
                <button
                  type="button"
                  onClick={() => addExperience({
                    id: 'exp-' + Date.now(), company: 'New Company', role: 'Role Title',
                    period: '2024–Present', location: 'Remote', type: 'Full-time',
                    description: 'Description of key responsibilities and impact...',
                    achievements: [], stack: [],
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-lg"
                >
                  <Plus size={14} /> Add Role
                </button>
              </div>

              {data.experiences.map((exp, index) => (
                <ExperienceCard
                  key={exp.id}
                  exp={exp}
                  index={index}
                  total={data.experiences.length}
                  onMove={(dir) => saveData({ ...data, experiences: reorder(data.experiences, index, dir) })}
                  onUpdate={(u) => updateExperience(exp.id, u)}
                  onDelete={() => deleteExperience(exp.id)}
                />
              ))}
            </div>
          )}

          {/* ════ 7. PROJECTS SECTION ════ */}
          {activeSection === 'projects' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Projects ({data.projects.length})</h2>
                  <p className="text-xs text-zinc-500">Case studies, architecture solutions, metrics, and live links.</p>
                </div>
                <button
                  type="button"
                  onClick={() => addProject({
                    id: 'proj-' + Date.now(), title: 'New Project Title', subtitle: 'Project subtitle or mission',
                    category: 'Fintech', year: '2025', role: 'Frontend Architect', image: '',
                    summary: 'Overview of the project and architectural challenges.',
                    challenge: 'Specific engineering or user experience hurdles.',
                    solution: 'Design systems and architectural implementation.',
                    metrics: [{ label: 'Throughput', value: '12k req/s' }],
                    technologies: ['React 19', 'TypeScript', 'Tailwind CSS'],
                    liveUrl: '', githubUrl: '', featured: true,
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-lg"
                >
                  <Plus size={14} /> Add Project
                </button>
              </div>

              {data.projects.map((proj, index) => (
                <ProjectCard
                  key={proj.id}
                  proj={proj}
                  index={index}
                  total={data.projects.length}
                  onMove={(dir) => saveData({ ...data, projects: reorder(data.projects, index, dir) })}
                  onUpdate={(u) => updateProject(proj.id, u)}
                  onDelete={() => deleteProject(proj.id)}
                  onFileUpload={handleFileUpload}
                />
              ))}
            </div>
          )}

          {/* ════ 8. EDUCATION & CERTS ════ */}
          {activeSection === 'education' && (
            <div className="space-y-6">
              <SectionCard title="Degrees & Academic Qualifications">
                {data.education.map((edu, i) => (
                  <div key={i} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 space-y-3 mb-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <Field label="Degree / Program">
                        <input type="text" className={inputCls} value={edu.degree} onChange={(e) => {
                          const d = [...data.education]; d[i] = { ...d[i], degree: e.target.value }; updateEducation(d);
                        }} />
                      </Field>
                      <Field label="Institution / University">
                        <input type="text" className={inputCls} value={edu.institution} onChange={(e) => {
                          const d = [...data.education]; d[i] = { ...d[i], institution: e.target.value }; updateEducation(d);
                        }} />
                      </Field>
                      <Field label="Period (e.g. 2020–2024)">
                        <input type="text" className={inputCls} value={edu.period} onChange={(e) => {
                          const d = [...data.education]; d[i] = { ...d[i], period: e.target.value }; updateEducation(d);
                        }} />
                      </Field>
                      <Field label="Location">
                        <input type="text" className={inputCls} value={(edu as any).location || ''} onChange={(e) => {
                          const d = [...data.education]; d[i] = { ...d[i], location: e.target.value }; updateEducation(d);
                        }} />
                      </Field>
                    </div>
                    <Field label="Honors / Awards (leave blank to hide)">
                      <input type="text" className={inputCls} value={(edu as any).honors || ''} placeholder="Leave empty to hide this badge" onChange={(e) => {
                        const d = [...data.education]; d[i] = { ...d[i], honors: e.target.value } as any; updateEducation(d);
                      }} />
                    </Field>
                    <Field label="Description">
                      <textarea rows={2} className={inputCls + ' resize-none'} value={edu.description || ''} onChange={(e) => {
                        const d = [...data.education]; d[i] = { ...d[i], description: e.target.value }; updateEducation(d);
                      }} />
                    </Field>
                    <button
                      type="button"
                      onClick={() => updateEducation(data.education.filter((_, j) => j !== i))}
                      className="flex items-center gap-1 text-xs text-red-500 hover:text-red-600 font-medium"
                    >
                      <Trash2 size={13} /> Delete Degree
                    </button>
                  </div>
                ))}
                <button
                  type="button"
                  onClick={() => updateEducation([...data.education, { degree: 'B.Sc. in Computer Science', institution: 'University Name', period: '2020–2024', description: '' } as any])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-yellow-500 hover:text-yellow-400"
                >
                  <Plus size={14} /> Add Degree
                </button>
              </SectionCard>

              <SectionCard title="Certifications & Honors">
                <div className="space-y-2 mb-3">
                  {data.certifications.map((cert, i) => (
                    <div key={i} className="flex gap-2">
                      <input type="text" className={inputCls + ' flex-1'} placeholder="Certification title" value={cert.name} onChange={(e) => {
                        const c = [...data.certifications]; c[i] = { ...c[i], name: e.target.value }; updateCertifications(c);
                      }} />
                      <input type="text" className={inputCls + ' w-32'} placeholder="Issuer" value={cert.issuer} onChange={(e) => {
                        const c = [...data.certifications]; c[i] = { ...c[i], issuer: e.target.value }; updateCertifications(c);
                      }} />
                      <input type="text" className={inputCls + ' w-20'} placeholder="Year" value={cert.year} onChange={(e) => {
                        const c = [...data.certifications]; c[i] = { ...c[i], year: e.target.value }; updateCertifications(c);
                      }} />
                      <button type="button" onClick={() => updateCertifications(data.certifications.filter((_, j) => j !== i))} className="p-2 text-zinc-400 hover:text-red-500">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => updateCertifications([...data.certifications, { name: 'New Certification', issuer: 'Issuer Organization', year: '2025' } as any])}
                  className="flex items-center gap-1.5 text-xs font-semibold text-yellow-500 hover:text-yellow-400"
                >
                  <Plus size={14} /> Add Certification
                </button>
              </SectionCard>
            </div>
          )}

          {/* ════ 9. BLOG SECTION ════ */}
          {activeSection === 'blog' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold">Articles & Essays ({data.blogPosts.length})</h2>
                  <p className="text-xs text-zinc-500">Editorial writings, tutorials, and engineering perspectives.</p>
                </div>
                <button
                  type="button"
                  onClick={() => addBlogPost({
                    id: 'post-' + Date.now(), title: 'New Perspective Article', category: 'Engineering',
                    slug: 'article-' + Date.now(),
                    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                    readTime: '4 min read', excerpt: 'Short summary of the article...',
                    content: 'Write your full content here in markdown...', image: '', featured: false,
                  })}
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-lg"
                >
                  <Plus size={14} /> Add Article
                </button>
              </div>

              {data.blogPosts.map((post, index) => (
                <BlogCard
                  key={post.id}
                  post={post}
                  index={index}
                  total={data.blogPosts.length}
                  onMove={(dir) => saveData({ ...data, blogPosts: reorder(data.blogPosts, index, dir) })}
                  onUpdate={(u) => updateBlogPost(post.id, u)}
                  onDelete={() => deleteBlogPost(post.id)}
                  onFileUpload={handleFileUpload}
                />
              ))}
            </div>
          )}

          {/* ════ 10. CONTACT INFORMATION ════ */}
          {activeSection === 'contact' && (
            <div className="space-y-6">
              <SectionCard title="Contact Channels & Details" description="Information used by recruiters and clients to get in touch.">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Field label="Email Address">
                    <input
                      type="email"
                      className={inputCls}
                      value={data.personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                    />
                  </Field>
                  <Field label="Location">
                    <input
                      type="text"
                      className={inputCls}
                      value={data.personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                    />
                  </Field>
                  <Field label="Timezone">
                    <input
                      type="text"
                      className={inputCls}
                      value={data.personalInfo.timezone || ''}
                      onChange={(e) => updatePersonalInfo({ timezone: e.target.value })}
                      placeholder="e.g. Asia/Dhaka"
                    />
                  </Field>
                  <Field label="Availability Note">
                    <input
                      type="text"
                      className={inputCls}
                      value={data.personalInfo.availability || ''}
                      onChange={(e) => updatePersonalInfo({ availability: e.target.value })}
                      placeholder="Open for Select Contracts"
                    />
                  </Field>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════ 11. SOCIAL MEDIA LINKS ════ */}
          {activeSection === 'socials' && (
            <div className="space-y-6">
              <SectionCard
                title="Social & Professional Profiles"
                description="Manage your social profile links. Enter the display name (e.g. GitHub, Facebook) and the full profile link. The site name will be shown on the public site and will link directly to your profile."
              >
                <div className="space-y-3">
                  {data.personalInfo.socials.map((social, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-2"
                    >
                      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                        {/* Reorder Arrows */}
                        <div className="flex sm:flex-col gap-1 items-center shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              const reordered = reorder(data.personalInfo.socials, i, 'up');
                              updatePersonalInfo({ socials: reordered });
                            }}
                            disabled={i === 0}
                            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 rounded"
                            title="Move up"
                          >
                            <ArrowUp size={12} />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const reordered = reorder(data.personalInfo.socials, i, 'down');
                              updatePersonalInfo({ socials: reordered });
                            }}
                            disabled={i === data.personalInfo.socials.length - 1}
                            className="p-1 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20 rounded"
                            title="Move down"
                          >
                            <ArrowDown size={12} />
                          </button>
                        </div>

                        {/* Platform / Site Name (e.g. GitHub, Facebook) */}
                        <div className="w-full sm:w-44 shrink-0">
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                            Site Name
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 font-medium placeholder-zinc-400"
                            placeholder="e.g. GitHub or Facebook"
                            value={social.name}
                            onChange={(e) => {
                              const s = [...data.personalInfo.socials];
                              s[i] = { ...s[i], name: e.target.value };
                              updatePersonalInfo({ socials: s });
                            }}
                          />
                        </div>

                        {/* Profile Link URL */}
                        <div className="flex-1 min-w-0">
                          <label className="block text-[10px] font-mono uppercase text-zinc-400 mb-1">
                            Profile Link URL
                          </label>
                          <input
                            type="text"
                            className="w-full px-3 py-2 text-xs font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-yellow-400 focus:ring-1 focus:ring-yellow-400/20 placeholder-zinc-400"
                            placeholder="https://facebook.com/yourprofile"
                            value={social.url}
                            onChange={(e) => {
                              const s = [...data.personalInfo.socials];
                              s[i] = { ...s[i], url: e.target.value };
                              updatePersonalInfo({ socials: s });
                            }}
                          />
                        </div>

                        {/* Right side actions: Test Link + Delete Button */}
                        <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0 pt-1 sm:pt-4">
                          {social.url && (
                            <a
                              href={social.url.startsWith('http') ? social.url : `https://${social.url}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-2 text-zinc-400 hover:text-yellow-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 rounded-lg transition-colors"
                              title="Test link (opens profile)"
                            >
                              <ExternalLink size={15} />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              updatePersonalInfo({
                                socials: data.personalInfo.socials.filter((_, j) => j !== i),
                              })
                            }
                            className="p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg transition-colors"
                            title="Delete this link"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      {/* Live preview badge */}
                      <div className="text-[11px] font-mono text-zinc-500 flex items-center gap-1.5 pl-1 sm:pl-7">
                        <span>Will show on website as:</span>
                        <span className="text-yellow-500 dark:text-yellow-400 font-semibold underline decoration-dotted">
                          {social.name.trim() ? social.name : '(Empty Site Name)'}
                        </span>
                        <span>→ links to:</span>
                        <span className="truncate max-w-[240px] text-zinc-400">
                          {social.url ? social.url : '(No link set)'}
                        </span>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
                    onClick={() =>
                      updatePersonalInfo({
                        socials: [
                          ...data.personalInfo.socials,
                          { name: '', url: 'https://' },
                        ],
                      })
                    }
                    className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-lg transition-colors mt-2"
                  >
                    <Plus size={14} /> Add Social Profile
                  </button>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════ 12. RESUME / CV MANAGEMENT ════ */}
          {activeSection === 'resume' && (
            <div className="space-y-6">
              <SectionCard title="Resume & Curriculum Vitae" description="Manage your downloadable resume link or upload a CV document.">
                <Field label="Resume Link or Hosted Document URL">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      className={inputCls + ' font-mono text-xs'}
                      placeholder="https://drive.google.com/... or upload below"
                      value={(data.personalInfo as any).resumeUrl || ''}
                      onChange={(e) => updatePersonalInfo({ resumeUrl: e.target.value } as any)}
                    />
                    {(data.personalInfo as any).resumeUrl && (
                      <a
                        href={(data.personalInfo as any).resumeUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center gap-1 px-3 py-2 text-xs font-medium bg-zinc-100 dark:bg-zinc-800 rounded-lg hover:bg-zinc-200 shrink-0"
                      >
                        <ExternalLink size={13} /> Test
                      </a>
                    )}
                  </div>
                </Field>

                <div className="pt-3 border-t border-zinc-100 dark:border-zinc-800">
                  <p className={labelCls}>Or Upload File from Computer</p>
                  <label className="inline-flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-yellow-400 bg-white dark:bg-zinc-900 text-xs font-semibold text-zinc-600 dark:text-zinc-300 hover:text-yellow-500 transition-colors">
                    <Upload size={14} />
                    Choose Resume PDF / Document
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      className="hidden"
                      onChange={(e) => handleFileUpload(e, (b64) => updatePersonalInfo({ resumeUrl: b64 } as any))}
                    />
                  </label>
                  {(data.personalInfo as any).resumeUrl && (
                    <p className="mt-2 text-xs text-emerald-500 font-mono flex items-center gap-1">
                      <Check size={12} /> Resume file linked successfully
                    </p>
                  )}
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════ 13. THEME & APPEARANCE ════ */}
          {activeSection === 'theme' && (
            <div className="space-y-6">
              <SectionCard title="Visual Theme & Accent System" description="Control light/dark modes and accent styling.">
                <div className="flex items-center justify-between p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
                  <div>
                    <p className="text-sm font-semibold">Active Color Theme</p>
                    <p className="text-xs text-zinc-500 mt-0.5">Toggle between dark mode and light mode across the site.</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setDarkMode(!darkMode)}
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 transition-colors"
                  >
                    {darkMode ? <Moon size={14} className="text-yellow-400" /> : <Sun size={14} className="text-amber-500" />}
                    {darkMode ? 'Dark Theme' : 'Light Theme'}
                  </button>
                </div>
              </SectionCard>
            </div>
          )}

          {/* ════ 14. GENERAL SETTINGS & ADMIN PASSWORD ════ */}
          {activeSection === 'settings' && (
            <div className="max-w-2xl space-y-6">
              <SectionCard title="Admin Password & Authentication" description="Change your admin dashboard access password.">
                <form onSubmit={handleChangePassword} className="space-y-3.5">
                  <Field label="Current Password">
                    <div className="relative">
                      <input
                        type={showCurrentPw ? 'text' : 'password'}
                        className={inputCls + ' pr-10'}
                        value={pwCurrent}
                        onChange={(e) => setPwCurrent(e.target.value)}
                        placeholder="Current password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPw(!showCurrentPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showCurrentPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </Field>

                  <Field label="New Password (minimum 8 characters)">
                    <div className="relative">
                      <input
                        type={showNewPw ? 'text' : 'password'}
                        className={inputCls + ' pr-10'}
                        value={pwNew}
                        onChange={(e) => setPwNew(e.target.value)}
                        placeholder="New strong password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPw(!showNewPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showNewPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </Field>

                  <Field label="Confirm New Password">
                    <div className="relative">
                      <input
                        type={showConfirmPw ? 'text' : 'password'}
                        className={inputCls + ' pr-10'}
                        value={pwConfirm}
                        onChange={(e) => setPwConfirm(e.target.value)}
                        placeholder="Repeat new password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPw(!showConfirmPw)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
                      >
                        {showConfirmPw ? <EyeOff size={14} /> : <Eye size={14} />}
                      </button>
                    </div>
                  </Field>

                  {pwError && (
                    <div className="flex items-center gap-2 text-xs text-red-400 bg-red-950/30 border border-red-800/30 px-3 py-2 rounded-lg">
                      <AlertCircle size={14} /> {pwError}
                    </div>
                  )}

                  {pwSuccess && (
                    <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/30 border border-emerald-800/30 px-3 py-2 rounded-lg">
                      <Check size={14} /> {pwSuccess}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={pwLoading}
                    className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 disabled:opacity-60 text-zinc-950 rounded-lg transition-colors"
                  >
                    {pwLoading ? <><Loader2 size={13} className="animate-spin" /> Updating...</> : 'Update Admin Password'}
                  </button>
                </form>
              </SectionCard>

              <SectionCard title="Danger Zone">
                <div className="p-4 rounded-xl border border-red-200 dark:border-red-950 bg-red-50 dark:bg-red-950/20 space-y-3">
                  <p className="text-sm font-semibold text-red-600 dark:text-red-400">Reset Portfolio Content</p>
                  <p className="text-xs text-red-500 dark:text-red-300">
                    Restores all projects, blogs, skills, and bio back to the default portfolio state. This cannot be undone.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm('Are you sure you want to restore all portfolio data to defaults?')) {
                        resetToDefaults();
                      }
                    }}
                    className="px-3.5 py-1.5 text-xs font-semibold bg-red-600 hover:bg-red-500 text-white rounded-lg transition-colors"
                  >
                    Reset Everything to Defaults
                  </button>
                </div>
              </SectionCard>
            </div>
          )}

        </main>
      </div>
    </div>
  );
};

// ── Shared UI Sub-components ──

function SectionCard({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-2xs">
      <div>
        <h3 className="text-base font-bold text-zinc-900 dark:text-white">{title}</h3>
        {description && <p className="text-xs text-zinc-500 dark:text-zinc-400 mt-0.5">{description}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}

function Field({ label, children, className = '' }: { label: string; children: React.ReactNode; className?: string }) {
  return (
    <div className={className}>
      <label className={labelCls}>{label}</label>
      {children}
    </div>
  );
}

function AddSkillForm({ onAdd }: { onAdd: (s: Omit<TechSkillItem, 'id'>) => void }) {
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Frontend');
  const [iconName, setIconName] = useState('Code2');

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;
    onAdd({ name: name.trim(), category, iconName });
    setName('');
  };

  return (
    <form onSubmit={submit} className="flex gap-2 items-end flex-wrap border-t border-zinc-100 dark:border-zinc-800 pt-3">
      <div className="flex-1 min-w-32">
        <label className={labelCls}>New Skill Name</label>
        <input type="text" className={inputCls} value={name} onChange={(e) => setName(e.target.value)} placeholder="React 19" required />
      </div>
      <div className="w-32">
        <label className={labelCls}>Category</label>
        <input type="text" className={inputCls} value={category} onChange={(e) => setCategory(e.target.value)} />
      </div>
      <div className="w-32">
        <label className={labelCls}>Icon</label>
        <select className={inputCls} value={iconName} onChange={(e) => setIconName(e.target.value)}>
          {AVAILABLE_ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>
      <button type="submit" className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-yellow-400 hover:bg-yellow-300 text-zinc-950 rounded-lg">
        <Plus size={14} /> Add Skill
      </button>
    </form>
  );
}

function ExperienceCard({
  exp, index, total, onMove, onUpdate, onDelete
}: {
  exp: Experience;
  index: number;
  total: number;
  onMove: (dir: 'up' | 'down') => void;
  onUpdate: (u: Partial<Experience>) => void;
  onDelete: () => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onMove('up')}
              disabled={index === 0}
              className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
            >
              <ArrowUp size={11} />
            </button>
            <button
              type="button"
              onClick={() => onMove('down')}
              disabled={index === total - 1}
              className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
            >
              <ArrowDown size={11} />
            </button>
          </div>
          <div>
            <p className="font-bold text-sm">{exp.role || 'Role Title'}</p>
            <p className="text-xs text-zinc-500">{exp.company} · {exp.period}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md"
            title="Delete role"
          >
            <Trash2 size={14} />
          </button>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Company"><input type="text" className={inputCls} value={exp.company} onChange={(e) => onUpdate({ company: e.target.value })} /></Field>
            <Field label="Role Title"><input type="text" className={inputCls} value={exp.role} onChange={(e) => onUpdate({ role: e.target.value })} /></Field>
            <Field label="Period (e.g. 2024–Present)"><input type="text" className={inputCls} value={exp.period} onChange={(e) => onUpdate({ period: e.target.value })} /></Field>
            <Field label="Location"><input type="text" className={inputCls} value={exp.location} onChange={(e) => onUpdate({ location: e.target.value })} /></Field>
          </div>
          <Field label="Description">
            <textarea rows={3} className={inputCls + ' resize-none'} value={exp.description} onChange={(e) => onUpdate({ description: e.target.value })} />
          </Field>
        </div>
      )}
    </div>
  );
}

function ProjectCard({
  proj, index, total, onMove, onUpdate, onDelete, onFileUpload
}: {
  proj: Project;
  index: number;
  total: number;
  onMove: (dir: 'up' | 'down') => void;
  onUpdate: (u: Partial<Project>) => void;
  onDelete: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, cb: (b64: string) => void) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onMove('up')}
              disabled={index === 0}
              className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
            >
              <ArrowUp size={11} />
            </button>
            <button
              type="button"
              onClick={() => onMove('down')}
              disabled={index === total - 1}
              className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
            >
              <ArrowDown size={11} />
            </button>
          </div>
          {proj.image ? (
            <img src={proj.image} alt="" className="w-10 h-10 rounded-lg object-cover bg-zinc-200 dark:bg-zinc-800" />
          ) : (
            <div className="w-10 h-10 rounded-lg bg-zinc-100 dark:bg-zinc-800 flex items-center justify-center text-zinc-400 text-xs">
              🖼️
            </div>
          )}
          <div>
            <p className="font-bold text-sm">{proj.title || 'Untitled Project'}</p>
            <p className="text-xs text-zinc-500">{proj.category} · {proj.year}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md"
            title="Delete project"
          >
            <Trash2 size={14} />
          </button>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Project Title"><input type="text" className={inputCls} value={proj.title} onChange={(e) => onUpdate({ title: e.target.value })} /></Field>
            <Field label="Subtitle / Tagline"><input type="text" className={inputCls} value={proj.subtitle} onChange={(e) => onUpdate({ subtitle: e.target.value })} /></Field>
            <Field label="Category"><input type="text" className={inputCls} value={proj.category} onChange={(e) => onUpdate({ category: e.target.value })} /></Field>
            <Field label="Year"><input type="text" className={inputCls} value={proj.year} onChange={(e) => onUpdate({ year: e.target.value })} /></Field>
            <Field label="Role Title"><input type="text" className={inputCls} value={proj.role} onChange={(e) => onUpdate({ role: e.target.value })} /></Field>
            <Field label="Live Demo URL"><input type="text" className={inputCls + ' font-mono text-xs'} value={proj.liveUrl || ''} onChange={(e) => onUpdate({ liveUrl: e.target.value })} placeholder="https://..." /></Field>
          </div>

          <Field label="Project Cover Image">
            <div className="flex gap-2">
              <input type="text" className={inputCls + ' font-mono text-xs'} value={proj.image} onChange={(e) => onUpdate({ image: e.target.value })} placeholder="Image URL..." />
              <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg cursor-pointer shrink-0">
                <Upload size={12} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileUpload(e, (b64) => onUpdate({ image: b64 }))} />
              </label>
            </div>
          </Field>

          <Field label="Project Summary">
            <textarea rows={2} className={inputCls + ' resize-none'} value={proj.summary} onChange={(e) => onUpdate({ summary: e.target.value })} />
          </Field>

          <Field label="Technologies (comma-separated)">
            <input
              type="text"
              className={inputCls}
              value={proj.technologies.join(', ')}
              onChange={(e) => onUpdate({ technologies: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })}
            />
          </Field>

          <label className="flex items-center gap-2 text-xs font-medium cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={proj.featured}
              onChange={(e) => onUpdate({ featured: e.target.checked })}
              className="w-4 h-4 accent-yellow-400 rounded"
            />
            Feature this project prominently on the homepage
          </label>
        </div>
      )}
    </div>
  );
}

function BlogCard({
  post, index, total, onMove, onUpdate, onDelete, onFileUpload
}: {
  post: BlogPost;
  index: number;
  total: number;
  onMove: (dir: 'up' | 'down') => void;
  onUpdate: (u: Partial<BlogPost>) => void;
  onDelete: () => void;
  onFileUpload: (e: React.ChangeEvent<HTMLInputElement>, cb: (b64: string) => void) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-2xs">
      <div className="flex items-center justify-between p-4 cursor-pointer select-none" onClick={() => setOpen(!open)}>
        <div className="flex items-center gap-3">
          <div className="flex flex-col gap-0.5" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => onMove('up')}
              disabled={index === 0}
              className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
            >
              <ArrowUp size={11} />
            </button>
            <button
              type="button"
              onClick={() => onMove('down')}
              disabled={index === total - 1}
              className="p-0.5 text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-200 disabled:opacity-20"
            >
              <ArrowDown size={11} />
            </button>
          </div>
          <div>
            <p className="font-bold text-sm">{post.title}</p>
            <p className="text-xs text-zinc-500">{post.category} · {post.date} · {post.readTime}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-zinc-400 hover:text-red-500 rounded-md"
            title="Delete post"
          >
            <Trash2 size={14} />
          </button>
          {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </div>
      </div>

      {open && (
        <div className="border-t border-zinc-100 dark:border-zinc-800 p-4 space-y-3 bg-zinc-50/50 dark:bg-zinc-950/30">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Field label="Article Title"><input type="text" className={inputCls} value={post.title} onChange={(e) => onUpdate({ title: e.target.value })} /></Field>
            <Field label="Category"><input type="text" className={inputCls} value={post.category} onChange={(e) => onUpdate({ category: e.target.value })} /></Field>
            <Field label="Publish Date"><input type="text" className={inputCls} value={post.date} onChange={(e) => onUpdate({ date: e.target.value })} /></Field>
            <Field label="Read Time"><input type="text" className={inputCls} value={post.readTime} onChange={(e) => onUpdate({ readTime: e.target.value })} /></Field>
          </div>

          <Field label="Cover Image">
            <div className="flex gap-2">
              <input type="text" className={inputCls + ' font-mono text-xs'} value={post.image || ''} placeholder="Cover image URL..." onChange={(e) => onUpdate({ image: e.target.value })} />
              <label className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg cursor-pointer shrink-0">
                <Upload size={12} /> Upload
                <input type="file" accept="image/*" className="hidden" onChange={(e) => onFileUpload(e, (b64) => onUpdate({ image: b64 }))} />
              </label>
            </div>
          </Field>

          <Field label="Excerpt">
            <textarea rows={2} className={inputCls + ' resize-none'} value={post.excerpt} onChange={(e) => onUpdate({ excerpt: e.target.value })} />
          </Field>

          <Field label="Full Markdown Content">
            <textarea rows={6} className={inputCls + ' resize-none font-mono text-xs'} value={post.content} onChange={(e) => onUpdate({ content: e.target.value })} />
          </Field>
        </div>
      )}
    </div>
  );
}
