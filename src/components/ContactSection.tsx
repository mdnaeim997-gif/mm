import React, { useState } from 'react';
import { Mail, MessageSquare, Copy, Check, Send, Lock } from 'lucide-react';
import { SiteSettings } from '../types';
import { Translations } from '../utils/translations';

interface ContactSectionProps {
  settings: SiteSettings;
  t: Translations;
  onOpenAdmin: () => void;
}

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

export const ContactSection: React.FC<ContactSectionProps> = ({ settings, t, onOpenAdmin }) => {
  const [copied, setCopied] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    projectType: 'Video Editing',
    details: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const email = settings.socialLinks.email || 'mdnaeim997@gmail.com';

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    const subject = encodeURIComponent(`Project Inquiry: ${formData.projectType} from ${formData.name || 'Client'}`);
    const body = encodeURIComponent(
      `Hi ${settings.profileName},\n\nMy name is ${formData.name}.\nI'm interested in collaborating on: ${formData.projectType}.\n\nProject details:\n${formData.details}\n\nLooking forward to hearing from you!`
    );
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 4000);
  };

  return (
    <section id="contact" className="py-12 sm:py-20 border-t border-slate-200/80 dark:border-slate-800/80 relative">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs mb-2">
            <Mail className="w-3.5 h-3.5 text-amber-500" />
            <span>{t.contactHeading}</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-amber-700 to-amber-600 dark:from-white dark:via-amber-300 dark:to-amber-400">
              {t.contactSubheading}
            </span>
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Direct channels */}
          <div className="lg:col-span-5 space-y-4">
            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email</span>
                <button
                  onClick={handleCopyEmail}
                  className="flex items-center gap-1 text-xs font-bold text-amber-500 hover:text-amber-600"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
              <p className="mt-2 text-sm sm:text-base font-bold text-slate-900 dark:text-white truncate">
                {email}
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Connect Directly</span>
              
              <div className="grid grid-cols-2 gap-2">
                {settings.socialLinks.whatsapp && (
                  <a
                    href={settings.socialLinks.whatsapp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#25D366]/10 text-[#25D366] font-bold text-xs hover:bg-[#25D366]/20 transition-colors"
                  >
                    <WhatsAppIcon className="w-4 h-4 fill-current" />
                    <span>WhatsApp</span>
                  </a>
                )}

                {settings.socialLinks.facebook && (
                  <a
                    href={settings.socialLinks.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#1877F2]/10 text-[#1877F2] font-bold text-xs hover:bg-[#1877F2]/20 transition-colors"
                  >
                    <FacebookIcon className="w-4 h-4 fill-current" />
                    <span>Facebook</span>
                  </a>
                )}

                {settings.socialLinks.behance && (
                  <a
                    href={settings.socialLinks.behance}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#0057ff]/10 text-[#0057ff] font-bold text-xs hover:bg-[#0057ff]/20 transition-colors"
                  >
                    <BehanceIcon className="w-4 h-4 fill-current" />
                    <span>Behance</span>
                  </a>
                )}

                {settings.socialLinks.youtube && (
                  <a
                    href={settings.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 p-2.5 rounded-xl bg-[#FF0000]/10 text-[#FF0000] font-bold text-xs hover:bg-[#FF0000]/20 transition-colors"
                  >
                    <YouTubeIcon className="w-4 h-4 fill-current" />
                    <span>YouTube</span>
                  </a>
                )}
              </div>
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <form
              onSubmit={handleSendMessage}
              className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-lg space-y-4"
            >
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Alex Rahman"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-amber-500 focus:outline-none text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Type
                </label>
                <select
                  value={formData.projectType}
                  onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-amber-500 focus:outline-none text-xs sm:text-sm text-slate-900 dark:text-white font-medium"
                >
                  <option value="Video Editing">{t.videoEditing}</option>
                  <option value="Graphic Design">{t.graphicsDesign}</option>
                  <option value="Meta Ads Marketing">{t.metaMarketing}</option>
                  <option value="Full Project Bundle">All Services Bundle</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  Project Details
                </label>
                <textarea
                  required
                  rows={4}
                  placeholder="Describe your video, graphics, or campaign goals..."
                  value={formData.details}
                  onChange={(e) => setFormData({ ...formData, details: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-amber-500 focus:outline-none text-xs sm:text-sm text-slate-900 dark:text-white"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs sm:text-sm shadow-lg flex items-center justify-center gap-2 transition-transform hover:scale-[1.01]"
              >
                <Send className="w-4 h-4" />
                <span>Send Project Inquiry</span>
              </button>

              {submitted && (
                <p className="text-center text-xs font-bold text-emerald-500 mt-2">
                  Opening your email client to send message...
                </p>
              )}
            </form>
          </div>

        </div>

        {/* Footer info & Discreet Admin Key */}
        <div className="mt-14 pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} {settings.profileName}. All rights reserved.</p>
          
          {/* Discreet Admin Lock - only owner knows to access here */}
          <button
            onClick={onOpenAdmin}
            title="Admin Login"
            className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-amber-500 transition-colors opacity-40 hover:opacity-100"
          >
            <Lock className="w-3 h-3" />
            <span>Studio</span>
          </button>
        </div>

      </div>
    </section>
  );
};
