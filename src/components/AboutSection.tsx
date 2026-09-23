import React from 'react';
import { User, Flame, CheckCircle2 } from 'lucide-react';
import { EDITING_SKILLS } from '../data';
import { SiteSettings } from '../types';
import { Translations } from '../utils/translations';

interface AboutSectionProps {
  settings: SiteSettings;
  t: Translations;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ settings, t }) => {
  const tools = [
    'Adobe Premiere Pro',
    'Adobe After Effects',
    'DaVinci Resolve',
    'Adobe Photoshop',
    'Adobe Illustrator',
    'Meta Ads Manager'
  ];

  return (
    <section id="about" className="py-12 sm:py-16 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-900/30">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="mb-10 text-center sm:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 mb-2">
            <User className="w-3.5 h-3.5" />
            <span>{t.aboutHeading}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-amber-700 to-amber-600 dark:from-white dark:via-amber-300 dark:to-amber-400">
              {t.aboutSubheading}
            </span>
          </h2>
        </div>

        {/* Featured Bio Card */}
        <div
          id="detailed-bio-card"
          className="relative rounded-3xl p-6 sm:p-9 bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800 shadow-lg"
        >
          <div className="flex flex-col md:flex-row gap-8 items-center md:items-start">
            {/* Avatar & Status */}
            <div className="shrink-0 flex flex-col items-center">
              <div className="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-amber-500/20 shadow-md">
                <img
                  src={settings.profileAvatar || 'profile.jpg'}
                  alt={settings.profileName}
                  className="w-full h-full object-cover object-center"
                />
              </div>

              <div className="mt-4 flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-semibold border border-emerald-500/20">
                <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                <span>Active Creator</span>
              </div>
            </div>

            {/* Bio Content */}
            <div className="flex-1">
              <h3 className="text-xl sm:text-2xl font-display font-bold mb-3">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-sky-400 to-amber-300 dark:from-amber-400 dark:via-sky-300 dark:to-amber-200">
                  {settings.profileTitle}
                </span>
              </h3>

              <blockquote className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-50/50 dark:bg-amber-950/20 rounded-r-xl">
                "{settings.profileBio}"
              </blockquote>

              {/* Editing Principles Badges */}
              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {EDITING_SKILLS.map((skill, index) => (
                  <div
                    key={index}
                    className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/60 dark:border-slate-800"
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <CheckCircle2 className="w-4 h-4 text-amber-500" />
                      <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
                        {skill.title}
                      </h4>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                      {skill.desc}
                    </p>
                  </div>
                ))}
              </div>

              {/* Toolkit Tools */}
              <div className="mt-6 pt-5 border-t border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase mr-1">
                  Toolkit:
                </span>
                {tools.map((tool) => (
                  <span
                    key={tool}
                    className="px-3 py-1 rounded-xl text-xs font-bold bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/5 text-amber-700 dark:text-amber-300 border border-amber-500/25 shadow-xs transition-all hover:scale-105"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
