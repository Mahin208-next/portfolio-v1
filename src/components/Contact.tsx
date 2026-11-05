import React, { useState, useEffect } from 'react';
import { Copy, Check, Send, Clock, ArrowUpRight } from 'lucide-react';
import { usePortfolio } from '../context/PortfolioContext';
import { SectionReveal } from './common/SectionReveal';
import { getSocialDisplayName, getSocialHref } from '../utils/socialHelpers';

export const Contact: React.FC = () => {
  const { data } = usePortfolio();
  const { personalInfo } = data;

  const [copied, setCopied] = useState(false);
  const [dhakaTime, setDhakaTime] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatted = new Intl.DateTimeFormat('en-US', {
        timeZone: 'Asia/Dhaka',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }).format(now);
      setDhakaTime(formatted);
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2400);
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) {
      errs.email = 'Valid email is required';
    }
    if (!formData.message.trim() || formData.message.length < 10) {
      errs.message = 'Please include a message (min 10 characters)';
    }
    return errs;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitting(true);

    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
    }, 600);
  };

  return (
    <section
      id="contact"
      className="py-16 lg:py-24 border-b border-zinc-200 dark:border-zinc-800"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <SectionReveal>
          {/* Section Header */}
          <div className="mb-10">
            <div className="flex items-center gap-2 text-xs font-mono uppercase tracking-wider text-yellow-500 dark:text-yellow-400 mb-2">
              <span>07</span>
              <span aria-hidden="true">·</span>
              <span>Contact</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white uppercase">
              Get in Touch
            </h2>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Left Column: Direct email, local time, links */}
            <div className="lg:col-span-5 space-y-6">
              {/* Email Card */}
              <div className="p-5 sm:p-6 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/40 backdrop-blur-md space-y-3 shadow-sm hover:shadow-md transition-all duration-300">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block">
                  Direct Email
                </span>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <span className="font-mono text-sm font-semibold text-yellow-600 dark:text-yellow-400 select-all truncate">
                    {personalInfo.email}
                  </span>
                  <button
                    type="button"
                    onClick={copyEmail}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded bg-zinc-100 hover:bg-zinc-200 dark:bg-zinc-800 dark:hover:bg-zinc-700 text-zinc-800 dark:text-white shrink-0 transition-colors self-start sm:self-auto"
                  >
                    {copied ? (
                      <>
                        <Check size={14} className="text-emerald-500" />
                        <span>Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copy</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Time Card */}
              <div className="p-4 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/20 backdrop-blur-md">
                <div className="flex items-center gap-1.5 text-xs font-mono text-zinc-500 mb-1">
                  <Clock size={13} className="text-yellow-500" />
                  <span>Dhaka Local Time (BST)</span>
                </div>
                <div className="font-mono text-base font-bold text-zinc-900 dark:text-white tabular-nums">
                  {dhakaTime || 'UTC+06:00'}
                </div>
              </div>

              {/* Social Links */}
              <div className="pt-2">
                <span className="text-xs font-mono uppercase tracking-wider text-zinc-500 block mb-2">
                  Digital Presence
                </span>
                <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                  {personalInfo.socials.map((s, idx) => (
                    <a
                      key={`${s.name}-${idx}`}
                      href={getSocialHref(s)}
                      target="_blank"
                      rel="noreferrer"
                      className="text-zinc-700 dark:text-zinc-300 hover:text-yellow-500 dark:hover:text-yellow-400 flex items-center gap-1 transition-colors"
                    >
                      <span>{getSocialDisplayName(s)}</span>
                      <ArrowUpRight size={13} />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Clean Form */}
            <div className="lg:col-span-7">
              <div className="p-5 sm:p-7 rounded-2xl border border-zinc-200 dark:border-zinc-800 bg-white/85 dark:bg-zinc-900/40 backdrop-blur-md shadow-sm hover:shadow-md transition-all duration-300">
                {submitted ? (
                  <div className="py-10 text-center space-y-3 animate-in fade-in">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-500 flex items-center justify-center mx-auto">
                      <Check size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-zinc-900 dark:text-white">
                      Message Sent
                    </h3>
                    <p className="text-xs text-zinc-600 dark:text-zinc-400">
                      Thank you, {formData.name}. Your note has been routed to {personalInfo.email}.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setSubmitted(false);
                        setFormData({ name: '', email: '', message: '' });
                      }}
                      className="mt-3 px-3 py-1.5 text-xs font-mono uppercase text-yellow-500 border border-yellow-500/40 rounded hover:bg-yellow-500/10 transition-colors"
                    >
                      Send Another
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                          Name
                        </label>
                        <input
                          type="text"
                          placeholder="Your name"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border rounded-lg text-zinc-900 dark:text-white focus:outline-none transition-colors ${
                            errors.name
                              ? 'border-rose-500'
                              : 'border-zinc-300 dark:border-zinc-800 focus:border-yellow-400'
                          }`}
                        />
                        {errors.name && (
                          <p className="text-[11px] font-mono text-rose-500 mt-1">{errors.name}</p>
                        )}
                      </div>

                      <div>
                        <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                          Email
                        </label>
                        <input
                          type="email"
                          placeholder="your.email@domain.com"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className={`w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border rounded-lg text-zinc-900 dark:text-white focus:outline-none transition-colors ${
                            errors.email
                              ? 'border-rose-500'
                              : 'border-zinc-300 dark:border-zinc-800 focus:border-yellow-400'
                          }`}
                        />
                        {errors.email && (
                          <p className="text-[11px] font-mono text-rose-500 mt-1">{errors.email}</p>
                        )}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-mono uppercase text-zinc-500 mb-1.5">
                        Message
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Your project, role, or inquiry..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className={`w-full px-3.5 py-2.5 text-sm bg-zinc-50 dark:bg-zinc-950 border rounded-lg text-zinc-900 dark:text-white focus:outline-none transition-colors ${
                          errors.message
                            ? 'border-rose-500'
                            : 'border-zinc-300 dark:border-zinc-800 focus:border-yellow-400'
                        }`}
                      />
                      {errors.message && (
                        <p className="text-[11px] font-mono text-rose-500 mt-1">{errors.message}</p>
                      )}
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 px-6 text-xs font-bold uppercase tracking-wider bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-zinc-950 rounded-lg transition-colors flex items-center justify-center gap-2 shadow-sm font-mono"
                    >
                      {submitting ? (
                        <span>Sending...</span>
                      ) : (
                        <>
                          <span>Send Message</span>
                          <Send size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
};
