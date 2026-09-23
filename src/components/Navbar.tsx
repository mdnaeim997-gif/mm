import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, Film, Menu, X, Globe, ChevronDown, Check } from 'lucide-react';
import { ThemeMode, PanelMode } from '../types';
import { Language, Translations } from '../utils/translations';

interface NavbarProps {
  theme: ThemeMode;
  onToggleTheme: () => void;
  language: Language;
  onSelectLanguage: (lang: Language) => void;
  t: Translations;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  theme,
  onToggleTheme,
  language,
  onSelectLanguage,
  t,
  onOpenAdmin
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [langDropdownOpen, setLangDropdownOpen] = useState(false);
  const langDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (langDropdownRef.current && !langDropdownRef.current.contains(event.target as Node)) {
        setLangDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const navLinks = [
    { label: t.videoEditing, href: '#videos' },
    { label: t.graphicsDesign, href: '#graphics' },
    { label: t.metaMarketing, href: '#marketing' },
    { label: t.contactHeading, href: '#contact' },
  ];

  const languages: { code: Language; name: string; nativeName: string }[] = [
    { code: 'bn', name: 'Bengali', nativeName: 'বাংলা' },
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
    { code: 'ur', name: 'Urdu', nativeName: 'اردو' },
    { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी' },
    { code: 'es', name: 'Spanish', nativeName: 'Español' },
    { code: 'fr', name: 'French', nativeName: 'Français' },
    { code: 'de', name: 'German', nativeName: 'Deutsch' },
    { code: 'it', name: 'Italian', nativeName: 'Italiano' },
    { code: 'pt', name: 'Portuguese', nativeName: 'Português' },
    { code: 'tr', name: 'Turkish', nativeName: 'Türkçe' }
  ];

  const currentLangObj = languages.find((l) => l.code === language) || languages[0];

  return (
    <header
      id="main-navbar"
      className="sticky top-0 z-40 w-full backdrop-blur-md border-b transition-colors duration-300 bg-white/90 dark:bg-[#070b14]/90 border-slate-200/90 dark:border-slate-800/80 shadow-xs"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
        
        {/* Brand / Logo + Secret Circular 'A' Admin Trigger */}
        <div className="flex items-center gap-2.5 shrink-0">
          <a
            href="#"
            id="nav-brand-link"
            className="flex items-center gap-2.5 group focus:outline-none rounded-lg"
          >
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 via-blue-600 to-amber-500 flex items-center justify-center text-white shadow-md shadow-sky-500/20 group-hover:scale-105 transition-transform">
              <Film className="w-5 h-5" />
            </div>
            <div className="flex flex-col">
              <span className="font-display font-black text-base sm:text-lg tracking-tight bg-gradient-to-r from-sky-500 via-blue-600 to-amber-500 dark:from-sky-400 dark:via-blue-400 dark:to-amber-400 bg-clip-text text-transparent leading-tight">
                Naeim Visual
              </span>
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-bold tracking-wider text-sky-600 dark:text-sky-400 uppercase">
                  Portfolio
                </span>
              </div>
            </div>
          </a>

          {/* Discreet Circular 'A' button beside Naeim Visual Portfolio for Owner / Admin */}
          <button
            type="button"
            onClick={onOpenAdmin}
            id="secret-admin-trigger-a"
            title="A"
            aria-label="Admin Studio"
            className="w-5 h-5 rounded-full border border-slate-300 dark:border-slate-700 bg-slate-100/80 dark:bg-slate-800/80 hover:bg-amber-500 hover:border-amber-500 hover:text-slate-950 text-slate-500 dark:text-slate-400 text-[10px] font-black flex items-center justify-center transition-all opacity-40 hover:opacity-100 hover:scale-110 shadow-xs cursor-pointer"
          >
            A
          </button>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-bold text-slate-600 dark:text-slate-300">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="hover:text-amber-500 dark:hover:text-amber-400 transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right Action Controls: Language Switcher + Theme Toggle */}
        <div className="flex items-center gap-2">
          
          {/* Language Switcher: Simple 'Language' text with small globe icon + dropdown */}
          <div className="relative" ref={langDropdownRef}>
            <button
              type="button"
              id="language-dropdown-btn"
              onClick={() => setLangDropdownOpen(!langDropdownOpen)}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100/90 dark:bg-slate-900/90 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200 text-xs font-semibold transition-all shadow-xs"
              title="Change Language"
              aria-expanded={langDropdownOpen}
            >
              <Globe className="w-3.5 h-3.5 text-sky-500" />
              <span>{t.languageLabel || 'ল্যাঙ্গুয়েজ'}</span>
              <ChevronDown className={`w-3 h-3 text-slate-400 transition-transform ${langDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {langDropdownOpen && (
              <div
                id="language-dropdown-menu"
                className="absolute right-0 mt-1.5 w-44 max-h-72 overflow-y-auto rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-xl py-1 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  Select Language
                </div>
                {languages.map((l) => {
                  const isSelected = language === l.code;
                  return (
                    <button
                      key={l.code}
                      onClick={() => {
                        onSelectLanguage(l.code);
                        setLangDropdownOpen(false);
                      }}
                      className={`w-full flex items-center justify-between px-3 py-2 text-xs text-left transition-colors ${
                        isSelected
                          ? 'bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold'
                          : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span className="flex items-center gap-2">
                        <span>{l.nativeName}</span>
                        <span className="text-[10px] text-slate-400 font-normal">({l.name})</span>
                      </span>
                      {isSelected && <Check className="w-3.5 h-3.5 text-amber-500" />}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={onToggleTheme}
            id="theme-toggle-btn"
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
            className="p-2 sm:p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            id="mobile-menu-btn"
            className="md:hidden p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile dropdown menu */}
      {mobileMenuOpen && (
        <div
          id="mobile-nav-dropdown"
          className="md:hidden border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-[#070b14] px-4 py-3 space-y-2 transition-all shadow-xl"
        >
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  );
};
