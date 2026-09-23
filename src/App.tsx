/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback } from 'react';
import { ThemeMode, PanelMode, GraphicItem, VideoItem, MarketingItem, SiteSettings, ProjectCategory } from './types';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { VideoGrid } from './components/VideoGrid';
import { GraphicSection } from './components/GraphicSection';
import { MarketingSection } from './components/MarketingSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { AdminPanel } from './components/AdminPanel';
import { ExportHtmlModal } from './components/ExportHtmlModal';
import {
  getCustomGraphics, getCustomVideos, getCustomMarketing,
  saveCustomGraphic, saveCustomVideo, saveCustomMarketing,
  deleteCustomGraphic, deleteCustomVideo, deleteCustomMarketing,
  resetDefaultVideos,
  getSiteSettings, saveSiteSettings
} from './utils/storage';
import { Language, TRANSLATIONS } from './utils/translations';
import { Eye, ShieldCheck } from 'lucide-react';

export default function App() {
  // Theme state
  const [theme, setTheme] = useState<ThemeMode>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'light') return 'light';
    }
    return 'dark';
  });

  // Language state (Default Bengali 'bn')
  const [language, setLanguage] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('naeim_portfolio_lang') as Language;
      if (savedLang && ['bn', 'en', 'ar', 'ur', 'hi', 'es', 'fr', 'de', 'it', 'pt', 'tr'].includes(savedLang)) {
        return savedLang;
      }
    }
    return 'bn';
  });

  const t = TRANSLATIONS[language] || TRANSLATIONS.bn;

  // Site Settings state
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(() => getSiteSettings());

  // Panel Mode state: 'public' (Visitors) or 'admin' (Management & Upload)
  const [panelMode, setPanelMode] = useState<PanelMode>(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      if (urlParams.get('admin') === 'true') return 'admin';
    }
    return 'public';
  });

  const [adminInitialTab, setAdminInitialTab] = useState<'upload' | 'manage' | 'settings'>('upload');
  const [adminInitialCategory, setAdminInitialCategory] = useState<ProjectCategory>('Video Editing');

  const [exportModalOpen, setExportModalOpen] = useState(false);

  // Custom uploaded items state from IndexedDB
  const [customGraphics, setCustomGraphics] = useState<GraphicItem[]>([]);
  const [customVideos, setCustomVideos] = useState<VideoItem[]>([]);
  const [customMarketing, setCustomMarketing] = useState<MarketingItem[]>([]);

  const refreshCustomItems = useCallback(async () => {
    try {
      const [graphics, videos, marketing] = await Promise.all([
        getCustomGraphics(),
        getCustomVideos(),
        getCustomMarketing()
      ]);
      setCustomGraphics(graphics);
      setCustomVideos(videos);
      setCustomMarketing(marketing);
      setSiteSettings(getSiteSettings());
    } catch (err) {
      console.error('Failed to load custom uploads:', err);
    }
  }, []);

  useEffect(() => {
    refreshCustomItems();
  }, [refreshCustomItems]);

  // Keyboard shortcut to open Admin: Alt + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.altKey && (e.key === 'a' || e.key === 'A')) {
        setPanelMode((prev) => (prev === 'admin' ? 'public' : 'admin'));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Save Handlers
  const handleSaveVideo = async (video: VideoItem) => {
    await saveCustomVideo(video);
    await refreshCustomItems();
  };

  const handleSaveGraphic = async (graphic: GraphicItem) => {
    await saveCustomGraphic(graphic);
    await refreshCustomItems();
  };

  const handleSaveMarketing = async (marketing: MarketingItem) => {
    await saveCustomMarketing(marketing);
    await refreshCustomItems();
  };

  // Delete Handlers
  const handleDeleteGraphic = async (id: string) => {
    try {
      await deleteCustomGraphic(id);
      await refreshCustomItems();
    } catch (err) {
      console.error('Error deleting graphic:', err);
    }
  };

  const handleDeleteVideo = async (id: string) => {
    try {
      await deleteCustomVideo(id);
      await refreshCustomItems();
    } catch (err) {
      console.error('Error deleting video:', err);
    }
  };

  const handleDeleteMarketing = async (id: string) => {
    try {
      await deleteCustomMarketing(id);
      await refreshCustomItems();
    } catch (err) {
      console.error('Error deleting marketing:', err);
    }
  };

  const handleResetDefaultVideos = async () => {
    try {
      await resetDefaultVideos();
      await refreshCustomItems();
    } catch (err) {
      console.error('Error resetting default videos:', err);
    }
  };

  // Language selector
  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    localStorage.setItem('naeim_portfolio_lang', lang);
    // Adjust RTL if Arabic or Urdu
    if (lang === 'ar' || lang === 'ur') {
      document.documentElement.dir = 'rtl';
    } else {
      document.documentElement.dir = 'ltr';
    }
  };

  // Sync theme with html root class
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#0c111c] text-slate-900 dark:text-slate-100 transition-colors duration-300 selection:bg-amber-500 selection:text-white">
      {/* 1. Universal Top Navigation Bar with Language Switcher & Theme Toggle */}
      <Navbar
        theme={theme}
        onToggleTheme={toggleTheme}
        language={language}
        onSelectLanguage={handleSelectLanguage}
        t={t}
        onOpenAdmin={() => setPanelMode('admin')}
      />

      {/* 2. ADMIN PANEL VIEW (Only visible when toggled by owner) */}
      {panelMode === 'admin' ? (
        <AdminPanel
          onBackToPublic={() => setPanelMode('public')}
          onSaveVideo={handleSaveVideo}
          onSaveGraphic={handleSaveGraphic}
          onSaveMarketing={handleSaveMarketing}
          customVideos={customVideos}
          customGraphics={customGraphics}
          customMarketing={customMarketing}
          onDeleteVideo={handleDeleteVideo}
          onDeleteGraphic={handleDeleteGraphic}
          onDeleteMarketing={handleDeleteMarketing}
          onSettingsUpdated={(s) => setSiteSettings(s)}
          onResetDefaultVideos={handleResetDefaultVideos}
          initialTab={adminInitialTab}
          initialCategory={adminInitialCategory}
        />
      ) : (
        /* 3. PUBLIC PORTFOLIO VIEW (What clients and visitors see) */
        <main className="relative overflow-hidden">
          {/* Subtle Ambient Background Gradients */}
          <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-amber-500/5 dark:bg-amber-500/10 blur-[130px] rounded-full -z-10" />
          <div className="pointer-events-none absolute top-[900px] -right-40 w-[600px] h-[500px] bg-rose-500/5 dark:bg-rose-500/10 blur-[140px] rounded-full -z-10" />
          <div className="pointer-events-none absolute top-[1800px] -left-40 w-[600px] h-[500px] bg-blue-500/5 dark:bg-blue-500/10 blur-[140px] rounded-full -z-10" />

          {/* Part A: Name, Logo, Avatar with Orbiting Software Icons + Social Links + Showreel */}
          <HeroSection settings={siteSettings} t={t} />

          {/* Part B: Video Portfolio Grid (808x636 Frame, 2 columns on Mobile & PC) */}
          <VideoGrid
            customVideos={customVideos}
            t={t}
            showLikesAndComments={siteSettings.showLikesAndComments}
          />

          {/* Part C: Graphic Design & Behance Showcase (808x636 Frame, 2 columns on Mobile & PC) */}
          <GraphicSection
            customGraphics={customGraphics}
            t={t}
            showLikesAndComments={siteSettings.showLikesAndComments}
          />

          {/* Part D: Digital Marketing & Meta Ads Campaigns (808x636 Frame, 2 columns on Mobile & PC) */}
          <MarketingSection
            customMarketing={customMarketing}
            t={t}
            showLikesAndComments={siteSettings.showLikesAndComments}
          />

          {/* Part E: About Section (Passion, Vision & Tool Proficiency) */}
          <AboutSection settings={siteSettings} t={t} />

          {/* Part F: Bottom Contact & Direct Gmail Section */}
          <ContactSection settings={siteSettings} t={t} onOpenAdmin={() => setPanelMode('admin')} />
        </main>
      )}

      {/* Floating View Site Button when Admin is in preview */}
      {panelMode === 'admin' && (
        <div className="fixed bottom-5 right-5 z-40">
          <button
            type="button"
            onClick={() => setPanelMode('public')}
            id="floating-public-view-btn"
            className="flex items-center gap-2 px-5 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black text-xs sm:text-sm shadow-2xl shadow-emerald-500/40 hover:scale-105 active:scale-95 transition-all"
            title="View Live Public Portfolio"
          >
            <Eye className="w-4 h-4" />
            <span>ভিউ পোর্টফোলিও (View Site)</span>
          </button>
        </div>
      )}

      {/* Export / Standalone Single-File HTML Modal */}
      <ExportHtmlModal
        isOpen={exportModalOpen}
        onClose={() => setExportModalOpen(false)}
      />
    </div>
  );
}
