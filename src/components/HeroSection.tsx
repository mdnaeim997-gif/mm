import React, { useState } from 'react';
import { Play, Mail, Film, Sparkles, Award } from 'lucide-react';
import { FEATURED_VIDEO } from '../data';
import { SiteSettings } from '../types';
import { Translations } from '../utils/translations';
import { formatWhatsAppLink } from '../utils/storage';

interface HeroSectionProps {
  settings: SiteSettings;
  t: Translations;
}

// Custom Brand Icons for Behance, Facebook, WhatsApp, YouTube
const BehanceIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.799 6c-2.316 0-4.198 1.488-4.198 4.256 0 2.298 1.442 3.864 3.737 3.864.887 0 1.636-.242 2.146-.576l-.427-1.396c-.482.264-1.042.433-1.64.433-1.373 0-2.096-.921-2.096-2.221h6.634c.068-.535.121-1.077.121-1.579C12.076 7.234 10.334 6 7.799 6zm-2.48 3.511c.148-1.037.954-1.921 2.373-1.921 1.258 0 2.146.793 2.297 1.921H5.319zm12.396-1.597h-4.398V6.6h4.398v1.314zm-4.398 9.943h4.412c2.408 0 4.093-1.378 4.093-3.69 0-1.639-.894-2.766-2.348-3.235 1.139-.462 1.838-1.443 1.838-2.784 0-2.14-1.674-3.342-3.876-3.342h-4.119v13.051zm2.392-11.233h1.838c1.171 0 1.989.584 1.989 1.678 0 1.144-.818 1.748-2.022 1.748h-1.805V8.224zm0 5.097h1.972c1.385 0 2.308.647 2.308 1.942 0 1.272-.942 2.012-2.374 2.012h-1.906v-3.954z"/>
  </svg>
);

const FacebookIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
  </svg>
);

const YouTubeIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
  </svg>
);

const WhatsAppIcon: React.FC<{ className?: string }> = ({ className = "w-4 h-4" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.301-.15-1.782-.879-2.058-.98-.276-.1-.476-.15-.676.15-.2.3-.777.98-.952 1.18-.175.2-.351.226-.652.075-.301-.15-1.272-.469-2.423-1.496-.895-.798-1.5-1.785-1.675-2.086-.175-.301-.019-.464.132-.614.136-.135.301-.351.451-.527.151-.175.201-.301.301-.501.1-.2.05-.376-.025-.526-.075-.15-.677-1.631-.927-2.233-.244-.587-.492-.507-.676-.517l-.577-.01c-.2 0-.526.075-.802.376-.276.301-1.053 1.028-1.053 2.508 0 1.479 1.078 2.908 1.229 3.109.15.2 2.121 3.239 5.14 4.542.718.31 1.279.495 1.716.634.722.23 1.38.197 1.9.12.58-.087 1.782-.728 2.032-1.43.25-.702.25-1.304.175-1.43-.075-.125-.276-.2-.577-.35zM12.042 21.944c-1.815 0-3.593-.49-5.145-1.417L2 22l1.503-4.783a9.92 9.92 0 0 1-1.545-5.275C1.958 6.444 6.48 1.922 12.042 1.922c2.69 0 5.22 1.048 7.123 2.951a10.02 10.02 0 0 1 2.955 7.114c0 5.556-4.522 10.078-10.078 10.078z"/>
  </svg>
);

export const HeroSection: React.FC<HeroSectionProps> = ({ settings, t }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imgError, setImgError] = useState(false);

  const thumbUrl = imgError
    ? `https://img.youtube.com/vi/${FEATURED_VIDEO.youtubeId}/hqdefault.jpg`
    : `https://img.youtube.com/vi/${FEATURED_VIDEO.youtubeId}/maxresdefault.jpg`;

  const waUrl = formatWhatsAppLink(settings.socialLinks.whatsapp);

  // Orbiting Software Icons specifications
  const orbitingTools = [
    {
      name: 'Premiere Pro',
      label: 'Pr',
      color: 'bg-[#00005b] text-[#9999ff] border-[#9999ff]/50 shadow-[#00005b]/40',
      desc: 'Video Editing'
    },
    {
      name: 'After Effects',
      label: 'Ae',
      color: 'bg-[#00005b] text-[#d291ff] border-[#d291ff]/50 shadow-[#00005b]/40',
      desc: 'Motion VFX'
    },
    {
      name: 'Illustrator',
      label: 'Ai',
      color: 'bg-[#330000] text-[#ff9a00] border-[#ff9a00]/50 shadow-[#ff9a00]/30',
      desc: 'Vector Art'
    },
    {
      name: 'Photoshop',
      label: 'Ps',
      color: 'bg-[#001e36] text-[#31a8ff] border-[#31a8ff]/50 shadow-[#31a8ff]/30',
      desc: 'Graphics'
    },
    {
      name: 'AI Creative',
      label: 'AI',
      color: 'bg-gradient-to-tr from-purple-900 to-indigo-950 text-amber-300 border-amber-400/40 shadow-purple-900/30',
      desc: 'Generative'
    },
    {
      name: 'Meta Ads',
      label: 'Meta',
      color: 'bg-[#062c5b] text-[#0081fb] border-[#0081fb]/50 shadow-blue-900/40',
      desc: 'Marketing'
    }
  ];

  return (
    <section id="hero-profile" className="pt-6 sm:pt-12 pb-10 sm:pb-16 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* ========================================== */}
        {/* PART 1: TOP PROFILE, ORBITING ICONS, NAME */}
        {/* ========================================== */}
        <div className="flex flex-col items-center text-center">
          
          {/* Visual Avatar with Orbiting Creative Software Icons - Enlarged Photo Area */}
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 flex items-center justify-center select-none my-2 sm:my-4">
            
            {/* Ambient Backlight Glow */}
            <div className="absolute inset-4 rounded-full bg-gradient-to-tr from-amber-500/25 via-rose-500/20 to-indigo-500/25 blur-3xl -z-10" />

            {/* Orbiting Container (Spins 360 degrees) */}
            <div className="absolute w-72 h-72 sm:w-88 sm:h-88 rounded-full animate-orbit pointer-events-none">
              {orbitingTools.map((tool, idx) => {
                const angleRad = (idx * 60 * Math.PI) / 180;
                const x = 50 + 49 * Math.cos(angleRad);
                const y = 50 + 49 * Math.sin(angleRad);

                return (
                  <div
                    key={tool.name}
                    style={{ left: `${x}%`, top: `${y}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 group z-20 cursor-pointer pointer-events-auto"
                  >
                    <div className="animate-orbit-counter">
                      <div
                        className={`w-9 h-9 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl border ${tool.color} shadow-lg flex items-center justify-center font-display font-black text-xs sm:text-sm tracking-tight transform group-hover:scale-125 transition-all duration-300`}
                        title={`${tool.name} - ${tool.desc}`}
                      >
                        {tool.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Central Prominent Avatar Frame - Enlarged as requested */}
            <div className="relative z-10 w-48 h-48 sm:w-60 sm:h-60 rounded-3xl sm:rounded-[32px] p-[5px] bg-gradient-to-tr from-amber-500 via-rose-500 to-indigo-500 shadow-2xl shadow-amber-500/30 group">
              <div className="w-full h-full rounded-[20px] sm:rounded-[27px] overflow-hidden bg-slate-950 relative">
                <img
                  src={settings.profileAvatar || 'profile.jpg'}
                  alt={settings.profileName}
                  className="w-full h-full object-cover object-center transform group-hover:scale-105 transition-transform duration-500"
                />
              </div>

              {/* Status Badge */}
              <div className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 px-3.5 py-1 rounded-full bg-slate-900/90 dark:bg-slate-950/90 border border-amber-500/40 backdrop-blur-md flex items-center gap-1.5 shadow-lg whitespace-nowrap">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[11px] text-white font-bold tracking-wide">Available for Work</span>
              </div>
            </div>
          </div>

          {/* Name & Title Block: Purely Naeim Visual */}
          <div className="mt-4 max-w-2xl px-2">
            
            {/* Creative Profession Pill */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-3 rounded-full text-xs sm:text-sm font-bold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/25 shadow-sm">
              <Film className="w-4 h-4 text-amber-500" />
              <span>{settings.profileTitle}</span>
            </div>

            {/* Name Highlight - Luxury Premium Gradient & Large Scale */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-display font-black tracking-tight leading-[1.05] drop-shadow-sm">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-sky-400 to-amber-300 dark:from-amber-400 dark:via-sky-300 dark:to-amber-200 filter drop-shadow-[0_2px_18px_rgba(245,158,11,0.25)]">
                {settings.profileName || 'Naeim Visual'}
              </span>
            </h1>

            {/* Premium Creator Badges / Tags */}
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                <span>#VisualArtist</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-sky-500/15 via-blue-500/20 to-indigo-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/30 shadow-sm">
                <Award className="w-3.5 h-3.5 text-sky-500" />
                <span>#VideoEditor</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-emerald-500/15 via-emerald-500/20 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-sm">
                <Sparkles className="w-3.5 h-3.5 text-emerald-500" />
                <span>#MotionGraphics</span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-gradient-to-r from-purple-500/15 via-purple-500/20 to-pink-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/30 shadow-sm">
                <Award className="w-3.5 h-3.5 text-purple-400" />
                <span>#MetaMarketing</span>
              </span>
            </div>

            <p className="mt-3.5 text-sm sm:text-base text-slate-600 dark:text-slate-300 leading-relaxed max-w-xl mx-auto font-normal">
              {settings.profileBio}
            </p>

            {/* Direct Social Links: Behance, WhatsApp, Facebook, YouTube + Email Icon with Smooth Scroll */}
            <div className="mt-6 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
              {/* Behance */}
              {settings.socialLinks.behance && (
                <a
                  href={settings.socialLinks.behance}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#0057ff] hover:bg-[#0047d9] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-500/20 hover:scale-105 active:scale-95 transition-all"
                  title="Behance Profile"
                >
                  <BehanceIcon className="w-4 h-4 fill-white" />
                  <span>{t.behance}</span>
                </a>
              )}

              {/* WhatsApp */}
              {waUrl && (
                <a
                  href={waUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20ba59] text-slate-950 font-bold text-xs sm:text-sm shadow-md shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                  title="Direct WhatsApp Chat"
                >
                  <WhatsAppIcon className="w-4 h-4 fill-slate-950" />
                  <span>{t.whatsapp}</span>
                </a>
              )}

              {/* Facebook */}
              {settings.socialLinks.facebook && (
                <a
                  href={settings.socialLinks.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#1877F2] hover:bg-[#1464cc] text-white font-bold text-xs sm:text-sm shadow-md shadow-blue-600/20 hover:scale-105 active:scale-95 transition-all"
                  title="Facebook Profile / Page"
                >
                  <FacebookIcon className="w-4 h-4 fill-white" />
                  <span>{t.facebook}</span>
                </a>
              )}

              {/* YouTube */}
              {settings.socialLinks.youtube && (
                <a
                  href={settings.socialLinks.youtube}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-[#FF0000] hover:bg-[#cc0000] text-white font-bold text-xs sm:text-sm shadow-md shadow-red-500/20 hover:scale-105 active:scale-95 transition-all"
                  title="YouTube Channel"
                >
                  <YouTubeIcon className="w-4 h-4 fill-white" />
                  <span>{t.youtube}</span>
                </a>
              )}

              {/* Email Icon Button: Clean logo only, clicks down to contact form */}
              <button
                type="button"
                onClick={() => {
                  const contactEl = document.getElementById('contact');
                  if (contactEl) {
                    contactEl.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="inline-flex items-center justify-center w-10 h-10 sm:w-11 sm:h-11 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold shadow-md shadow-amber-500/25 hover:scale-105 active:scale-95 transition-all cursor-pointer"
                title="Send Message / Email Me"
                aria-label="Email Me"
              >
                <Mail className="w-5 h-5 text-slate-950" />
              </button>
            </div>

          </div>
        </div>

        {/* ========================================== */}
        {/* PART 2: FEATURED SHOWREEL VIDEO PLAYER     */}
        {/* ========================================== */}
        <div className="mt-12 sm:mt-16">
          <div className="p-1 rounded-3xl bg-gradient-to-b from-amber-500/30 via-slate-800/40 to-transparent shadow-2xl">
            <div className="relative w-full aspect-video rounded-[22px] overflow-hidden bg-black shadow-2xl">
              <div
                onClick={() => {
                  const ytUrl = `https://youtu.be/${FEATURED_VIDEO.youtubeId}`;
                  window.open(ytUrl, '_blank');
                }}
                className="relative w-full h-full cursor-pointer overflow-hidden group/player select-none"
              >
                <img
                  src={thumbUrl}
                  alt={FEATURED_VIDEO.title}
                  onError={() => setImgError(true)}
                  className="absolute inset-0 w-full h-full object-cover group-hover/player:scale-105 transition-transform duration-700 opacity-90 group-hover/player:opacity-100"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-black/25" />

                {/* Dead-Center Play Button on All Devices */}
                <div className="absolute inset-0 flex flex-col items-center justify-center p-4 z-10 pointer-events-none">
                  <div className="w-14 h-14 sm:w-20 sm:h-20 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-2xl shadow-rose-600/60 ring-4 ring-white/25 transform group-hover/player:scale-110 transition-all duration-300">
                    <Play className="w-6 h-6 sm:w-9 sm:h-9 fill-current translate-x-0.5" />
                  </div>
                  <span className="mt-2.5 px-3 py-1 rounded-full bg-black/70 backdrop-blur-md border border-white/15 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-white shadow-lg flex items-center gap-1.5">
                    <YouTubeIcon className="w-3.5 h-3.5 fill-rose-500" />
                    <span>YouTube এ দেখুন • {t.featuredShowreel}</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
};
