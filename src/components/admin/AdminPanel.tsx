import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Edit2,
  RotateCcw,
  Sparkles,
  Layers,
  Briefcase,
  GraduationCap,
  FileText,
  User,
  Settings,
  Check,
  ExternalLink,
  Image as ImageIcon,
  Upload,
} from 'lucide-react';
import { usePortfolio, TechSkillItem, PillarItem } from '../../context/PortfolioContext';
import { AVAILABLE_ICON_NAMES, renderSkillIcon } from '../../utils/skillIcons';
import { Project, Experience, Certification, BlogPost } from '../../types/portfolio';

interface AdminPanelProps {
  onBackToSite: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToSite,
  darkMode,
  setDarkMode,
}) => {
  const {
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
  } = usePortfolio();

  const [activeTab, setActiveTab] = useState<
    'hero' | 'about' | 'skills' | 'projects' | 'experience' | 'education' | 'blog' | 'data'
  >('hero');

  const [saveToast, setSaveToast] = useState(false);

  const triggerToast = () => {
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2200);
  };

  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    callback: (base64Url: string) => void
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (typeof event.target?.result === 'string') {
          callback(event.target.result);
          triggerToast();
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Preset portrait options for quick selection
  const portraitPresets = [
    { label: 'Current Studio Portrait', url: '/src/assets/images/hero_creative_portrait_1793815484427.jpg' },
    { label: 'Fintech Workspace', url: '/src/assets/images/project_kroma_fintech_1793815484054.jpg' },
    { label: 'Generative Sound Visualizer', url: '/src/assets/images/project_sound_spatial_1793815485462.jpg' },
    { label: 'Editorial Publishing Display', url: '/src/assets/images/project_editorial_studio_1793815486069.jpg' },
  ];

  // Local form states for adding items
  const [newSkillName, setNewSkillName] = useState('');
  const [newSkillCategory, setNewSkillCategory] = useState('Frontend');
  const [newSkillIcon, setNewSkillIcon] = useState('Code2');

  const [newBioParagraph, setNewBioParagraph] = useState('');

  // Editing states
  const [editingSkillId, setEditingSkillId] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-transparent text-zinc-900 dark:text-zinc-100 transition-colors font-sans pb-20">
      {/* Admin Top Bar */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-zinc-950/90 backdrop-blur-md border-b border-zinc-200 dark:border-zinc-800 px-6 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onBackToSite}
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 hover:border-amber-500 transition-colors"
            >
              <ArrowLeft size={14} />
              <span>Exit Admin</span>
            </button>
            <div className="h-4 w-[1px] bg-zinc-300 dark:bg-zinc-700 hidden sm:block" />
            <h1 className="text-base sm:text-lg font-bold tracking-tight flex items-center gap-2">
              <span className="text-amber-500 font-mono">✦</span>
              <span>Portfolio Management Console</span>
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {saveToast && (
              <span className="hidden sm:inline-flex items-center gap-1.5 text-xs font-mono text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-800 px-3 py-1 rounded-md animate-in fade-in">
                <Check size={14} />
                <span>Changes Saved</span>
              </span>
            )}

            <button
              type="button"
              onClick={() => setDarkMode(!darkMode)}
              className="p-2 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 text-zinc-600 dark:text-zinc-300 text-xs"
              title="Toggle Theme"
            >
              {darkMode ? '🌙 Dark' : '☀️ Light'}
            </button>

            <button
              type="button"
              onClick={onBackToSite}
              className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg shadow-sm transition-colors"
            >
              View Live Site
            </button>
          </div>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-7xl mx-auto px-6 pt-8">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-4 mb-8 border-b border-zinc-200 dark:border-zinc-800 no-scrollbar">
          {[
            { id: 'hero', label: 'Hero & Identity', icon: User },
            { id: 'about', label: 'About & Pillars', icon: FileText },
            { id: 'skills', label: 'Skills Matrix', icon: Sparkles },
            { id: 'projects', label: 'Projects & Work', icon: Layers },
            { id: 'experience', label: 'Experience', icon: Briefcase },
            { id: 'education', label: 'Education & Certs', icon: GraduationCap },
            { id: 'blog', label: 'Blog Posts', icon: Edit2 },
            { id: 'data', label: 'Data & Reset', icon: Settings },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-lg whitespace-nowrap transition-all ${
                  isActive
                    ? 'bg-amber-400 text-zinc-950 shadow-sm'
                    : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-200 dark:hover:bg-zinc-900'
                }`}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* ============================================================== */}
        {/* TAB 1: HERO & IDENTITY */}
        {/* ============================================================== */}
        {activeTab === 'hero' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Identity &amp; Hero Section</h2>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                Configure your brand name, core headline, tagline, and portrait imagery.
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                    Brand Name / Logo Text
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.name}
                    onChange={(e) => {
                      updatePersonalInfo({ name: e.target.value });
                      triggerToast();
                    }}
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                    Professional Title
                  </label>
                  <input
                    type="text"
                    value={data.personalInfo.title}
                    onChange={(e) => {
                      updatePersonalInfo({ title: e.target.value });
                      triggerToast();
                    }}
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                  Hero Tagline / Manifesto
                </label>
                <textarea
                  rows={3}
                  value={data.personalInfo.tagline}
                  onChange={(e) => {
                    updatePersonalInfo({ tagline: e.target.value });
                    triggerToast();
                  }}
                  className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                />
              </div>

              {/* Portrait Image Selection */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                  <ImageIcon size={16} className="text-amber-500" />
                  <span>Hero Portrait Image</span>
                </h3>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8 space-y-4">
                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                        Image URL / File Path
                      </label>
                      <input
                        type="text"
                        value={data.personalInfo.heroPortrait}
                        onChange={(e) => {
                          updatePersonalInfo({ heroPortrait: e.target.value });
                          triggerToast();
                        }}
                        className="w-full px-4 py-2.5 text-sm font-mono bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                        Or Upload Image from Computer
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer px-4 py-2.5 rounded-lg border border-dashed border-zinc-300 dark:border-zinc-700 hover:border-amber-400 transition-colors bg-zinc-50 dark:bg-zinc-950 text-xs font-mono text-zinc-500 hover:text-amber-500 w-fit">
                        <Upload size={14} />
                        <span>Choose Portrait File</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={(e) => handleFileUpload(e, (base64Url) => updatePersonalInfo({ heroPortrait: base64Url }))}
                        />
                      </label>
                    </div>

                    <div>
                      <span className="block text-xs font-mono uppercase text-zinc-500 mb-2">
                        Quick Preset Selection:
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {portraitPresets.map((preset) => (
                          <button
                            key={preset.url}
                            type="button"
                            onClick={() => {
                              updatePersonalInfo({ heroPortrait: preset.url });
                              triggerToast();
                            }}
                            className={`p-2.5 text-left text-xs font-mono rounded-lg border transition-all ${
                              data.personalInfo.heroPortrait === preset.url
                                ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 font-bold'
                                : 'border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 hover:border-zinc-400'
                            }`}
                          >
                            {preset.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Live Preview */}
                  <div className="lg:col-span-4 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden bg-zinc-950 aspect-[4/5] relative">
                    <img
                      src={data.personalInfo.heroPortrait}
                      alt="Hero preview"
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover grayscale contrast-125"
                    />
                    <div className="absolute bottom-2 left-2 text-[10px] font-mono bg-black/80 px-2 py-0.5 rounded text-white">
                      Live Preview
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats Metrics */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <h3 className="text-sm font-bold mb-3">Key Metrics Row</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {data.personalInfo.stats.map((stat, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">
                          Value
                        </label>
                        <input
                          type="text"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...data.personalInfo.stats];
                            newStats[idx].value = e.target.value;
                            updatePersonalInfo({ stats: newStats });
                            triggerToast();
                          }}
                          className="w-full px-3 py-1.5 text-sm font-mono font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-amber-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">
                          Label
                        </label>
                        <input
                          type="text"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...data.personalInfo.stats];
                            newStats[idx].label = e.target.value;
                            updatePersonalInfo({ stats: newStats });
                            triggerToast();
                          }}
                          className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded text-zinc-700 dark:text-zinc-300"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Social Links (Horizontally docked in hero) */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-bold">Social Links (Docked in Hero)</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newSocials = [...data.personalInfo.socials, { name: 'New Platform', url: 'https://' }];
                      updatePersonalInfo({ socials: newSocials });
                      triggerToast();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-500 hover:underline"
                  >
                    <Plus size={14} />
                    <span>Add Social Link</span>
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.personalInfo.socials.map((soc, idx) => (
                    <div key={idx} className="flex items-center gap-2 p-3 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950">
                      <input
                        type="text"
                        value={soc.name}
                        onChange={(e) => {
                          const updated = [...data.personalInfo.socials];
                          updated[idx].name = e.target.value;
                          updatePersonalInfo({ socials: updated });
                          triggerToast();
                        }}
                        className="w-28 px-2.5 py-1 text-xs font-semibold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded"
                      />
                      <input
                        type="text"
                        value={soc.url}
                        onChange={(e) => {
                          const updated = [...data.personalInfo.socials];
                          updated[idx].url = e.target.value;
                          updatePersonalInfo({ socials: updated });
                          triggerToast();
                        }}
                        className="flex-1 px-2.5 py-1 text-xs font-mono bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded truncate"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const updated = data.personalInfo.socials.filter((_, i) => i !== idx);
                          updatePersonalInfo({ socials: updated });
                          triggerToast();
                        }}
                        className="p-1 text-zinc-400 hover:text-rose-500"
                      >
                        <Trash2 size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 2: ABOUT & PILLARS */}
        {/* ============================================================== */}
        {activeTab === 'about' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold tracking-tight">About Me Narrative &amp; Pillars</h2>

              {/* Bio Paragraphs */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">Bio Paragraphs</h3>
                  <button
                    type="button"
                    onClick={() => {
                      updateAboutBio([...data.aboutBio, 'New statement about your engineering craft.']);
                      triggerToast();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-500 hover:underline"
                  >
                    <Plus size={14} />
                    <span>Add Paragraph</span>
                  </button>
                </div>
                {data.aboutBio.map((paragraph, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <textarea
                      rows={2}
                      value={paragraph}
                      onChange={(e) => {
                        const next = [...data.aboutBio];
                        next[idx] = e.target.value;
                        updateAboutBio(next);
                        triggerToast();
                      }}
                      className="flex-1 px-4 py-2 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        updateAboutBio(data.aboutBio.filter((_, i) => i !== idx));
                        triggerToast();
                      }}
                      className="p-2 text-zinc-400 hover:text-rose-500"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>

              {/* Pillars */}
              <div className="pt-6 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">Core Engineering Pillars</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const nextPillars = [
                        ...data.pillars,
                        {
                          index: `0${data.pillars.length + 1}`,
                          title: 'New Discipline',
                          description: 'Description of your architectural approach.',
                        },
                      ];
                      updatePillars(nextPillars);
                      triggerToast();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-500 hover:underline"
                  >
                    <Plus size={14} />
                    <span>Add Pillar</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {data.pillars.map((pillar, idx) => (
                    <div key={idx} className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={pillar.index}
                          onChange={(e) => {
                            const next = [...data.pillars];
                            next[idx].index = e.target.value;
                            updatePillars(next);
                            triggerToast();
                          }}
                          className="w-14 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-zinc-900 border rounded text-amber-500"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updatePillars(data.pillars.filter((_, i) => i !== idx));
                            triggerToast();
                          }}
                          className="p-1 text-zinc-400 hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <input
                        type="text"
                        value={pillar.title}
                        onChange={(e) => {
                          const next = [...data.pillars];
                          next[idx].title = e.target.value;
                          updatePillars(next);
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-zinc-900 border rounded"
                      />
                      <textarea
                        rows={3}
                        value={pillar.description}
                        onChange={(e) => {
                          const next = [...data.pillars];
                          next[idx].description = e.target.value;
                          updatePillars(next);
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                      />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 3: SKILLS MATRIX (ADD & DELETE & EDIT) */}
        {/* ============================================================== */}
        {activeTab === 'skills' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Add New Skill Form */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <h2 className="text-xl font-bold tracking-tight">Add New Skill</h2>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 items-end">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                    Technology Name
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Bun / GraphQL / WebGPU"
                    value={newSkillName}
                    onChange={(e) => setNewSkillName(e.target.value)}
                    className="w-full px-4 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                    Category
                  </label>
                  <select
                    value={newSkillCategory}
                    onChange={(e) => setNewSkillCategory(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500"
                  >
                    <option value="Frontend">Frontend</option>
                    <option value="Kinetic">Kinetic</option>
                    <option value="Graphics">Graphics</option>
                    <option value="Backend & Tools">Backend &amp; Tools</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                    Icon
                  </label>
                  <select
                    value={newSkillIcon}
                    onChange={(e) => setNewSkillIcon(e.target.value)}
                    className="w-full px-3 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border border-zinc-300 dark:border-zinc-800 rounded-lg text-zinc-900 dark:text-zinc-100 focus:outline-none focus:border-amber-500 font-mono"
                  >
                    {AVAILABLE_ICON_NAMES.map((name) => (
                      <option key={name} value={name}>
                        {name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => {
                    if (!newSkillName.trim()) return;
                    addSkill({
                      name: newSkillName.trim(),
                      category: newSkillCategory,
                      iconName: newSkillIcon,
                    });
                    setNewSkillName('');
                    triggerToast();
                  }}
                  className="inline-flex items-center gap-2 px-5 py-2.5 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg shadow-sm transition-colors"
                >
                  <Plus size={15} />
                  <span>Add Skill to Matrix</span>
                </button>
              </div>
            </div>

            {/* Existing Skills List (Edit & Delete) */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-bold">Current Active Skills ({data.skills.length})</h3>
                  <p className="text-xs text-zinc-500">Edit technology names, categories, icons, or delete.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {data.skills.map((skill) => (
                  <div
                    key={skill.id}
                    className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3 relative group"
                  >
                    <div className="flex items-center justify-between">
                      <div className="p-2 rounded-lg bg-zinc-200 dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-800">
                        {renderSkillIcon(skill.iconName)}
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          deleteSkill(skill.id);
                          triggerToast();
                        }}
                        className="text-zinc-400 hover:text-rose-500 transition-colors p-1"
                        title="Delete Skill"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <input
                      type="text"
                      value={skill.name}
                      onChange={(e) => {
                        updateSkill(skill.id, { name: e.target.value });
                        triggerToast();
                      }}
                      className="w-full px-2.5 py-1 text-sm font-bold bg-white dark:bg-zinc-900 border border-zinc-300 dark:border-zinc-700 rounded"
                    />

                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <select
                        value={skill.category}
                        onChange={(e) => {
                          updateSkill(skill.id, { category: e.target.value });
                          triggerToast();
                        }}
                        className="px-2 py-1 bg-white dark:bg-zinc-900 border rounded"
                      >
                        <option value="Frontend">Frontend</option>
                        <option value="Kinetic">Kinetic</option>
                        <option value="Graphics">Graphics</option>
                        <option value="Backend & Tools">Tools</option>
                      </select>

                      <select
                        value={skill.iconName}
                        onChange={(e) => {
                          updateSkill(skill.id, { iconName: e.target.value });
                          triggerToast();
                        }}
                        className="px-2 py-1 bg-white dark:bg-zinc-900 border rounded font-mono text-[11px]"
                      >
                        {AVAILABLE_ICON_NAMES.map((name) => (
                          <option key={name} value={name}>
                            {name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 4: PROJECTS MANAGEMENT */}
        {/* ============================================================== */}
        {activeTab === 'projects' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            {/* Add Project */}
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Case Studies &amp; Projects ({data.projects.length})</h2>
                  <p className="text-xs text-zinc-500">Edit titles, metrics, images, and engineering solutions.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newProj: Project = {
                      id: 'proj-' + Date.now(),
                      title: 'New Featured System',
                      subtitle: 'Architecture description',
                      category: 'Fintech',
                      year: '2026',
                      role: 'Lead Architect',
                      image: '/src/assets/images/project_kroma_fintech_1793815484054.jpg',
                      summary: 'Summary of the system, performance benchmarks, and core impact.',
                      challenge: 'The technical challenge or architectural hurdle.',
                      solution: 'The solution implemented.',
                      metrics: [
                        { label: 'Metric A', value: '100%' },
                        { label: 'Metric B', value: '< 1ms' },
                      ],
                      technologies: ['React 19', 'TypeScript', 'Tailwind CSS'],
                      featured: false,
                    };
                    addProject(newProj);
                    triggerToast();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg shadow-sm"
                >
                  <Plus size={15} />
                  <span>Create Project</span>
                </button>
              </div>

              {/* Projects List */}
              <div className="space-y-6 pt-4">
                {data.projects.map((proj) => (
                  <div
                    key={proj.id}
                    className="p-6 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Title</label>
                          <input
                            type="text"
                            value={proj.title}
                            onChange={(e) => {
                              updateProject(proj.id, { title: e.target.value });
                              triggerToast();
                            }}
                            className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-zinc-900 border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Subtitle</label>
                          <input
                            type="text"
                            value={proj.subtitle}
                            onChange={(e) => {
                              updateProject(proj.id, { subtitle: e.target.value });
                              triggerToast();
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Category</label>
                          <select
                            value={proj.category}
                            onChange={(e) => {
                              updateProject(proj.id, { category: e.target.value as Project['category'] });
                              triggerToast();
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                          >
                            <option value="Fintech">Fintech</option>
                            <option value="Creative & Audio">Creative &amp; Audio</option>
                            <option value="Publishing & Tools">Publishing &amp; Tools</option>
                            <option value="Design Systems">Design Systems</option>
                          </select>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          deleteProject(proj.id);
                          triggerToast();
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-500"
                        title="Delete Project"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Image URL / Path</label>
                        <input
                          type="text"
                          value={proj.image}
                          onChange={(e) => {
                            updateProject(proj.id, { image: e.target.value });
                            triggerToast();
                          }}
                          className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Role / Year</label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={proj.role}
                            onChange={(e) => {
                              updateProject(proj.id, { role: e.target.value });
                              triggerToast();
                            }}
                            className="w-2/3 px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                            placeholder="Role"
                          />
                          <input
                            type="text"
                            value={proj.year}
                            onChange={(e) => {
                              updateProject(proj.id, { year: e.target.value });
                              triggerToast();
                            }}
                            className="w-1/3 px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900 border rounded"
                            placeholder="Year"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Summary</label>
                      <textarea
                        rows={2}
                        value={proj.summary}
                        onChange={(e) => {
                          updateProject(proj.id, { summary: e.target.value });
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 5: WORK EXPERIENCE */}
        {/* ============================================================== */}
        {activeTab === 'experience' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Work Experiences ({data.experiences.length})</h2>
                  <p className="text-xs text-zinc-500">Edit company names, roles, tenure, and achievements.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newExp: Experience = {
                      id: 'exp-' + Date.now(),
                      period: '2026 — Present',
                      role: 'Senior Engineering Consultant',
                      company: 'Global Studio Labs',
                      location: 'Remote · London / Dhaka',
                      type: 'Full-time',
                      description: 'Directing frontend architecture and high-performance interactive systems.',
                      achievements: [
                        'Spearheaded modern component systems and achieved 60fps animations.',
                      ],
                      stack: ['React', 'TypeScript', 'Tailwind CSS'],
                    };
                    addExperience(newExp);
                    triggerToast();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg shadow-sm"
                >
                  <Plus size={15} />
                  <span>Add Experience</span>
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {data.experiences.map((exp) => (
                  <div key={exp.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div>
                          <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Company</label>
                          <input
                            type="text"
                            value={exp.company}
                            onChange={(e) => {
                              updateExperience(exp.id, { company: e.target.value });
                              triggerToast();
                            }}
                            className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-zinc-900 border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Role</label>
                          <input
                            type="text"
                            value={exp.role}
                            onChange={(e) => {
                              updateExperience(exp.id, { role: e.target.value });
                              triggerToast();
                            }}
                            className="w-full px-3 py-1.5 text-sm bg-white dark:bg-zinc-900 border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Period</label>
                          <input
                            type="text"
                            value={exp.period}
                            onChange={(e) => {
                              updateExperience(exp.id, { period: e.target.value });
                              triggerToast();
                            }}
                            className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900 border rounded"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          deleteExperience(exp.id);
                          triggerToast();
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-500"
                        title="Delete Experience"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Description</label>
                      <textarea
                        rows={2}
                        value={exp.description}
                        onChange={(e) => {
                          updateExperience(exp.id, { description: e.target.value });
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 6: EDUCATION & CERTS */}
        {/* ============================================================== */}
        {activeTab === 'education' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Education &amp; Accreditations</h2>

              {/* Degrees */}
              {data.education.map((edu, idx) => (
                <div key={edu.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Degree Title</label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[idx].degree = e.target.value;
                          updateEducation(next);
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-zinc-900 border rounded"
                      />
                    </div>
                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Institution</label>
                      <input
                        type="text"
                        value={edu.institution}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[idx].institution = e.target.value;
                          updateEducation(next);
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-sm bg-white dark:bg-zinc-900 border rounded"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Period &amp; Location</label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={edu.period}
                          onChange={(e) => {
                            const next = [...data.education];
                            next[idx].period = e.target.value;
                            updateEducation(next);
                            triggerToast();
                          }}
                          className="w-1/2 px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900 border rounded"
                        />
                        <input
                          type="text"
                          value={edu.location}
                          onChange={(e) => {
                            const next = [...data.education];
                            next[idx].location = e.target.value;
                            updateEducation(next);
                            triggerToast();
                          }}
                          className="w-1/2 px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Honors / Distinction</label>
                      <input
                        type="text"
                        value={edu.honors || ''}
                        onChange={(e) => {
                          const next = [...data.education];
                          next[idx].honors = e.target.value;
                          updateEducation(next);
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                      />
                    </div>
                  </div>
                </div>
              ))}

              {/* Certifications */}
              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold">Certifications &amp; Accreditations</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newCert: Certification = {
                        name: 'New Certification Title',
                        issuer: 'Accreditation Body',
                        year: '2026',
                        credentialId: 'ID-0000',
                      };
                      updateCertifications([...data.certifications, newCert]);
                      triggerToast();
                    }}
                    className="inline-flex items-center gap-1 text-xs font-mono text-amber-500 hover:underline"
                  >
                    <Plus size={14} />
                    <span>Add Certification</span>
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {data.certifications.map((cert, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-2">
                      <div className="flex items-center justify-between">
                        <input
                          type="text"
                          value={cert.name}
                          onChange={(e) => {
                            const next = [...data.certifications];
                            next[idx].name = e.target.value;
                            updateCertifications(next);
                            triggerToast();
                          }}
                          className="w-3/4 px-2.5 py-1 text-xs font-bold bg-white dark:bg-zinc-900 border rounded"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            updateCertifications(data.certifications.filter((_, i) => i !== idx));
                            triggerToast();
                          }}
                          className="p-1 text-zinc-400 hover:text-rose-500"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                      <div className="flex gap-2 text-xs">
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => {
                            const next = [...data.certifications];
                            next[idx].issuer = e.target.value;
                            updateCertifications(next);
                            triggerToast();
                          }}
                          className="w-2/3 px-2 py-1 bg-white dark:bg-zinc-900 border rounded text-[11px]"
                          placeholder="Issuer"
                        />
                        <input
                          type="text"
                          value={cert.year}
                          onChange={(e) => {
                            const next = [...data.certifications];
                            next[idx].year = e.target.value;
                            updateCertifications(next);
                            triggerToast();
                          }}
                          className="w-1/3 px-2 py-1 font-mono text-[11px] bg-white dark:bg-zinc-900 border rounded text-amber-500"
                          placeholder="Year"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 7: BLOG POSTS (ADD & EDIT & DELETE) */}
        {/* ============================================================== */}
        {activeTab === 'blog' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Articles &amp; Essays ({data.blogPosts.length})</h2>
                  <p className="text-xs text-zinc-500">Publish new technical essays, edit existing content, or delete.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newPost: BlogPost = {
                      id: 'post-' + Date.now(),
                      title: 'New Engineering Essay',
                      slug: 'new-essay',
                      date: 'March 2026',
                      readTime: '4 min read',
                      category: 'Architecture',
                      excerpt: 'A short summary of your latest technical insight.',
                      content: 'Detailed editorial writeup with code snippets and architecture diagrams.',
                    };
                    addBlogPost(newPost);
                    triggerToast();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 text-xs font-bold uppercase tracking-wider bg-amber-400 hover:bg-amber-300 text-zinc-950 rounded-lg shadow-sm"
                >
                  <Plus size={15} />
                  <span>Create Essay</span>
                </button>
              </div>

              <div className="space-y-4 pt-2">
                {data.blogPosts.map((post) => (
                  <div key={post.id} className="p-5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950 space-y-3">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="sm:col-span-2">
                          <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Title</label>
                          <input
                            type="text"
                            value={post.title}
                            onChange={(e) => {
                              updateBlogPost(post.id, { title: e.target.value });
                              triggerToast();
                            }}
                            className="w-full px-3 py-1.5 text-sm font-bold bg-white dark:bg-zinc-900 border rounded"
                          />
                        </div>
                        <div>
                          <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Category</label>
                          <input
                            type="text"
                            value={post.category}
                            onChange={(e) => {
                              updateBlogPost(post.id, { category: e.target.value });
                              triggerToast();
                            }}
                            className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                          />
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          deleteBlogPost(post.id);
                          triggerToast();
                        }}
                        className="p-2 text-zinc-400 hover:text-rose-500"
                        title="Delete Post"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Date</label>
                        <input
                          type="text"
                          value={post.date}
                          onChange={(e) => {
                            updateBlogPost(post.id, { date: e.target.value });
                            triggerToast();
                          }}
                          className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900 border rounded"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Read Time</label>
                        <input
                          type="text"
                          value={post.readTime}
                          onChange={(e) => {
                            updateBlogPost(post.id, { readTime: e.target.value });
                            triggerToast();
                          }}
                          className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900 border rounded"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Excerpt</label>
                      <textarea
                        rows={2}
                        value={post.excerpt}
                        onChange={(e) => {
                          updateBlogPost(post.id, { excerpt: e.target.value });
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-xs bg-white dark:bg-zinc-900 border rounded"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-mono uppercase text-zinc-500 block mb-1">Full Content (Markdown format)</label>
                      <textarea
                        rows={4}
                        value={post.content}
                        onChange={(e) => {
                          updateBlogPost(post.id, { content: e.target.value });
                          triggerToast();
                        }}
                        className="w-full px-3 py-1.5 text-xs font-mono bg-white dark:bg-zinc-900 border rounded"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* TAB 8: DATA & RESET */}
        {/* ============================================================== */}
        {activeTab === 'data' && (
          <div className="space-y-8 animate-in fade-in duration-150">
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 space-y-6">
              <h2 className="text-xl font-bold tracking-tight">Data Management &amp; System Reset</h2>
              <p className="text-sm text-zinc-500">
                All modifications are automatically saved locally in your browser storage. You can backup your data or reset to defaults at any time.
              </p>

              <div className="p-5 rounded-xl border border-rose-300 dark:border-rose-900 bg-rose-50 dark:bg-rose-950/20 space-y-3">
                <h3 className="text-sm font-bold text-rose-700 dark:text-rose-400 flex items-center gap-2">
                  <RotateCcw size={16} />
                  <span>Factory Reset</span>
                </h3>
                <p className="text-xs text-rose-600 dark:text-rose-300">
                  Restore all content, skills, projects, and bio back to the default editorial state.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm('Are you sure you want to restore all portfolio data to defaults?')) {
                      resetToDefaults();
                      triggerToast();
                    }
                  }}
                  className="px-4 py-2 text-xs font-bold uppercase tracking-wider bg-rose-600 hover:bg-rose-500 text-white rounded-lg transition-colors"
                >
                  Reset Everything to Defaults
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
