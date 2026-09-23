import React, { useState } from 'react';
import { X, Copy, Check, Download, Code } from 'lucide-react';

interface ExportHtmlModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportHtmlModal: React.FC<ExportHtmlModalProps> = ({ isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const singleFileHtmlCode = `<!DOCTYPE html>
<html lang="en" class="dark">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Naeim Visual - Video Editor Portfolio</title>
  <meta name="description" content="Official single-page portfolio of Naeim Visual, Video Editor and Visual Storyteller.">
  <!-- Tailwind CSS via CDN -->
  <script src="https://cdn.tailwindcss.com"></script>
  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            sans: ['"Plus Jakarta Sans"', 'sans-serif'],
            display: ['Syne', 'sans-serif'],
          }
        }
      }
    }
  </script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700&family=Syne:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Plus Jakarta Sans', sans-serif; }
    h1, h2, h3, h4, .font-display { font-family: 'Syne', sans-serif; letter-spacing: -0.02em; }
    html { scroll-behavior: smooth; }
  </style>
</head>
<body class="min-h-screen bg-white dark:bg-[#0c111c] text-slate-900 dark:text-slate-100 transition-colors duration-300">

  <!-- A. Navigation Bar -->
  <header class="sticky top-0 z-40 w-full backdrop-blur-md border-b bg-white/80 dark:bg-[#0c111c]/85 border-slate-200 dark:border-slate-800/80">
    <div class="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
      <a href="#" class="flex items-center gap-3">
        <div class="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-rose-500 flex items-center justify-center text-white font-bold">
          NV
        </div>
        <div>
          <span class="font-display font-bold text-lg text-slate-900 dark:text-white leading-tight block">Naeim Visual</span>
          <span class="text-[11px] font-medium tracking-wide text-slate-500 dark:text-slate-400 uppercase">Video Editor</span>
        </div>
      </a>
      <div class="flex items-center gap-4">
        <nav class="hidden md:flex items-center gap-6 text-sm font-medium text-slate-600 dark:text-slate-300">
          <a href="#featured" class="hover:text-amber-500">Featured</a>
          <a href="#videos" class="hover:text-amber-500">Videos</a>
          <a href="#graphics" class="hover:text-amber-500">Graphics</a>
          <a href="#about" class="hover:text-amber-500">About</a>
          <a href="#contact" class="hover:text-amber-500">Contact</a>
        </nav>
        <!-- Theme Toggle Button -->
        <button id="themeToggle" class="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-200" title="Toggle theme">
          <span id="themeIcon">☀️</span>
        </button>
      </div>
    </div>
  </header>

  <!-- B. Hero Section (Feature Video & Short Greeting) -->
  <section id="featured" class="pt-8 sm:pt-12 pb-14">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="mb-3 flex items-center justify-between">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20">
          ★ Featured Trailer • Best Work
        </span>
        <span class="text-xs text-slate-500 dark:text-slate-400">1080p • Full Audio Mix</span>
      </div>

      <!-- Featured Video Container (aspect-ratio: 16/9) -->
      <div class="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-slate-200 dark:border-slate-800 shadow-xl">
        <iframe src="https://www.youtube.com/embed/Czw6vV-Eklk?rel=0&modestbranding=1" class="w-full h-full border-0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
      </div>

      <!-- Short Greeting with profile.jpg -->
      <div class="mt-8 p-6 sm:p-8 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800">
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div class="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden ring-4 ring-amber-500/20 shadow-lg shrink-0">
            <img src="profile.jpg" alt="Naeim Visual Profile" class="w-full h-full object-cover">
          </div>
          <div class="text-center sm:text-left">
            <span class="px-2.5 py-0.5 text-xs font-semibold rounded bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">Visual Storyteller</span>
            <h1 class="text-2xl sm:text-4xl font-display font-extrabold text-slate-900 dark:text-white mt-2">
              Hey, I'm <span class="text-amber-500">Naeim Visual</span>
            </h1>
            <p class="mt-2 text-slate-600 dark:text-slate-300 max-w-2xl leading-relaxed">
              Welcome to my portfolio! I transform raw clips into captivating visual stories with fast-paced rhythm, punchy sound design, and modern cinematic aesthetics.
            </p>
            <div class="mt-5 flex flex-wrap items-center justify-center sm:justify-start gap-3">
              <a href="#videos" class="px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-amber-500 text-white dark:text-slate-950 font-semibold text-sm">Explore Portfolio ↓</a>
              <a href="#contact" class="px-5 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 font-medium text-sm">Let's Collaborate</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- C. Video Portfolio Grid -->
  <section id="videos" class="py-14 border-t border-slate-200 dark:border-slate-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span class="px-3 py-1 rounded-full text-xs font-semibold bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/20">Selected Portfolio (5 Works)</span>
          <h2 class="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mt-2">Video Portfolio Grid</h2>
          <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">Official video edits from Naeimul Islam: motion graphics, documentaries, and creative cuts.</p>
        </div>
        <a href="https://www.youtube.com/@MdNaeim-u8x" target="_blank" rel="noopener noreferrer" class="px-4 py-2 rounded-xl bg-rose-600 text-white font-semibold text-xs sm:text-sm hover:bg-rose-700 transition-colors w-fit">
          Visit Channel @MdNaeim-u8x ↗
        </a>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        <!-- Video 1 -->
        <div class="rounded-2xl overflow-hidden bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
          <div class="aspect-video bg-black">
            <iframe src="https://www.youtube.com/embed/kuIQFjypFSs" class="w-full h-full border-0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div class="p-5">
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">Motion Graphics & Animation</span>
            <h3 class="text-lg font-bold mt-2">Motion Graphics & Animation Showreel</h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Official animation and motion graphics showcase featuring dynamic transitions and audio-reactive pacing.</p>
          </div>
        </div>

        <!-- Video 2 -->
        <div class="rounded-2xl overflow-hidden bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
          <div class="aspect-video bg-black">
            <iframe src="https://www.youtube.com/embed/1u6Tp4tM2lY" class="w-full h-full border-0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div class="p-5">
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">Documentary & Story</span>
            <h3 class="text-lg font-bold mt-2">I went to Asunnai Skill today.</h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">On-location storytelling cut capturing the vibrant environment of As-Sunnah Skill with natural sound foley.</p>
          </div>
        </div>

        <!-- Video 3 -->
        <div class="rounded-2xl overflow-hidden bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
          <div class="aspect-video bg-black">
            <iframe src="https://www.youtube.com/embed/7d1hAfH7egc" class="w-full h-full border-0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div class="p-5">
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">Documentary & Story</span>
            <h3 class="text-lg font-bold mt-2">My 3 Months Experience at As-Sunnah Skill</h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Deep narrative journey sharing three months of immersive learning, edited with balanced dialogue and B-roll.</p>
          </div>
        </div>

        <!-- Video 4 -->
        <div class="rounded-2xl overflow-hidden bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
          <div class="aspect-video bg-black">
            <iframe src="https://www.youtube.com/embed/loftNkx9sOs" class="w-full h-full border-0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div class="p-5">
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">Shorts & Adventure</span>
            <h3 class="text-lg font-bold mt-2">A One-Day Outdoor Adventure!</h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Fast-paced, hook-optimized vertical adventure edit utilizing speed ramps, punchy whooshes, and high retention.</p>
          </div>
        </div>

        <!-- Video 5 -->
        <div class="rounded-2xl overflow-hidden bg-white dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all">
          <div class="aspect-video bg-black">
            <iframe src="https://www.youtube.com/embed/oZdRVLPeWlg" class="w-full h-full border-0" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe>
          </div>
          <div class="p-5">
            <span class="text-xs font-semibold px-2 py-0.5 rounded bg-amber-500/10 text-amber-500">Motion Graphics & Animation</span>
            <h3 class="text-lg font-bold mt-2">Brand UI Motion Design Showcase</h3>
            <p class="text-xs sm:text-sm text-slate-500 mt-1">Sleek tech interface motion design showcasing crisp timing curves and modern corporate aesthetic.</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- D. Graphic Work Section -->
  <section id="graphics" class="py-14 border-t border-slate-200 dark:border-slate-800">
    <div class="max-w-6xl mx-auto px-4 sm:px-6">
      <div class="mb-10">
        <span class="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20">Visual Art</span>
        <h2 class="text-2xl sm:text-3xl font-display font-bold text-slate-900 dark:text-white mt-2">Graphic & Poster Designs</h2>
        <p class="text-sm sm:text-base text-slate-600 dark:text-slate-400 mt-1">Click any poster image below to open in the high-res Lightbox modal.</p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- 6 Graphic Cards using graphic1.jpg to graphic6.jpg -->
        <div class="graphic-item cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all" data-title="Cyberpunk Cinematic Poster" data-src="graphic1.jpg">
          <div class="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-950">
            <img src="graphic1.jpg" alt="Poster 1" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-4"><h3 class="font-bold text-sm">Cyberpunk Cinematic Poster</h3></div>
        </div>

        <div class="graphic-item cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all" data-title="Atmospheric Minimalist Film Title" data-src="graphic2.jpg">
          <div class="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-950">
            <img src="graphic2.jpg" alt="Poster 2" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-4"><h3 class="font-bold text-sm">Atmospheric Minimalist Film Title</h3></div>
        </div>

        <div class="graphic-item cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all" data-title="Electronic Music Visual Cover" data-src="graphic3.jpg">
          <div class="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-950">
            <img src="graphic3.jpg" alt="Poster 3" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-4"><h3 class="font-bold text-sm">Electronic Music Visual Cover</h3></div>
        </div>

        <div class="graphic-item cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all" data-title="Dramatic Documentary Portrait" data-src="graphic4.jpg">
          <div class="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-950">
            <img src="graphic4.jpg" alt="Poster 4" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-4"><h3 class="font-bold text-sm">Dramatic Documentary Portrait</h3></div>
        </div>

        <div class="graphic-item cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all" data-title="Dynamic Tournament & Motion Key" data-src="graphic5.jpg">
          <div class="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-950">
            <img src="graphic5.jpg" alt="Poster 5" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-4"><h3 class="font-bold text-sm">Dynamic Tournament & Motion Key</h3></div>
        </div>

        <div class="graphic-item cursor-pointer rounded-2xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 hover:shadow-xl transition-all" data-title="Luxury Editorial Video Visual" data-src="graphic6.jpg">
          <div class="aspect-[3/4] overflow-hidden bg-slate-100 dark:bg-slate-950">
            <img src="graphic6.jpg" alt="Poster 6" class="w-full h-full object-cover hover:scale-105 transition-transform duration-500">
          </div>
          <div class="p-4"><h3 class="font-bold text-sm">Luxury Editorial Video Visual</h3></div>
        </div>
      </div>
    </div>
  </section>

  <!-- E. Detailed About Me (Bio) Section -->
  <section id="about" class="py-14 border-t border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
    <div class="max-w-5xl mx-auto px-4 sm:px-6">
      <div class="p-6 sm:p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-md">
        <div class="flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div class="w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden ring-4 ring-slate-100 dark:ring-slate-800 shrink-0">
            <img src="profile.jpg" alt="Naeim Visual Bio" class="w-full h-full object-cover">
          </div>
          <div>
            <span class="text-xs font-semibold px-2.5 py-0.5 rounded bg-amber-500/10 text-amber-500">Dedicated & Passionate</span>
            <h2 class="text-2xl sm:text-3xl font-display font-bold mt-2 mb-3">About Me & The Craft</h2>
            <blockquote class="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed italic border-l-4 border-amber-500 pl-4 py-1 bg-amber-500/5 rounded-r-xl">
              "I am a passionate video editor dedicated to the art of visual storytelling. Over the past several months, I have immersed myself in learning the ins and outs of editing—practicing daily, refining my pacing, and perfecting my sound design. While I don't claim decades of industry experience, I bring fresh creativity, high-energy dedication, and a modern aesthetic to every frame. Let's create something memorable together."
            </blockquote>
            <p class="mt-4 text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Every cut is tuned with intention—from sound effect foley layers to color grading contrast curves.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- F. Get in Touch Section -->
  <section id="contact" class="py-16 border-t border-slate-200 dark:border-slate-800">
    <div class="max-w-5xl mx-auto px-4 sm:px-6 text-center">
      <span class="px-3 py-1 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-500 border border-amber-500/20">Open for Collaborations</span>
      <h2 class="text-3xl sm:text-4xl font-display font-extrabold mt-3">Let's Create Something Memorable</h2>
      <p class="text-slate-600 dark:text-slate-400 mt-2 max-w-xl mx-auto text-sm sm:text-base">
        Send me an email, reach out on WhatsApp, or connect directly for projects and video editing inquiries.
      </p>

      <div class="mt-8 flex flex-wrap items-center justify-center gap-4">
        <a href="mailto:mdnaeim997@gmail.com" class="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 text-white font-bold text-sm shadow-md hover:shadow-lg transition-all">
          Email: mdnaeim997@gmail.com
        </a>
        <a href="https://wa.me/?text=Hi%20Naeim,%20I'd%20love%20to%20collaborate%20on%20a%20video%20editing%20project!" target="_blank" class="px-6 py-3 rounded-xl border border-emerald-500/30 bg-emerald-500/10 text-emerald-500 font-semibold text-sm hover:bg-emerald-500/20 transition-all">
          Chat on WhatsApp
        </a>
        <a href="https://www.youtube.com/@MdNaeim-u8x" target="_blank" rel="noopener noreferrer" class="px-6 py-3 rounded-xl border border-rose-500/30 bg-rose-500/10 text-rose-500 font-semibold text-sm hover:bg-rose-500/20 transition-all">
          YouTube: @MdNaeim-u8x
        </a>
      </div>

      <div class="mt-14 pt-6 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-500">
        © 2026 Naeim Visual • Video Editor Portfolio
      </div>
    </div>
  </section>

  <!-- Lightbox Modal -->
  <div id="lightboxModal" class="fixed inset-0 z-50 bg-black/90 backdrop-blur-md hidden items-center justify-center p-4">
    <button id="lightboxClose" class="absolute top-4 right-4 p-3 rounded-full bg-white/10 hover:bg-white/20 text-white text-xl">✕</button>
    <div class="relative max-w-4xl max-h-[90vh] flex flex-col items-center">
      <img id="lightboxImg" src="" alt="Enlarged Poster" class="max-w-full max-h-[75vh] object-contain rounded-xl border border-white/20">
      <div id="lightboxCaption" class="mt-3 px-6 py-2 rounded-lg bg-slate-900/90 text-white text-sm font-semibold border border-white/10"></div>
    </div>
  </div>

  <!-- Vanilla JavaScript for Theme Toggle and Lightbox -->
  <script>
    // Theme Toggle
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const htmlElem = document.documentElement;

    function updateThemeUI(isDark) {
      if (isDark) {
        htmlElem.classList.add('dark');
        themeIcon.textContent = '☀️';
      } else {
        htmlElem.classList.remove('dark');
        themeIcon.textContent = '🌙';
      }
    }

    // Default to dark mode
    let isDark = localStorage.getItem('theme') !== 'light';
    updateThemeUI(isDark);

    themeToggleBtn.addEventListener('click', () => {
      isDark = !htmlElem.classList.contains('dark');
      localStorage.setItem('theme', isDark ? 'dark' : 'light');
      updateThemeUI(isDark);
    });

    // Lightbox Modal
    const modal = document.getElementById('lightboxModal');
    const modalImg = document.getElementById('lightboxImg');
    const modalCaption = document.getElementById('lightboxCaption');
    const modalClose = document.getElementById('lightboxClose');

    document.querySelectorAll('.graphic-item').forEach(item => {
      item.addEventListener('click', () => {
        const src = item.getAttribute('data-src');
        const title = item.getAttribute('data-title');
        modalImg.src = src;
        modalCaption.textContent = title;
        modal.classList.remove('hidden');
        modal.classList.add('flex');
      });
    });

    function closeModal() {
      modal.classList.add('hidden');
      modal.classList.remove('flex');
    }

    modalClose.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal();
    });
  </script>
</body>
</html>`;

  const handleCopy = () => {
    navigator.clipboard.writeText(singleFileHtmlCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    const blob = new Blob([singleFileHtmlCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'index.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div
      id="export-html-modal-backdrop"
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="relative w-full max-w-3xl max-h-[85vh] flex flex-col rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl text-white overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Code className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-display font-bold">Complete Standalone Single-File HTML</h3>
              <p className="text-xs text-slate-400">Tailwind CSS (CDN) + Vanilla JavaScript theme toggle & Lightbox</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Code Snippet Preview */}
        <div className="p-4 flex-1 overflow-auto bg-slate-950 font-mono text-xs text-slate-300">
          <pre className="whitespace-pre-wrap">{singleFileHtmlCode}</pre>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-between gap-3 bg-slate-900">
          <span className="text-xs text-slate-400 hidden sm:inline">
            Self-contained file ready for GitHub Pages or Netlify
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={handleDownload}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-xs font-semibold transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download HTML</span>
            </button>
            <button
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied to Clipboard!' : 'Copy HTML Code'}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
