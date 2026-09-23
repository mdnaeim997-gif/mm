import { GraphicItem, VideoItem, MarketingItem, SiteSettings, CommentItem } from '../types';
import { PORTFOLIO_OWNER, PORTFOLIO_VIDEOS } from '../data';

const DB_NAME = 'naeim_portfolio_uploads_db';
const DB_VERSION = 2;
const STORE_GRAPHICS = 'custom_graphics';
const STORE_VIDEOS = 'custom_videos';
const STORE_MARKETING = 'custom_marketing';

export const DEFAULT_SITE_SETTINGS: SiteSettings = {
  adminEmail: 'mdnaeim997@gmail.com',
  adminPassword: 'naeimpassword2026',
  profileName: 'Naeim Visual',
  profileTitle: 'Video Editor • Graphic Designer • Meta Marketer',
  profileBio: 'Cinematic storytelling, sharp pacing, premium visual aesthetics, and high-converting Meta ad creatives.',
  profileAvatar: 'profile.jpg',
  showLikesAndComments: true,
  socialLinks: {
    behance: PORTFOLIO_OWNER.behanceUrl,
    whatsapp: PORTFOLIO_OWNER.whatsappUrl,
    facebook: PORTFOLIO_OWNER.facebookUrl,
    youtube: PORTFOLIO_OWNER.youtubeChannel,
    email: PORTFOLIO_OWNER.email,
  }
};

const SETTINGS_STORAGE_KEY = 'naeim_site_settings_v1';
const ADMIN_SESSION_KEY = 'naeim_admin_authenticated_session';

/**
 * Format any WhatsApp number or link into a valid wa.me URL
 */
export function formatWhatsAppLink(input: string): string {
  if (!input) return '';
  const trimmed = input.trim();
  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    return trimmed;
  }
  // Strip non-digits
  let digits = trimmed.replace(/\D/g, '');
  // If starts with 01 (standard Bangladesh number), prepend 88
  if (digits.startsWith('01') && digits.length === 11) {
    digits = '88' + digits;
  }
  return `https://wa.me/${digits}`;
}

export function getSiteSettings(): SiteSettings {
  if (typeof window === 'undefined') return DEFAULT_SITE_SETTINGS;
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SITE_SETTINGS;
    const parsed = JSON.parse(raw);
    const resolvedName = (parsed.profileName === 'Md. Naeimul Islam' || !parsed.profileName)
      ? 'Naeim Visual'
      : parsed.profileName;
    const resolvedSocials = {
      ...DEFAULT_SITE_SETTINGS.socialLinks,
      ...(parsed.socialLinks || {})
    };
    if (resolvedSocials.behance === 'https://www.behance.net/mdnaeim997' || !resolvedSocials.behance) {
      resolvedSocials.behance = 'https://www.behance.net/mdnaeim26';
    }
    return {
      ...DEFAULT_SITE_SETTINGS,
      ...parsed,
      profileName: resolvedName,
      socialLinks: resolvedSocials
    };
  } catch (e) {
    return DEFAULT_SITE_SETTINGS;
  }
}

export function saveSiteSettings(settings: SiteSettings): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(settings));
}

export function isAdminAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem(ADMIN_SESSION_KEY) === 'true';
}

export function loginAdmin(emailInput: string, passwordInput: string): { success: boolean; message: string } {
  const settings = getSiteSettings();
  const cleanEmail = emailInput.trim().toLowerCase();
  const targetEmail = settings.adminEmail.trim().toLowerCase();

  if (cleanEmail !== targetEmail) {
    return { success: false, message: 'Invalid Admin Gmail address.' };
  }

  if (passwordInput !== settings.adminPassword) {
    return { success: false, message: 'Invalid Admin Password.' };
  }

  // Persist session across restarts
  localStorage.setItem(ADMIN_SESSION_KEY, 'true');
  return { success: true, message: 'Login successful' };
}

export function logoutAdmin(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ADMIN_SESSION_KEY);
}

export function updateAdminPassword(newPassword: string): void {
  const current = getSiteSettings();
  current.adminPassword = newPassword;
  saveSiteSettings(current);
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    if (typeof window === 'undefined' || !window.indexedDB) {
      reject(new Error('IndexedDB is not supported'));
      return;
    }

    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;
      if (!db.objectStoreNames.contains(STORE_GRAPHICS)) {
        db.createObjectStore(STORE_GRAPHICS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_VIDEOS)) {
        db.createObjectStore(STORE_VIDEOS, { keyPath: 'id' });
      }
      if (!db.objectStoreNames.contains(STORE_MARKETING)) {
        db.createObjectStore(STORE_MARKETING, { keyPath: 'id' });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

// Fallback to localStorage
const LOCAL_STORAGE_GRAPHICS_KEY = 'naeim_portfolio_custom_graphics';
const LOCAL_STORAGE_VIDEOS_KEY = 'naeim_portfolio_custom_videos';
const LOCAL_STORAGE_MARKETING_KEY = 'naeim_portfolio_custom_marketing';

// Load Graphics
export async function getCustomGraphics(): Promise<GraphicItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_GRAPHICS, 'readonly');
      const store = transaction.objectStore(STORE_GRAPHICS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => {
        resolve(getFallbackGraphics());
      };
    });
  } catch {
    return getFallbackGraphics();
  }
}

function getFallbackGraphics(): GraphicItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_GRAPHICS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save Graphic
export async function saveCustomGraphic(item: GraphicItem): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_GRAPHICS, 'readwrite');
      const store = transaction.objectStore(STORE_GRAPHICS);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const list = getFallbackGraphics();
    const index = list.findIndex((g) => g.id === item.id);
    if (index >= 0) list[index] = item;
    else list.unshift(item);
    try {
      localStorage.setItem(LOCAL_STORAGE_GRAPHICS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage limit reached for graphic', e);
    }
  }
}

// Delete Graphic
export async function deleteCustomGraphic(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_GRAPHICS, 'readwrite');
      const store = transaction.objectStore(STORE_GRAPHICS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const list = getFallbackGraphics().filter((g) => g.id !== id);
    localStorage.setItem(LOCAL_STORAGE_GRAPHICS_KEY, JSON.stringify(list));
  }
}

const SEED_VIDEOS_KEY = 'naeim_portfolio_videos_seeded_v3';

// Load Videos
export async function getCustomVideos(): Promise<VideoItem[]> {
  try {
    const db = await openDB();
    const items: VideoItem[] = await new Promise((resolve) => {
      const transaction = db.transaction(STORE_VIDEOS, 'readonly');
      const store = transaction.objectStore(STORE_VIDEOS);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => {
        resolve(getFallbackVideos());
      };
    });

    const isSeeded = typeof window !== 'undefined' ? localStorage.getItem(SEED_VIDEOS_KEY) : null;
    if (!isSeeded && items.length === 0) {
      // Seed default videos into IndexedDB so user can freely edit or delete them
      for (const v of PORTFOLIO_VIDEOS) {
        await saveCustomVideo(v);
      }
      if (typeof window !== 'undefined') {
        localStorage.setItem(SEED_VIDEOS_KEY, 'true');
      }
      return PORTFOLIO_VIDEOS;
    }
    return items;
  } catch {
    const fallback = getFallbackVideos();
    const isSeeded = typeof window !== 'undefined' ? localStorage.getItem(SEED_VIDEOS_KEY) : null;
    if (!isSeeded && fallback.length === 0) {
      if (typeof window !== 'undefined') {
        localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(PORTFOLIO_VIDEOS));
        localStorage.setItem(SEED_VIDEOS_KEY, 'true');
      }
      return PORTFOLIO_VIDEOS;
    }
    return fallback;
  }
}

function getFallbackVideos(): VideoItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_VIDEOS_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save Video
export async function saveCustomVideo(item: VideoItem): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_VIDEOS, 'readwrite');
      const store = transaction.objectStore(STORE_VIDEOS);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const list = getFallbackVideos();
    const index = list.findIndex((v) => v.id === item.id);
    if (index >= 0) list[index] = item;
    else list.unshift(item);
    try {
      localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage limit reached for video', e);
    }
  }
}

// Delete Video
export async function deleteCustomVideo(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_VIDEOS, 'readwrite');
      const store = transaction.objectStore(STORE_VIDEOS);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const list = getFallbackVideos().filter((v) => v.id !== id);
    localStorage.setItem(LOCAL_STORAGE_VIDEOS_KEY, JSON.stringify(list));
  }
}

/**
 * Re-seed / restore the default 6 curated videos
 */
export async function resetDefaultVideos(): Promise<VideoItem[]> {
  for (const v of PORTFOLIO_VIDEOS) {
    await saveCustomVideo(v);
  }
  if (typeof window !== 'undefined') {
    localStorage.setItem(SEED_VIDEOS_KEY, 'true');
  }
  return await getCustomVideos();
}

// Load Marketing Projects
export async function getCustomMarketing(): Promise<MarketingItem[]> {
  try {
    const db = await openDB();
    return new Promise((resolve) => {
      const transaction = db.transaction(STORE_MARKETING, 'readonly');
      const store = transaction.objectStore(STORE_MARKETING);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => {
        resolve(getFallbackMarketing());
      };
    });
  } catch {
    return getFallbackMarketing();
  }
}

function getFallbackMarketing(): MarketingItem[] {
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_MARKETING_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
}

// Save Marketing Project
export async function saveCustomMarketing(item: MarketingItem): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_MARKETING, 'readwrite');
      const store = transaction.objectStore(STORE_MARKETING);
      const request = store.put(item);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const list = getFallbackMarketing();
    const index = list.findIndex((m) => m.id === item.id);
    if (index >= 0) list[index] = item;
    else list.unshift(item);
    try {
      localStorage.setItem(LOCAL_STORAGE_MARKETING_KEY, JSON.stringify(list));
    } catch (e) {
      console.warn('LocalStorage limit reached for marketing', e);
    }
  }
}

// Delete Marketing Project
export async function deleteCustomMarketing(id: string): Promise<void> {
  try {
    const db = await openDB();
    await new Promise<void>((resolve, reject) => {
      const transaction = db.transaction(STORE_MARKETING, 'readwrite');
      const store = transaction.objectStore(STORE_MARKETING);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  } catch {
    const list = getFallbackMarketing().filter((m) => m.id !== id);
    localStorage.setItem(LOCAL_STORAGE_MARKETING_KEY, JSON.stringify(list));
  }
}

/**
 * Generate a high-resolution 808x636 SVG Poster thumbnail for Facebook videos
 * so when user enters a Facebook link, the preview and portfolio immediately
 * display an eye-catching card even without a manual image upload.
 */
export function generateFacebookVideoThumbnail(title: string): string {
  const safeTitle = (title || 'Facebook Video Project')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 808 636" width="808" height="636">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0b1329" />
      <stop offset="50%" stop-color="#101d3b" />
      <stop offset="100%" stop-color="#082f49" />
    </linearGradient>
    <linearGradient id="glow" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1877F2" stop-opacity="0.45" />
      <stop offset="100%" stop-color="#0284c7" stop-opacity="0" />
    </linearGradient>
    <linearGradient id="playBtn" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1877F2" />
      <stop offset="100%" stop-color="#0284c7" />
    </linearGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="12" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="808" height="636" fill="url(#bg)" />
  <circle cx="404" cy="318" r="320" fill="url(#glow)" />
  
  <!-- Subtle Grid Pattern -->
  <g stroke="#ffffff" stroke-opacity="0.05" stroke-width="1">
    <line x1="0" y1="159" x2="808" y2="159" />
    <line x1="0" y1="318" x2="808" y2="318" />
    <line x1="0" y1="477" x2="808" y2="477" />
    <line x1="202" y1="0" x2="202" y2="636" />
    <line x1="404" y1="0" x2="404" y2="636" />
    <line x1="606" y1="0" x2="606" y2="636" />
  </g>

  <!-- Facebook Badge at Top Left -->
  <g transform="translate(48, 48)">
    <rect width="180" height="42" rx="21" fill="#1877F2" fill-opacity="0.25" stroke="#1877F2" stroke-width="1.5" />
    <circle cx="21" cy="21" r="14" fill="#1877F2" />
    <path d="M23.5 21h-2v7h-3v-7h-1.5v-2.5h1.5v-1.6c0-1.8 1.1-2.9 2.8-2.9 0.8 0 1.5 0.06 1.7 0.1v2h-1.2c-0.9 0-1.1 0.4-1.1 1v1.4h2.2l-0.4 2.5z" fill="#ffffff" />
    <text x="44" y="26" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="700" letter-spacing="0.5">FACEBOOK VIDEO</text>
  </g>

  <!-- Big Central Play Button -->
  <g transform="translate(404, 300)" filter="url(#shadow)">
    <!-- Outer Ring -->
    <circle cx="0" cy="0" r="56" fill="#1877F2" fill-opacity="0.25" stroke="#38bdf8" stroke-width="2.5" />
    <!-- Inner Solid Circle -->
    <circle cx="0" cy="0" r="42" fill="url(#playBtn)" />
    <!-- Play Triangle -->
    <polygon points="-8,-15 17,0 -8,15" fill="#ffffff" />
  </g>

  <!-- Bottom Dark Gradient for Text Legibility -->
  <rect x="0" y="440" width="808" height="196" fill="#000000" fill-opacity="0.75" />

  <!-- Video Title -->
  <text x="404" y="520" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800">
    ${safeTitle.length > 40 ? safeTitle.slice(0, 38) + '...' : safeTitle}
  </text>
  <text x="404" y="560" text-anchor="middle" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="16" font-weight="500">
    Watch on Facebook • High-Quality Video Cut
  </text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Generates an ultra-crisp 808x636 SVG thumbnail placeholder for Behance project links
 */
export function generateBehanceThumbnail(title: string, author?: string): string {
  const safeTitle = (title || 'Behance Graphic Project').replace(/[<>&"']/g, '');
  const safeAuthor = (author || 'Naeim Visual').replace(/[<>&"']/g, '');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 808 636" width="808" height="636">
  <defs>
    <linearGradient id="behanceBg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#001844" />
      <stop offset="40%" stop-color="#002d72" />
      <stop offset="100%" stop-color="#050a14" />
    </linearGradient>
    <linearGradient id="behanceBadge" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0057ff" />
      <stop offset="100%" stop-color="#003bb5" />
    </linearGradient>
    <filter id="behanceGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="8" stdDeviation="16" flood-color="#0057ff" flood-opacity="0.45" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="808" height="636" fill="url(#behanceBg)" />

  <!-- Abstract Graphic Rings -->
  <circle cx="700" cy="120" r="260" fill="none" stroke="#0057ff" stroke-opacity="0.12" stroke-width="2" />
  <circle cx="700" cy="120" r="180" fill="none" stroke="#38bdf8" stroke-opacity="0.1" stroke-width="1.5" />
  <circle cx="100" cy="540" r="240" fill="none" stroke="#10b981" stroke-opacity="0.08" stroke-width="1.5" />

  <!-- Top Badge: Behance Portfolio Project -->
  <g transform="translate(48, 48)">
    <rect width="190" height="42" rx="21" fill="#0057ff" fill-opacity="0.25" stroke="#0057ff" stroke-width="1.5" />
    <circle cx="21" cy="21" r="14" fill="#0057ff" />
    <path d="M18.5 17.5h-3v7h3c1 0 1.8-.7 1.8-1.8 0-.6-.3-1.1-.8-1.4.3-.2.6-.7.6-1.3 0-1.1-.7-1.8-1.6-1.8zm-1.8 2.6v-1.4h1.5c.4 0 .7.3.7.7s-.3.7-.7.7h-1.5zm1.6 3.2h-1.6v-1.7h1.6c.5 0 .8.4.8.8 0 .5-.3.9-.8.9zm6.4-1.2h-3c0 .8.5 1.3 1.3 1.3.5 0 .9-.2 1.1-.5l1 .6c-.5.8-1.2 1.1-2.1 1.1-1.6 0-2.6-1.1-2.6-2.6s1.1-2.6 2.6-2.6c1.6 0 2.4 1.1 2.4 2.4v.3zm-1.2-.8c0-.6-.4-1.1-1.2-1.1s-1.2.5-1.2 1.1h2.4zm-2.8-3.1h2.6v.7h-2.6z" fill="#ffffff" />
    <text x="44" y="26" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="12" font-weight="700" letter-spacing="0.5">BEHANCE PROJECT</text>
  </g>

  <!-- Big Central Behance Emblem -->
  <g transform="translate(404, 280)" filter="url(#behanceGlow)">
    <circle cx="0" cy="0" r="56" fill="url(#behanceBadge)" stroke="#38bdf8" stroke-width="2" />
    <!-- Big 'Bē' Glyph -->
    <path d="M-22 -14h10c4 0 7 2.5 7 6 0 2.2-1.2 4-3 5 2.6 1 4 3.2 4 6.2 0 4.2-3.3 6.8-7.8 6.8h-10.2v-24zm5.5 8.5h4c1.8 0 3-1 3-2.5s-1.2-2.5-3-2.5h-4v5zm0 10.5h4.6c2.2 0 3.5-1.2 3.5-3s-1.3-3-3.5-3h-4.6v6zm22-3.5h-9c0 2.8 1.8 4.6 4.6 4.6 1.8 0 3.2-.8 3.8-1.8l3.6 2c-1.6 2.6-4.2 3.8-7.4 3.8-5.6 0-9.2-3.8-9.2-9.2s3.8-9.2 9.2-9.2c5.6 0 8.4 3.8 8.4 8.2v1.6zm-4.2-2.8c0-2-1.4-3.8-4.2-3.8-2.6 0-4.2 1.8-4.2 3.8h8.4zm-9.8-11.2h9.2v2.4h-9.2z" fill="#ffffff" />
  </g>

  <!-- Bottom Dark Gradient for Text Legibility -->
  <rect x="0" y="430" width="808" height="206" fill="#000000" fill-opacity="0.82" />

  <!-- Graphic Project Title -->
  <text x="404" y="515" text-anchor="middle" fill="#ffffff" font-family="system-ui, -apple-system, sans-serif" font-size="28" font-weight="800">
    ${safeTitle.length > 42 ? safeTitle.slice(0, 40) + '...' : safeTitle}
  </text>
  <text x="404" y="555" text-anchor="middle" fill="#38bdf8" font-family="system-ui, -apple-system, sans-serif" font-size="15" font-weight="600">
    Designed by ${safeAuthor} • View Full Project on Behance
  </text>
  <text x="404" y="585" text-anchor="middle" fill="#94a3b8" font-family="system-ui, -apple-system, sans-serif" font-size="13" font-weight="500">
    High-Resolution Artwork • Click to Open Case Study
  </text>
</svg>`;

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

/**
 * Attempts to fetch Behance project metadata (Title, Thumbnail, Author) from Behance or oEmbed
 */
export async function fetchBehanceMetadata(url: string): Promise<{ title?: string; author?: string; thumbnail?: string } | null> {
  const trimmed = url.trim();
  if (!trimmed || (!trimmed.includes('behance.net') && !trimmed.includes('be.net'))) {
    return null;
  }

  // Auto infer clean title from URL slug (e.g. behance.net/gallery/12345/Brand-Identity-Design)
  let inferredTitle = '';
  try {
    const parts = trimmed.split('?')[0].split('#')[0].split('/');
    const lastPart = parts.filter(Boolean).pop();
    if (lastPart && isNaN(Number(lastPart))) {
      inferredTitle = decodeURIComponent(lastPart)
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, (c) => c.toUpperCase());
    }
  } catch {
    // Ignore URL parse error
  }

  try {
    // Try public oEmbed endpoint
    const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(trimmed)}`;
    const res = await fetch(oembedUrl);
    if (res.ok) {
      const data = await res.json();
      if (data) {
        return {
          title: data.title || inferredTitle || 'Behance Graphic Design Showcase',
          author: data.author_name || 'Naeim Visual',
          thumbnail: data.thumbnail_url || undefined
        };
      }
    }
  } catch (err) {
    console.warn('Could not auto-fetch Behance metadata:', err);
  }

  return {
    title: inferredTitle || 'Behance Graphic Showcase',
    author: 'Naeim Visual'
  };
}

/**
 * Attempts to fetch video title and details from YouTube/Facebook oEmbed endpoints with fallback
 */
export async function fetchVideoMetadata(url: string): Promise<{ title?: string; author?: string } | null> {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    // YouTube oEmbed (CORS-friendly public JSONP/JSON endpoint)
    if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
      const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(trimmed)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          return { title: data.title, author: data.author_name };
        }
      }
    }

    // Facebook video or post oEmbed via noembed or direct fallback
    if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch') || trimmed.includes('fb.com')) {
      const oembedUrl = `https://noembed.com/embed?url=${encodeURIComponent(trimmed)}`;
      const res = await fetch(oembedUrl);
      if (res.ok) {
        const data = await res.json();
        if (data && data.title) {
          return { title: data.title, author: data.author_name };
        }
      }
    }
  } catch (err) {
    console.warn('Could not auto-fetch video metadata:', err);
  }

  return null;
}

/**
 * Parses a video link (YouTube or Facebook) and returns details
 */
export function parseVideoLink(url: string, title?: string): {
  platform: 'youtube' | 'facebook' | 'direct';
  id?: string;
  thumbnail?: string;
  cleanUrl: string;
} {
  const trimmed = url.trim();

  // YouTube
  if (trimmed.includes('youtube.com') || trimmed.includes('youtu.be')) {
    let videoId = '';
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = trimmed.match(regExp);
    if (match && match[2].length === 11) {
      videoId = match[2];
    }
    return {
      platform: 'youtube',
      id: videoId || undefined,
      thumbnail: videoId ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg` : undefined,
      cleanUrl: trimmed
    };
  }

  // Facebook
  if (trimmed.includes('facebook.com') || trimmed.includes('fb.watch') || trimmed.includes('fb.com')) {
    return {
      platform: 'facebook',
      thumbnail: generateFacebookVideoThumbnail(title || 'Facebook Video Project'),
      cleanUrl: trimmed
    };
  }

  return {
    platform: 'direct',
    cleanUrl: trimmed
  };
}

export async function optimizeImageFile(file: File, maxWidth = 1600, quality = 0.85): Promise<string> {
  const res = await processImageFile(file, maxWidth, maxWidth, quality);
  return res.dataUrl;
}

/**
 * Optimize an image file (if needed) to avoid unnecessarily huge megapixel images
 * that could freeze mobile browsers.
 */
export function processImageFile(file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.88): Promise<{ dataUrl: string; dimensions: string }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;
        const originalDimensions = `${width} × ${height}`;

        // If it's already a sensible size, return as is
        if (width <= maxWidth && height <= maxHeight && file.size < 2 * 1024 * 1024) {
          resolve({
            dataUrl: e.target?.result as string,
            dimensions: originalDimensions
          });
          return;
        }

        // Calculate aspect ratio scaling
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve({
            dataUrl: e.target?.result as string,
            dimensions: originalDimensions
          });
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL(file.type === 'image/png' ? 'image/png' : 'image/jpeg', quality);
        resolve({
          dataUrl,
          dimensions: `${width} × ${height}`
        });
      };
      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

export interface ProjectCommentEntry {
  projectId: string;
  projectType: 'video' | 'graphic' | 'marketing';
  projectTitle: string;
  projectThumbnail?: string;
  comment: CommentItem;
}

/**
 * Add a comment to any project item and persist it in storage
 */
export async function addProjectComment(
  projectId: string,
  projectType: 'video' | 'graphic' | 'marketing',
  comment: CommentItem
): Promise<void> {
  if (projectType === 'video') {
    const videos = await getCustomVideos();
    const video = videos.find((v) => v.id === projectId);
    if (video) {
      video.comments = [comment, ...(video.comments || [])];
      await saveCustomVideo(video);
    }
  } else if (projectType === 'graphic') {
    const graphics = await getCustomGraphics();
    const graphic = graphics.find((g) => g.id === projectId);
    if (graphic) {
      graphic.comments = [comment, ...(graphic.comments || [])];
      await saveCustomGraphic(graphic);
    }
  } else if (projectType === 'marketing') {
    const marketings = await getCustomMarketing();
    const item = marketings.find((m) => m.id === projectId);
    if (item) {
      item.comments = [comment, ...(item.comments || [])];
      await saveCustomMarketing(item);
    }
  }
}

/**
 * Delete a comment from a project item
 */
export async function deleteProjectComment(
  projectId: string,
  projectType: 'video' | 'graphic' | 'marketing',
  commentId: string
): Promise<void> {
  if (projectType === 'video') {
    const videos = await getCustomVideos();
    const video = videos.find((v) => v.id === projectId);
    if (video && video.comments) {
      video.comments = video.comments.filter((c) => c.id !== commentId);
      await saveCustomVideo(video);
    }
  } else if (projectType === 'graphic') {
    const graphics = await getCustomGraphics();
    const graphic = graphics.find((g) => g.id === projectId);
    if (graphic && graphic.comments) {
      graphic.comments = graphic.comments.filter((c) => c.id !== commentId);
      await saveCustomGraphic(graphic);
    }
  } else if (projectType === 'marketing') {
    const marketings = await getCustomMarketing();
    const item = marketings.find((m) => m.id === projectId);
    if (item && item.comments) {
      item.comments = item.comments.filter((c) => c.id !== commentId);
      await saveCustomMarketing(item);
    }
  }
}

/**
 * Retrieve all comments across all projects for the admin comments feed
 */
export async function getAllProjectComments(): Promise<ProjectCommentEntry[]> {
  const [videos, graphics, marketings] = await Promise.all([
    getCustomVideos(),
    getCustomGraphics(),
    getCustomMarketing()
  ]);

  const all: ProjectCommentEntry[] = [];

  videos.forEach((v) => {
    (v.comments || []).forEach((c) => {
      all.push({
        projectId: v.id,
        projectType: 'video',
        projectTitle: v.title,
        projectThumbnail: v.thumbnailUrl || (v.youtubeId ? `https://img.youtube.com/vi/${v.youtubeId}/hqdefault.jpg` : undefined),
        comment: c
      });
    });
  });

  graphics.forEach((g) => {
    (g.comments || []).forEach((c) => {
      all.push({
        projectId: g.id,
        projectType: 'graphic',
        projectTitle: g.title,
        projectThumbnail: (g.images && g.images.length > 0 ? g.images[g.thumbnailIndex || 0] : g.filename),
        comment: c
      });
    });
  });

  marketings.forEach((m) => {
    (m.comments || []).forEach((c) => {
      all.push({
        projectId: m.id,
        projectType: 'marketing',
        projectTitle: m.title,
        projectThumbnail: (m.images && m.images.length > 0 ? m.images[0] : m.thumbnailUrl),
        comment: c
      });
    });
  });

  return all;
}
