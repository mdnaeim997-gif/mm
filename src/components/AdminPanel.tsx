import React, { useState, useEffect } from 'react';
import {
  Upload, Film, Palette, Megaphone, Eye, CheckCircle2, AlertCircle,
  Trash2, ExternalLink, Image as ImageIcon, Link as LinkIcon,
  Layers, Plus, Sparkles, X, Settings as SettingsIcon, Lock,
  KeyRound, Shield, LogOut, User, MessageCircle, Heart, Check, RefreshCw,
  Edit3
} from 'lucide-react';
import { GraphicItem, VideoItem, MarketingItem, SiteSettings, ProjectCategory } from '../types';
import {
  parseVideoLink, generateFacebookVideoThumbnail, generateBehanceThumbnail, fetchBehanceMetadata,
  optimizeImageFile, getSiteSettings, saveSiteSettings,
  isAdminAuthenticated, loginAdmin, logoutAdmin, updateAdminPassword,
  formatWhatsAppLink, fetchVideoMetadata
} from '../utils/storage';
import { EditProjectModal } from './EditProjectModal';
import { AdminCommentsFeed } from './AdminCommentsFeed';

interface AdminPanelProps {
  onBackToPublic: () => void;
  onSaveVideo: (video: VideoItem) => void;
  onSaveGraphic: (graphic: GraphicItem) => void;
  onSaveMarketing: (marketing: MarketingItem) => void;
  customVideos: VideoItem[];
  customGraphics: GraphicItem[];
  customMarketing: MarketingItem[];
  onDeleteVideo: (id: string) => void;
  onDeleteGraphic: (id: string) => void;
  onDeleteMarketing: (id: string) => void;
  onSettingsUpdated?: (settings: SiteSettings) => void;
  onResetDefaultVideos?: () => void;
  initialTab?: 'upload' | 'manage' | 'settings';
  initialCategory?: ProjectCategory;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  onBackToPublic,
  onSaveVideo,
  onSaveGraphic,
  onSaveMarketing,
  customVideos,
  customGraphics,
  customMarketing,
  onDeleteVideo,
  onDeleteGraphic,
  onDeleteMarketing,
  onSettingsUpdated,
  onResetDefaultVideos,
  initialTab = 'upload',
  initialCategory = 'Video Editing'
}) => {
  // Authentication state
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState('mdnaeim997@gmail.com');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Settings state
  const [settings, setSettings] = useState<SiteSettings>(getSiteSettings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState<string | null>(null);

  // New password form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState(false);
  const [passwordError, setPasswordError] = useState<string | null>(null);

  // Admin active navigation tab: 'upload' | 'manage' | 'settings'
  const [adminTab, setAdminTab] = useState<'upload' | 'manage' | 'settings'>(initialTab);

  // Category Selector: Exactly the 3 categories requested:
  // 1. ভিডিও এডিটিং (Video Editing)
  // 2. গ্রাফিক্স ডিজাইন (Graphics Design)
  // 3. মেটা মার্কেটিং (Meta Marketing)
  const [selectedCategory, setSelectedCategory] = useState<ProjectCategory>(initialCategory);

  // Sync initialTab and initialCategory props if changed externally
  useEffect(() => {
    if (initialTab) setAdminTab(initialTab);
  }, [initialTab]);

  useEffect(() => {
    if (initialCategory) setSelectedCategory(initialCategory);
  }, [initialCategory]);

  // Edit states for modals
  const [editingVideo, setEditingVideo] = useState<VideoItem | null>(null);
  const [editingGraphic, setEditingGraphic] = useState<GraphicItem | null>(null);
  const [editingMarketing, setEditingMarketing] = useState<MarketingItem | null>(null);

  // Global form states
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // 1. VIDEO EDITING FORM STATE
  const [videoTitle, setVideoTitle] = useState('');
  const [videoLink, setVideoLink] = useState('');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState('');
  const [detectedPlatform, setDetectedPlatform] = useState<'youtube' | 'facebook' | 'direct' | null>(null);
  const [isFetchingTitle, setIsFetchingTitle] = useState<boolean>(false);

  // 2. GRAPHICS DESIGN FORM STATE (Multi-image Behance style & Link Paste)
  const [graphicTitle, setGraphicTitle] = useState('');
  const [graphicBehanceUrl, setGraphicBehanceUrl] = useState('');
  const [graphicDescription, setGraphicDescription] = useState('');
  const [graphicImages, setGraphicImages] = useState<string[]>([]);
  const [selectedGraphicThumbnailIndex, setSelectedGraphicThumbnailIndex] = useState<number>(0);
  const [isFetchingBehance, setIsFetchingBehance] = useState<boolean>(false);

  // 3. META MARKETING FORM STATE
  const [marketingTitle, setMarketingTitle] = useState('');
  const [marketingDescription, setMarketingDescription] = useState('');
  const [marketingImages, setMarketingImages] = useState<string[]>([]);
  const [selectedMarketingThumbnailIndex, setSelectedMarketingThumbnailIndex] = useState<number>(0);
  const [marketingPlatform, setMarketingPlatform] = useState('Meta Ads');
  const [marketingRoas, setMarketingRoas] = useState('4.8×');
  const [marketingReach, setMarketingReach] = useState('250K+');
  const [marketingSales, setMarketingSales] = useState('$18,500');

  // Check authentication on mount
  useEffect(() => {
    setIsAuthenticated(isAdminAuthenticated());
  }, []);

  // Handle Login submission
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = loginAdmin(loginEmail, loginPassword);
    if (res.success) {
      setIsAuthenticated(true);
      setLoginPassword('');
    } else {
      setLoginError(res.message);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    logoutAdmin();
    setIsAuthenticated(false);
  };

  // Handle Video Title change with dynamic thumbnail update for Facebook
  const handleVideoTitleChange = (title: string) => {
    setVideoTitle(title);
    if (detectedPlatform === 'facebook' && (!videoThumbnailUrl || videoThumbnailUrl.startsWith('data:image/svg+xml'))) {
      setVideoThumbnailUrl(generateFacebookVideoThumbnail(title.trim() || 'Facebook Video'));
    }
  };

  // Handle Video link change with auto-title and auto-thumbnail
  const handleVideoLinkChange = async (url: string) => {
    setVideoLink(url);
    if (!url.trim()) {
      setDetectedPlatform(null);
      return;
    }
    const parsed = parseVideoLink(url, videoTitle);
    setDetectedPlatform(parsed.platform);
    if (parsed.platform === 'youtube' && parsed.thumbnail && (!videoThumbnailUrl || videoThumbnailUrl.startsWith('data:image/svg+xml'))) {
      setVideoThumbnailUrl(parsed.thumbnail);
    } else if (parsed.platform === 'facebook' && (!videoThumbnailUrl || videoThumbnailUrl.startsWith('data:image/svg+xml'))) {
      setVideoThumbnailUrl(parsed.thumbnail || generateFacebookVideoThumbnail(videoTitle.trim() || 'Facebook Video'));
    }

    // Auto fetch video title if user hasn't typed a custom title yet
    if (parsed.platform === 'youtube' || parsed.platform === 'facebook') {
      setIsFetchingTitle(true);
      try {
        const meta = await fetchVideoMetadata(url);
        if (meta && meta.title) {
          setVideoTitle(meta.title);
          if (parsed.platform === 'facebook') {
            setVideoThumbnailUrl(generateFacebookVideoThumbnail(meta.title));
          }
        }
      } catch (err) {
        console.warn('Metadata fetch error:', err);
      } finally {
        setIsFetchingTitle(false);
      }
    }
  };

  // Handle custom thumbnail upload for video
  const handleVideoThumbnailUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await optimizeImageFile(file, 1600, 0.88);
      setVideoThumbnailUrl(optimized);
    } catch (err) {
      console.error(err);
    }
  };

  // Submit Video Project
  const handleSubmitVideo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoTitle.trim()) {
      alert('ভিডিও এডিটিং প্রজেক্টের টাইটেল দেওয়া বাধ্যতামূলক!');
      return;
    }

    setIsSubmitting(true);
    const parsed = parseVideoLink(videoLink, videoTitle);

    const fallbackThumbnail = parsed.platform === 'facebook'
      ? generateFacebookVideoThumbnail(videoTitle.trim())
      : (parsed.thumbnail || 'graphic1.jpg');

    const newVideo: VideoItem = {
      id: `vid_${Date.now()}`,
      title: videoTitle.trim(),
      youtubeId: parsed.platform === 'youtube' ? (parsed.id || '') : '',
      facebookUrl: parsed.platform === 'facebook' ? (parsed.cleanUrl || videoLink.trim()) : undefined,
      videoUrl: parsed.platform === 'direct' ? videoLink.trim() : undefined,
      thumbnailUrl: videoThumbnailUrl || fallbackThumbnail,
      platform: parsed.platform,
      category: 'Video Editing',
      description: videoDescription.trim() || undefined,
      duration: parsed.platform === 'facebook' ? 'Facebook Video' : 'HD Video',
      likes: 0,
      comments: [],
      isCustomUpload: true,
      uploadedAt: Date.now()
    };

    onSaveVideo(newVideo);
    setIsSubmitting(false);
    setSuccessMessage('ভিডিও প্রজেক্টটি সফলভাবে লাইভ পাবলিশ করা হয়েছে! এটি পোর্টফোলিওতে সবার শীর্ষে দেখা যাচ্ছে।');
    setTimeout(() => setSuccessMessage(null), 4000);

    // Reset fields
    setVideoTitle('');
    setVideoLink('');
    setVideoThumbnailUrl('');
    setVideoDescription('');
    setDetectedPlatform(null);
  };

  // Handle Multi-Image Upload for Graphics
  const handleGraphicImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const list = Array.from(files);
    const loaded: string[] = [];

    for (const f of list) {
      try {
        const optimized = await optimizeImageFile(f, 1600, 0.88);
        loaded.push(optimized);
      } catch (err) {
        console.error(err);
      }
    }

    setGraphicImages((prev) => [...prev, ...loaded]);
  };

  // Handle Behance Project Link Paste with Auto-Fetch
  const handleBehanceUrlChange = async (url: string) => {
    setGraphicBehanceUrl(url);
    if (!url.trim()) return;

    if (url.includes('behance.net') || url.includes('be.net')) {
      setIsFetchingBehance(true);
      try {
        const meta = await fetchBehanceMetadata(url);
        if (meta) {
          // If title isn't filled by user, auto populate from Behance link
          if (!graphicTitle.trim() && meta.title) {
            setGraphicTitle(meta.title);
          }
          // If no gallery images are uploaded yet, use fetched thumbnail or generate crisp SVG
          if (graphicImages.length === 0) {
            const thumb = meta.thumbnail || generateBehanceThumbnail(meta.title || graphicTitle || 'Behance Graphic Project', meta.author);
            setGraphicImages([thumb]);
            setSelectedGraphicThumbnailIndex(0);
          }
        }
      } catch (err) {
        console.error('Error fetching Behance link:', err);
      } finally {
        setIsFetchingBehance(false);
      }
    }
  };

  // Submit Graphic Project
  const handleSubmitGraphic = (e: React.FormEvent) => {
    e.preventDefault();

    // If title is empty but Behance URL is provided, auto-infer title
    let finalTitle = graphicTitle.trim();
    if (!finalTitle && graphicBehanceUrl.trim()) {
      try {
        const parts = graphicBehanceUrl.trim().split('?')[0].split('#')[0].split('/');
        const lastPart = parts.filter(Boolean).pop();
        if (lastPart && isNaN(Number(lastPart))) {
          finalTitle = decodeURIComponent(lastPart)
            .replace(/[-_]+/g, ' ')
            .replace(/\b\w/g, (c) => c.toUpperCase());
        }
      } catch {
        // Fallback
      }
      if (!finalTitle) finalTitle = 'Behance Graphic Project';
    }

    if (!finalTitle) {
      alert('অনুগ্রহ করে প্রজেক্টের টাইটেল দিন অথবা বিহান্স প্রজেক্ট লিংক পেস্ট করুন!');
      return;
    }

    let finalImages = [...graphicImages];
    // If no image is selected but Behance URL is present, generate high-definition Behance SVG thumbnail
    if (finalImages.length === 0) {
      if (graphicBehanceUrl.trim()) {
        finalImages = [generateBehanceThumbnail(finalTitle, 'Naeim Visual')];
      } else {
        alert('অনুগ্রহ করে গ্যালারি থেকে অন্তত ১টি ছবি দিন অথবা বিহান্স লিংক পেস্ট করুন!');
        return;
      }
    }

    setIsSubmitting(true);
    const cover = finalImages[selectedGraphicThumbnailIndex] || finalImages[0];

    const newGraphic: GraphicItem = {
      id: `gfx_${Date.now()}`,
      title: finalTitle,
      category: 'Graphics Design',
      filename: cover,
      images: finalImages,
      thumbnailIndex: selectedGraphicThumbnailIndex,
      description: graphicDescription.trim() || undefined,
      behanceUrl: graphicBehanceUrl.trim() || undefined,
      dimensions: '808 × 636',
      likes: 0,
      comments: [],
      isCustomUpload: true,
      uploadedAt: Date.now()
    };

    onSaveGraphic(newGraphic);
    setIsSubmitting(false);
    setSuccessMessage('গ্রাফিক্স ডিজাইন প্রজেক্টটি সফলভাবে যুক্ত হয়েছে! এটি পোর্টফোলিওতে সরাসরি শো করছে।');
    setTimeout(() => setSuccessMessage(null), 3500);

    setGraphicTitle('');
    setGraphicBehanceUrl('');
    setGraphicImages([]);
    setSelectedGraphicThumbnailIndex(0);
    setGraphicDescription('');
  };

  // Handle Multi-Image Upload for Meta Marketing
  const handleMarketingImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const list = Array.from(files);
    const loaded: string[] = [];

    for (const f of list) {
      try {
        const optimized = await optimizeImageFile(f, 1600, 0.88);
        loaded.push(optimized);
      } catch (err) {
        console.error(err);
      }
    }

    setMarketingImages((prev) => [...prev, ...loaded]);
  };

  // Submit Marketing Project
  const handleSubmitMarketing = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketingTitle.trim()) {
      alert('মেটা মার্কেটিং প্রজেক্টের টাইটেল দেওয়া বাধ্যতামূলক!');
      return;
    }
    if (marketingImages.length === 0) {
      alert('অনুগ্রহ করে অন্তত ১টি অ্যাড ক্রিয়েটিভ বা ছবি আপলোড করুন!');
      return;
    }

    setIsSubmitting(true);
    const cover = marketingImages[selectedMarketingThumbnailIndex] || marketingImages[0];

    const newMarketing: MarketingItem = {
      id: `mkt_${Date.now()}`,
      title: marketingTitle.trim(),
      platform: marketingPlatform,
      category: 'Meta Marketing',
      thumbnailUrl: cover,
      images: marketingImages,
      description: marketingDescription.trim() || undefined,
      metrics: {
        roas: marketingRoas.trim() || undefined,
        reach: marketingReach.trim() || undefined,
        sales: marketingSales.trim() || undefined
      },
      likes: 0,
      comments: [],
      isCustomUpload: true,
      uploadedAt: Date.now()
    };

    onSaveMarketing(newMarketing);
    setIsSubmitting(false);
    setSuccessMessage('মেটা মার্কেটিং প্রজেক্টটি সফলভাবে যুক্ত হয়েছে!');
    setTimeout(() => setSuccessMessage(null), 3500);

    setMarketingTitle('');
    setMarketingImages([]);
    setSelectedMarketingThumbnailIndex(0);
    setMarketingDescription('');
  };

  // Handle Profile Avatar Upload in Settings
  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await optimizeImageFile(file, 800, 0.9);
      const updated = { ...settings, profileAvatar: optimized };
      setSettings(updated);
      saveSiteSettings(updated);
      if (onSettingsUpdated) onSettingsUpdated(updated);
      setSettingsSavedMessage('প্রোফাইল ছবি সফলভাবে পরিবর্তন হয়েছে!');
      setTimeout(() => setSettingsSavedMessage(null), 3500);
    } catch (err) {
      console.error(err);
    }
  };

  // Save General Settings (Name, Bio, Likes/Comments toggle, Social links)
  const handleSaveGeneralSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const formattedWA = formatWhatsAppLink(settings.socialLinks.whatsapp);
    const updated = {
      ...settings,
      socialLinks: {
        ...settings.socialLinks,
        whatsapp: formattedWA
      }
    };
    setSettings(updated);
    saveSiteSettings(updated);
    if (onSettingsUpdated) onSettingsUpdated(updated);
    setSettingsSavedMessage('সেটিংস সফলভাবে সংরক্ষিত হয়েছে!');
    setTimeout(() => setSettingsSavedMessage(null), 3500);
  };

  // Change Admin Password
  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    if (!newPassword || newPassword.length < 6) {
      setPasswordError('পাসওয়ার্ড অন্তত ৬ অক্ষরের হতে হবে।');
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('দুটো পাসওয়ার্ড মিলছে না!');
      return;
    }

    updateAdminPassword(newPassword);
    const updated = { ...settings, adminPassword: newPassword };
    setSettings(updated);
    setPasswordChangeSuccess(true);
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordChangeSuccess(false), 4000);
  };

  // ==========================================
  // VIEW 1: AUTHENTICATION / LOGIN SCREEN
  // ==========================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-950 px-4 py-12">
        <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          
          <div className="text-center mb-6">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto mb-3 shadow-lg shadow-amber-500/10">
              <Lock className="w-7 h-7" />
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-extrabold text-white tracking-tight">
              এডমিন প্যানেল লগইন
            </h2>
            <p className="text-xs text-slate-400 mt-1">
              আপনার জিমেইল ও শক্তিশালী পাসওয়ার্ড দিয়ে লগইন করুন। একবার লগইন করলে এই ডিভাইসে সংরক্ষিত থাকবে।
            </p>
          </div>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLoginSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                এডমিন জিমেইল (Gmail)
              </label>
              <input
                type="email"
                required
                value={loginEmail}
                onChange={(e) => setLoginEmail(e.target.value)}
                placeholder="mdnaeim997@gmail.com"
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                পাসওয়ার্ড (Password)
              </label>
              <input
                type="password"
                required
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="আপনার গোপন পাসওয়ার্ড লিখুন..."
                className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                ডিফল্ট পাসওয়ার্ড: <span className="font-mono text-amber-400/80">naeimpassword2026</span> (লগইন করে সেটিংস থেকে পরিবর্তন করতে পারবেন)
              </p>
            </div>

            <button
              type="submit"
              id="admin-login-submit-btn"
              className="w-full py-3.5 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-rose-500 hover:from-amber-400 hover:to-rose-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/20 transition-all flex items-center justify-center gap-2"
            >
              <KeyRound className="w-4 h-4" />
              <span>এডমিন প্যানেলে প্রবেশ করুন</span>
            </button>
          </form>

          {/* Quick exit back to public site */}
          <div className="mt-6 pt-5 border-t border-slate-800 text-center">
            <button
              type="button"
              onClick={onBackToPublic}
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>পাবলিক পোর্টফোলিও ভিউতে ফিরে যান</span>
            </button>
          </div>

        </div>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: AUTHENTICATED ADMIN STUDIO PANEL
  // ==========================================
  return (
    <div id="admin-panel-root" className="min-h-screen bg-[#070b14] text-slate-100 py-6 sm:py-10 px-4 sm:px-6">
      <div className="max-w-5xl mx-auto space-y-6">
        
        {/* Top Header: Title, Public View button, and Logout */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-slate-900/90 border border-slate-800 shadow-xl">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center shrink-0">
              <Shield className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-display font-extrabold text-white">
                  Naeim Visual • Admin Studio
                </h1>
                <span className="px-2 py-0.5 rounded-md bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold uppercase">
                  Active
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Logged in as <span className="font-mono text-amber-400">{settings.adminEmail}</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            {/* Direct Public View button */}
            <button
              type="button"
              id="admin-view-live-portfolio-btn"
              onClick={onBackToPublic}
              className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95"
            >
              <Eye className="w-4 h-4" />
              <span>ভিউ পোর্টফোলিও (View Site)</span>
            </button>

            {/* Logout button */}
            <button
              type="button"
              onClick={handleLogout}
              className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Global Notification Banners */}
        {successMessage && (
          <div className="p-4 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {settingsSavedMessage && (
          <div className="p-4 rounded-2xl bg-amber-500/15 border border-amber-500/40 text-amber-400 text-xs sm:text-sm font-semibold flex items-center gap-2.5 animate-fadeIn">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{settingsSavedMessage}</span>
          </div>
        )}

        {/* Main Navigation Tabs: Upload | Manage | Settings */}
        <div className="flex items-center gap-2 overflow-x-auto p-1.5 rounded-2xl bg-slate-900 border border-slate-800">
          <button
            type="button"
            onClick={() => setAdminTab('upload')}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              adminTab === 'upload'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Upload className="w-4 h-4" />
            <span>+ নতুন প্রজেক্ট আপলোড</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('manage')}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              adminTab === 'manage'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>প্রজেক্ট ম্যানেজ ({customVideos.length + customGraphics.length + customMarketing.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setAdminTab('settings')}
            className={`flex-1 min-w-[140px] inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              adminTab === 'settings'
                ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/25'
                : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
            }`}
          >
            <SettingsIcon className="w-4 h-4" />
            <span>সেটিংস ও প্রোফাইল</span>
          </button>
        </div>

        {/* ========================================== */}
        {/* TAB 1: UPLOAD PROJECT (3 CLEAR CATEGORIES) */}
        {/* ========================================== */}
        {adminTab === 'upload' && (
          <div className="space-y-6">
            
            {/* Category Selector Buttons: Exactly the 3 requested */}
            <div className="p-5 rounded-3xl bg-slate-900/80 border border-slate-800">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
                ক্যাটাগরি সিলেক্ট করুন (Select 1 of 3 Categories):
              </label>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                
                {/* 1. Video Editing */}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Video Editing')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    selectedCategory === 'Video Editing'
                      ? 'bg-amber-500/15 border-amber-500 ring-2 ring-amber-500/30 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${selectedCategory === 'Video Editing' ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Film className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">ভিডিও এডিটিং</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">YouTube বা Facebook ভিডিও লিংক</p>
                  </div>
                </button>

                {/* 2. Graphics Design */}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Graphics Design')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    selectedCategory === 'Graphics Design'
                      ? 'bg-emerald-500/15 border-emerald-500 ring-2 ring-emerald-500/30 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${selectedCategory === 'Graphics Design' ? 'bg-emerald-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Palette className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">গ্রাফিক্স ডিজাইন</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">বিহান্স স্টাইল মাল্টি-ইমেজ ডিজাইন</p>
                  </div>
                </button>

                {/* 3. Meta Marketing */}
                <button
                  type="button"
                  onClick={() => setSelectedCategory('Meta Marketing')}
                  className={`p-4 rounded-2xl border text-left flex items-start gap-3 transition-all ${
                    selectedCategory === 'Meta Marketing'
                      ? 'bg-blue-500/15 border-blue-500 ring-2 ring-blue-500/30 text-white'
                      : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl ${selectedCategory === 'Meta Marketing' ? 'bg-blue-500 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    <Megaphone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white">মেটা মার্কেটিং</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">অ্যাড ক্রিয়েটিভস ও ক্যাম্পেইন ইমেজ</p>
                  </div>
                </button>

              </div>
            </div>

            {/* FORM 1: VIDEO EDITING */}
            {selectedCategory === 'Video Editing' && (
              <form onSubmit={handleSubmitVideo} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Film className="w-5 h-5 text-amber-400" />
                    <span>ভিডিও এডিটিং প্রজেক্ট আপলোড</span>
                  </h2>
                  <span className="text-[11px] font-semibold text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-md border border-amber-400/20">
                    * টাইটেল বাধ্যতামূলক
                  </span>
                </div>

                {/* Title (Mandatory, with auto-fetch notice) */}
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                      ভিডিওর টাইটেল <span className="text-rose-500">* (বাধ্যতামূলক)</span>
                    </label>
                    {isFetchingTitle && (
                      <span className="text-[11px] text-amber-400 font-semibold animate-pulse flex items-center gap-1">
                        <RefreshCw className="w-3 h-3 animate-spin" />
                        লিংক থেকে টাইটেল আনা হচ্ছে...
                      </span>
                    )}
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      required
                      placeholder="যেমন: Cinematic Commercial 4K বা লিংক পেস্ট করলে অটো টাইটেল চলে আসবে"
                      value={videoTitle}
                      onChange={(e) => handleVideoTitleChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    নিচে YouTube বা Facebook ভিডিওর লিংক দিলে টাইটেল এবং আকর্ষণীয় ৮৮৮×৬৩৬ থাম্বনেল অটোমেটিক বসে যাবে। চাইলে নিজে লিখেও পরিবর্তন করতে পারেন।
                  </p>
                </div>

                {/* Video Link (YouTube or Facebook) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5 flex items-center justify-between">
                    <span>YouTube বা Facebook ভিডিও লিংক <span className="text-slate-400">(ঐচ্ছিক)</span></span>
                    {detectedPlatform && (
                      <span className={`text-[11px] font-bold px-2.5 py-0.5 rounded-full uppercase flex items-center gap-1.5 ${
                        detectedPlatform === 'facebook'
                          ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                          : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                      }`}>
                        <Check className="w-3 h-3" />
                        {detectedPlatform === 'facebook' ? 'Facebook Video Detected • 808×636 Frame Ready' : `${detectedPlatform} Detected`}
                      </span>
                    )}
                  </label>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="https://youtu.be/... বা https://www.facebook.com/.../videos/..."
                      value={videoLink}
                      onChange={(e) => handleVideoLinkChange(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                    <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  </div>
                  <p className="text-[11px] text-slate-400 mt-1">
                    YouTube কিংবা Facebook যেকোনো লিংক দিলেই অটোমেটিক আকর্ষণীয় 808×636 থাম্বনেল তৈরি হয়ে যাবে।
                  </p>
                </div>

                {/* 808x636 Thumbnail Preview & Custom Upload */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      কাস্টম থাম্বনেল আপলোড <span className="text-slate-400">(ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleVideoThumbnailUpload}
                      className="block w-full text-xs text-slate-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-slate-800 file:text-slate-200 hover:file:bg-slate-700 cursor-pointer"
                    />
                    <p className="text-[11px] text-slate-500 mt-1">
                      ফ্রেম সাইজ হবে ৮৮৮ বাই ৬৩৬ (808 × 636)।
                    </p>
                  </div>

                  {/* 808x636 Frame Preview */}
                  <div>
                    <span className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                      থাম্বনেল ফ্রেম প্রিভিউ (808 × 636 সাইজ)
                    </span>
                    <div
                      className="relative w-full rounded-2xl bg-black overflow-hidden border border-slate-800 flex items-center justify-center"
                      style={{ aspectRatio: '808 / 636' }}
                    >
                      {videoThumbnailUrl ? (
                        <img src={videoThumbnailUrl} alt="Preview" className="w-full h-full object-cover" />
                      ) : (
                        <div className="flex flex-col items-center text-slate-500 text-xs">
                          <ImageIcon className="w-6 h-6 mb-1 opacity-50" />
                          <span>808 × 636 Frame</span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    ডেসক্রিপশন <span className="text-slate-400">(ঐচ্ছিক)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ভিডিও সম্পর্কে বিবরণ দিতে চাইলে লিখুন (ঐচ্ছিক)..."
                    value={videoDescription}
                    onChange={(e) => setVideoDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-sm shadow-lg shadow-amber-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>ভিডিও প্রজেক্ট পাবলিশ করুন (Publish Video)</span>
                </button>
              </form>
            )}

            {/* FORM 2: GRAPHICS DESIGN (BEHANCE STYLE MULTI-IMAGE & LINK) */}
            {selectedCategory === 'Graphics Design' && (
              <form onSubmit={handleSubmitGraphic} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Palette className="w-5 h-5 text-emerald-400" />
                    <span>গ্রাফিক্স ডিজাইন প্রজেক্ট আপলোড (গ্যালারি বা বিহান্স লিংক)</span>
                  </h2>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-md border border-emerald-400/20">
                    গ্যালারি অথবা বিহান্স লিংক
                  </span>
                </div>

                {/* Option A: Behance Project Link (Auto-detects title & artwork) */}
                <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                      <LinkIcon className="w-4 h-4 text-emerald-400" />
                      <span>বিহান্স প্রজেক্ট লিংক পেস্ট করুন (Behance Project URL)</span>
                    </label>
                    <span className="text-[10px] text-slate-400">
                      কোনো টাইটেল ছাড়াই অটোমেটিক চলে আসবে
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="url"
                      placeholder="যেমন: https://www.behance.net/gallery/12345678/My-Project"
                      value={graphicBehanceUrl}
                      onChange={(e) => handleBehanceUrlChange(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                    />
                    {isFetchingBehance && (
                      <div className="absolute right-3 top-3 text-emerald-400">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                      </div>
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400">
                    💡 বিহান্স প্রজেক্টের লিংক এখানে পেস্ট করলে টাইটেল এবং প্রিমিয়াম আর্টওয়ার্ক অটোমেটিক শো করবে। আপনি চাইলে নিচে কাস্টম টাইটেল বা ছবিও দিতে পারেন।
                  </p>
                </div>

                {/* Title (Optional if Behance link provided) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    প্রজেক্ট টাইটেল {graphicBehanceUrl ? <span className="text-emerald-400 font-normal">(অটোমেটিক যুক্ত হবে)</span> : <span className="text-rose-500">*</span>}
                  </label>
                  <input
                    type="text"
                    placeholder="যেমন: Movie Poster Key Visual বা Brand Identity Case Study"
                    value={graphicTitle}
                    onChange={(e) => setGraphicTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                {/* Multi-Image Upload Box with prominent Plus (+) Button */}
                <div className="p-6 rounded-2xl bg-slate-950 border-2 border-dashed border-emerald-500/40 hover:border-emerald-400 transition-colors">
                  <div className="text-center flex flex-col items-center">
                    <label className="cursor-pointer group flex flex-col items-center">
                      {/* Big Round Plus Button as requested */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-emerald-500/15 group-hover:bg-emerald-500/25 border-2 border-emerald-500/50 flex items-center justify-center mb-3 shadow-lg shadow-emerald-500/20 group-hover:scale-110 group-active:scale-95 transition-all">
                        <Plus className="w-9 h-9 sm:w-11 sm:h-11 text-emerald-400 stroke-[2.5]" />
                      </div>
                      <span className="text-base sm:text-lg font-bold text-emerald-400 group-hover:text-emerald-300 transition-colors">
                        মোবাইল বা পিসি গ্যালারি থেকে একাধিক ডিজাইন সিলেক্ট করুন (+)
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleGraphicImagesUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs sm:text-sm text-slate-400 mt-2 max-w-lg">
                      গ্যালারি থেকে আপনার পোস্টার ও আর্টওয়ার্কের একাধিক ছবি সিলেক্ট করুন। পোর্টফোলিওর সামনে <strong className="text-slate-200">808 × 636 সাইজের কভার থাম্বনেল</strong> শো করবে এবং থাম্বনেলে ক্লিক করলে বিহান্স স্টাইলে সম্পূর্ণ প্রজেক্টের সব ছবি দেখা যাবে।
                    </p>
                  </div>

                  {/* Uploaded Images List & 808x636 Cover Thumbnail Selector */}
                  {graphicImages.length > 0 && (
                    <div className="mt-6 pt-5 border-t border-slate-800">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 mb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-xs sm:text-sm font-bold text-slate-200">
                            আপলোড করা ছবি ({graphicImages.length}টি)
                          </span>
                          <span className="text-[11px] text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                            ★ কভার থাম্বনেলে ক্লিক করে সিলেক্ট করুন
                          </span>
                        </div>
                        {/* Add more images button */}
                        <label className="cursor-pointer inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 text-xs font-bold transition-all border border-emerald-500/30">
                          <Plus className="w-3.5 h-3.5" />
                          <span>আরো ছবি যোগ করুন</span>
                          <input
                            type="file"
                            multiple
                            accept="image/*"
                            onChange={handleGraphicImagesUpload}
                            className="hidden"
                          />
                        </label>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {graphicImages.map((img, idx) => {
                          const isCover = selectedGraphicThumbnailIndex === idx;
                          return (
                            <div
                              key={idx}
                              onClick={() => setSelectedGraphicThumbnailIndex(idx)}
                              className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                isCover
                                  ? 'border-emerald-500 ring-2 ring-emerald-500/50 shadow-lg shadow-emerald-500/25 scale-[1.02]'
                                  : 'border-slate-800 opacity-70 hover:opacity-100 hover:border-slate-700'
                              }`}
                              style={{ aspectRatio: '808 / 636' }}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />
                              {isCover ? (
                                <span className="absolute top-2 left-2 px-2 py-1 rounded bg-emerald-500 text-slate-950 text-[10px] font-black uppercase shadow-md flex items-center gap-1">
                                  <span>★ 808 × 636 থাম্বনেল</span>
                                </span>
                              ) : (
                                <span className="absolute bottom-1.5 left-1.5 text-[10px] text-slate-300 bg-black/60 px-1.5 py-0.5 rounded">
                                  স্লাইড #{idx + 1}
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setGraphicImages((prev) => prev.filter((_, i) => i !== idx));
                                }}
                                className="absolute top-1.5 right-1.5 p-1 rounded-md bg-rose-500 hover:bg-rose-600 text-white shadow-md transition-all"
                                title="মুছে ফেলুন"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Description (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    ডেসক্রিপশন <span className="text-slate-400">(ঐচ্ছিক)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="গ্রাফিক্স বা কেস স্টাডি সম্পর্কে বিবরণ দিতে চাইলে লিখুন (ঐচ্ছিক)..."
                    value={graphicDescription}
                    onChange={(e) => setGraphicDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-lg shadow-emerald-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>গ্রাফিক্স ডিজাইন পাবলিশ করুন (Publish Design)</span>
                </button>
              </form>
            )}

            {/* FORM 3: META MARKETING (MULTI-IMAGE / AD CREATIVE STYLE) */}
            {selectedCategory === 'Meta Marketing' && (
              <form onSubmit={handleSubmitMarketing} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-5">
                <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Megaphone className="w-5 h-5 text-blue-400" />
                    <span>মেটা মার্কেটিং ও বিজ্ঞাপন প্রজেক্ট আপলোড</span>
                  </h2>
                  <span className="text-[11px] font-semibold text-blue-400 bg-blue-400/10 px-2.5 py-1 rounded-md border border-blue-400/20">
                    * টাইটেল বাধ্যতামূলক
                  </span>
                </div>

                {/* Title (Mandatory) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    ক্যাম্পেইন টাইটেল <span className="text-rose-500">* (বাধ্যতামূলক)</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="যেমন: E-Commerce High-ROAS Funnel বা Facebook Ad Creative Campaign"
                    value={marketingTitle}
                    onChange={(e) => setMarketingTitle(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-700 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                {/* Multi-Image Ad Creative Upload Box */}
                <div className="p-5 rounded-2xl bg-slate-950 border-2 border-dashed border-slate-700 hover:border-blue-500/50 transition-colors">
                  <div className="text-center">
                    <ImageIcon className="w-8 h-8 text-blue-400 mx-auto mb-2" />
                    <label className="cursor-pointer">
                      <span className="text-sm font-bold text-blue-400 hover:underline">
                        মোবাইল বা পিসি গ্যালারি থেকে মার্কেটিং বিজ্ঞাপন ছবি আপলোড করুন
                      </span>
                      <input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleMarketingImagesUpload}
                        className="hidden"
                      />
                    </label>
                    <p className="text-xs text-slate-400 mt-1">
                      বিজ্ঞাপনের ক্রিয়েটিভ ছবিগুলো একসাথে দিন। ফ্রেম সাইজ ৮৮৮ বাই ৬৩৬ (808 × 636) হবে।
                    </p>
                  </div>

                  {/* Uploaded Images List & Cover Thumbnail Selector */}
                  {marketingImages.length > 0 && (
                    <div className="mt-5 pt-4 border-t border-slate-800">
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-xs font-bold text-slate-300">
                          আপলোড করা ছবি ({marketingImages.length}টি) • যেকোনো ছবিতে ক্লিক করে কভার থাম্বনেল সিলেক্ট করুন:
                        </span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        {marketingImages.map((img, idx) => {
                          const isCover = selectedMarketingThumbnailIndex === idx;
                          return (
                            <div
                              key={idx}
                              onClick={() => setSelectedMarketingThumbnailIndex(idx)}
                              className={`group relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                                isCover
                                  ? 'border-blue-500 ring-2 ring-blue-500/40 shadow-lg shadow-blue-500/20'
                                  : 'border-slate-800 opacity-70 hover:opacity-100'
                              }`}
                              style={{ aspectRatio: '808 / 636' }}
                            >
                              <img src={img} alt="" className="w-full h-full object-cover" />
                              {isCover && (
                                <span className="absolute top-1.5 left-1.5 px-2 py-0.5 rounded bg-blue-500 text-white text-[10px] font-black uppercase">
                                  থাম্বনেল (Cover)
                                </span>
                              )}
                              <button
                                type="button"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setMarketingImages((prev) => prev.filter((_, i) => i !== idx));
                                }}
                                className="absolute top-1.5 right-1.5 p-1 rounded bg-rose-500 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <X className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>

                {/* Optional Metrics */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      ROAS <span className="text-slate-400">(ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: 4.8×"
                      value={marketingRoas}
                      onChange={(e) => setMarketingRoas(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Reach <span className="text-slate-400">(ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: 250K+"
                      value={marketingReach}
                      onChange={(e) => setMarketingReach(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                      Sales / Leads <span className="text-slate-400">(ঐচ্ছিক)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="যেমন: $18,500"
                      value={marketingSales}
                      onChange={(e) => setMarketingSales(e.target.value)}
                      className="w-full px-4 py-2 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                    />
                  </div>
                </div>

                {/* Description (Optional) */}
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    ডেসক্রিপশন <span className="text-slate-400">(ঐচ্ছিক)</span>
                  </label>
                  <textarea
                    rows={3}
                    placeholder="টার্গেটিং অডিয়েন্স, ফানেল স্ট্র্যাটেজি ইত্যাদি বিবরণ দিতে পারেন..."
                    value={marketingDescription}
                    onChange={(e) => setMarketingDescription(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-lg shadow-blue-500/25 transition-all flex items-center justify-center gap-2"
                >
                  <Upload className="w-4 h-4" />
                  <span>মেটা মার্কেটিং প্রজেক্ট পাবলিশ করুন (Publish Marketing)</span>
                </button>
              </form>
            )}

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 2: MANAGE & DELETE EXISTING PROJECTS   */}
        {/* ========================================== */}
        {adminTab === 'manage' && (
          <div className="space-y-6 p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-800/80 pb-4">
              <div>
                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                  <Layers className="w-5 h-5 text-amber-400" />
                  <span>আপনার পোর্টফোলিওর সকল প্রজেক্ট ম্যানেজ</span>
                </h2>
                <p className="text-xs text-slate-400 mt-1">
                  এখানে সকল ভিডিও, গ্রাফিক্স বা মার্কেটিং প্রজেক্ট সরাসরি এডিট (পেন্সিল বাটন) অথবা ডিলিট (লাল ট্র্যাশ বাটন) করতে পারবেন।
                </p>
              </div>

              {onResetDefaultVideos && (
                <button
                  type="button"
                  onClick={() => {
                    if (confirm('আপনি কি ডিফল্ট ৬টি ভিডিও রিস্টোর করতে চান? এটি পূর্বের ডিফল্ট ভিডিওগুলো পুনরায় সাজিয়ে দেবে।')) {
                      onResetDefaultVideos();
                      setSuccessMessage('ডিফল্ট ৬টি ভিডিও সফলভাবে রিস্টোর করা হয়েছে!');
                      setTimeout(() => setSuccessMessage(null), 3500);
                    }
                  }}
                  className="inline-flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white text-xs font-semibold border border-slate-700 transition-colors shrink-0 shadow-sm"
                  title="ডিফল্ট ৬টি ভিডিও রিস্টোর করুন"
                >
                  <RefreshCw className="w-3.5 h-3.5 text-amber-400" />
                  <span>🔄 ডিফল্ট ৬টি ভিডিও রিস্টোর করুন</span>
                </button>
              )}
            </div>

            {/* Videos */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-2">
                  <Film className="w-4 h-4" />
                  <span>পোর্টফোলিওর ভিডিও ({customVideos.length} টি)</span>
                </h3>
                <span className="text-[11px] text-slate-400 font-normal">
                  (এডিট ও ডিলিট অপশন প্রতিটি ভিডিওতেই বিদ্যমান)
                </span>
              </div>
              {customVideos.length === 0 ? (
                <p className="text-xs text-slate-500 italic">কোনো কাস্টম ভিডিও নেই।</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customVideos.map((v) => (
                    <div key={v.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-16 h-12 rounded-xl bg-black overflow-hidden shrink-0 border border-slate-800" style={{ aspectRatio: '808 / 636' }}>
                          <img src={v.thumbnailUrl || 'graphic1.jpg'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{v.title}</h4>
                          <span className="text-[10px] text-slate-400">{v.platform || 'Video'}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingVideo(v)}
                          className="p-2 rounded-xl bg-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-950 transition-colors"
                          title="প্রজেক্ট এডিট করুন (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('আপনি কি এই ভিডিওটি মুছে ফেলতে চান?')) onDeleteVideo(v.id);
                          }}
                          className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          title="মুছে ফেলুন (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Graphics */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-2">
                <Palette className="w-4 h-4" />
                <span>আপলোডকৃত গ্রাফিক্স ({customGraphics.length})</span>
              </h3>
              {customGraphics.length === 0 ? (
                <p className="text-xs text-slate-500 italic">কোনো কাস্টম গ্রাফিক্স নেই।</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customGraphics.map((g) => (
                    <div key={g.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-16 h-12 rounded-xl bg-black overflow-hidden shrink-0 border border-slate-800" style={{ aspectRatio: '808 / 636' }}>
                          <img src={g.filename} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{g.title}</h4>
                          <span className="text-[10px] text-slate-400">
                            {g.images && g.images.length > 1 ? `${g.images.length} Slides` : 'Single Design'}
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingGraphic(g)}
                          className="p-2 rounded-xl bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500 hover:text-slate-950 transition-colors"
                          title="ডিজাইন এডিট করুন (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('আপনি কি এই গ্রাফিক্স ডিজাইনটি মুছে ফেলতে চান?')) onDeleteGraphic(g.id);
                          }}
                          className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          title="মুছে ফেলুন (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Marketing */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 flex items-center gap-2">
                <Megaphone className="w-4 h-4" />
                <span>আপলোডকৃত মেটা মার্কেটিং ({customMarketing.length})</span>
              </h3>
              {customMarketing.length === 0 ? (
                <p className="text-xs text-slate-500 italic">কোনো কাস্টম মার্কেটিং প্রজেক্ট নেই।</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {customMarketing.map((m) => (
                    <div key={m.id} className="p-3 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-3 overflow-hidden">
                        <div className="w-16 h-12 rounded-xl bg-black overflow-hidden shrink-0 border border-slate-800" style={{ aspectRatio: '808 / 636' }}>
                          <img src={m.thumbnailUrl || 'graphic1.jpg'} alt="" className="w-full h-full object-cover" />
                        </div>
                        <div className="truncate">
                          <h4 className="text-xs font-bold text-white truncate">{m.title}</h4>
                          <span className="text-[10px] text-slate-400">{m.platform}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <button
                          type="button"
                          onClick={() => setEditingMarketing(m)}
                          className="p-2 rounded-xl bg-blue-500/20 text-blue-400 hover:bg-blue-500 hover:text-white transition-colors"
                          title="মার্কেটিং প্রজেক্ট এডিট করুন (Edit)"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            if (confirm('আপনি কি এই মেটা মার্কেটিং প্রজেক্টটি মুছে ফেলতে চান?')) onDeleteMarketing(m.id);
                          }}
                          className="p-2 rounded-xl bg-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors"
                          title="মুছে ফেলুন (Delete)"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Visitor Comments Feed */}
            <div className="pt-4 border-t border-slate-800">
              <AdminCommentsFeed />
            </div>

          </div>
        )}

        {/* ========================================== */}
        {/* TAB 3: SETTINGS (PROFILE, PASSWORD, SOCIALS)*/}
        {/* ========================================== */}
        {adminTab === 'settings' && (
          <div className="space-y-6">
            
            {/* 1. Profile Picture Update from Gallery */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <User className="w-5 h-5 text-amber-400" />
                <span>প্রোফাইল ছবি পরিবর্তন (Change Profile Picture)</span>
              </h2>
              <p className="text-xs text-slate-400">
                মোবাইল বা পিসি গ্যালারি থেকে যেকোনো ছবি সিলেক্ট করলেই আপনার পোর্টফোলিওতে সাথে সাথে সেট হয়ে যাবে।
              </p>

              <div className="flex items-center gap-5">
                <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden border-2 border-amber-500 shadow-xl shrink-0">
                  <img src={settings.profileAvatar} alt="Avatar" className="w-full h-full object-cover" />
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all">
                    <Upload className="w-4 h-4" />
                    <span>নতুন ছবি আপলোড করুন</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAvatarChange}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[11px] text-slate-400 mt-2">
                    JPG, PNG বা WebP ছবি সাপোর্ট করে।
                  </p>
                </div>
              </div>
            </div>

            {/* 2. Likes & Comments Visibility Toggle */}
            <div className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-400" />
                    <span>লাইক ও কমেন্ট অপশন প্রদর্শন / গোপন (Show / Hide Likes & Comments)</span>
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">
                    আপনি কি সাধারণ ভিজিটরদের লাইক ও কমেন্ট করার অপশন দেখাতে চান? অন বা অফ করে রাখতে পারবেন।
                  </p>
                </div>

                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={settings.showLikesAndComments}
                    onChange={(e) => {
                      const updated = { ...settings, showLikesAndComments: e.target.checked };
                      setSettings(updated);
                      saveSiteSettings(updated);
                      if (onSettingsUpdated) onSettingsUpdated(updated);
                      setSettingsSavedMessage(`লাইক ও কমেন্ট ${e.target.checked ? 'চালু' : 'বন্ধ'} করা হয়েছে`);
                      setTimeout(() => setSettingsSavedMessage(null), 3000);
                    }}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-amber-500"></div>
                </label>
              </div>
            </div>

            {/* 3. Name, Title & Bio Settings */}
            <form onSubmit={handleSaveGeneralSettings} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-amber-400" />
                <span>প্রোফাইল তথ্য ও সোশ্যাল লিংক পরিবর্তন</span>
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    আপনার পুরো নাম (Name)
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.profileName}
                    onChange={(e) => setSettings({ ...settings, profileName: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    পেশাগত পদবী (Title)
                  </label>
                  <input
                    type="text"
                    required
                    value={settings.profileTitle}
                    onChange={(e) => setSettings({ ...settings, profileTitle: e.target.value })}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                  বায়ো / শর্ট ডেসক্রিপশন (Bio)
                </label>
                <textarea
                  rows={2}
                  value={settings.profileBio}
                  onChange={(e) => setSettings({ ...settings, profileBio: e.target.value })}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm resize-none"
                />
              </div>

              {/* Social Links Customization */}
              <div className="pt-3 border-t border-slate-800 space-y-3">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  সোশ্যাল ও কন্টাক্ট লিংকসমূহ:
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Behance URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks.behance}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, behance: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      WhatsApp URL / Chat Link
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks.whatsapp}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, whatsapp: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Facebook URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks.facebook}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, facebook: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      YouTube Channel URL
                    </label>
                    <input
                      type="url"
                      value={settings.socialLinks.youtube}
                      onChange={(e) => setSettings({
                        ...settings,
                        socialLinks: { ...settings.socialLinks, youtube: e.target.value }
                      })}
                      className="w-full px-3 py-2 rounded-lg bg-slate-950 border border-slate-700 text-xs text-white"
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all"
              >
                <Check className="w-4 h-4" />
                <span>তথ্যসমূহ সংরক্ষণ করুন (Save Profile Data)</span>
              </button>
            </form>

            {/* 4. Change Admin Password Form */}
            <form onSubmit={handleChangePassword} className="p-6 sm:p-8 rounded-3xl bg-slate-900/80 border border-slate-800 space-y-4">
              <h2 className="text-base sm:text-lg font-bold text-white flex items-center gap-2">
                <KeyRound className="w-5 h-5 text-rose-400" />
                <span>এডমিন পাসওয়ার্ড পরিবর্তন (Change Admin Password)</span>
              </h2>
              <p className="text-xs text-slate-400">
                এখানে আপনি আপনার নিজের মতো একটি শক্তিশালী পাসওয়ার্ড দিতে পারবেন।
              </p>

              {passwordChangeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold">
                  পাসওয়ার্ড সফলভাবে পরিবর্তন করা হয়েছে!
                </div>
              )}

              {passwordError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-semibold">
                  {passwordError}
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    নতুন পাসওয়ার্ড (New Password)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="কমপক্ষে ৬ অক্ষর..."
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1.5">
                    পাসওয়ার্ড নিশ্চিত করুন (Confirm Password)
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="একই পাসওয়ার্ড পুনরায় লিখুন..."
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-white text-sm"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs shadow-md transition-all"
              >
                <KeyRound className="w-4 h-4" />
                <span>পাসওয়ার্ড আপডেট করুন</span>
              </button>
            </form>

          </div>
        )}

        {/* Modal for Editing Projects */}
        <EditProjectModal
          isOpen={!!(editingVideo || editingGraphic || editingMarketing)}
          onClose={() => {
            setEditingVideo(null);
            setEditingGraphic(null);
            setEditingMarketing(null);
          }}
          videoItem={editingVideo}
          graphicItem={editingGraphic}
          marketingItem={editingMarketing}
          onSaveVideo={(updated) => {
            onSaveVideo(updated);
            setEditingVideo(null);
            setSuccessMessage('ভিডিও প্রজেক্টটি সফলভাবে আপডেট হয়েছে!');
            setTimeout(() => setSuccessMessage(null), 3500);
          }}
          onSaveGraphic={(updated) => {
            onSaveGraphic(updated);
            setEditingGraphic(null);
            setSuccessMessage('গ্রাফিক্স ডিজাইন প্রজেক্টটি সফলভাবে আপডেট হয়েছে!');
            setTimeout(() => setSuccessMessage(null), 3500);
          }}
          onSaveMarketing={(updated) => {
            onSaveMarketing(updated);
            setEditingMarketing(null);
            setSuccessMessage('মেটা মার্কেটিং প্রজেক্টটি সফলভাবে আপডেট হয়েছে!');
            setTimeout(() => setSuccessMessage(null), 3500);
          }}
        />

      </div>
    </div>
  );
};
