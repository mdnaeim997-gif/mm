import React, { useState, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Video, CheckCircle2, Trash2, Film, Sparkles, AlertCircle, FileCheck, Layers } from 'lucide-react';
import { GraphicItem, VideoItem } from '../types';
import { processImageFile, saveCustomGraphic, saveCustomVideo, deleteCustomGraphic, deleteCustomVideo } from '../utils/storage';

interface ProjectUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProjectAdded: () => void;
  customGraphics?: GraphicItem[];
  customVideos?: VideoItem[];
  initialTab?: 'graphic' | 'video' | 'manage';
}

export const ProjectUploadModal: React.FC<ProjectUploadModalProps> = ({
  isOpen,
  onClose,
  onProjectAdded,
  customGraphics = [],
  customVideos = [],
  initialTab = 'graphic'
}) => {
  const [activeTab, setActiveTab] = useState<'graphic' | 'video' | 'manage'>(initialTab);

  // Graphic form state
  const [graphicFile, setGraphicFile] = useState<File | null>(null);
  const [graphicPreview, setGraphicPreview] = useState<string | null>(null);
  const [graphicDimensions, setGraphicDimensions] = useState<string>('');
  const [graphicTitle, setGraphicTitle] = useState('');
  const [graphicCategory, setGraphicCategory] = useState('Key Visual • Poster');
  const [graphicDescription, setGraphicDescription] = useState('');
  const [graphicTags, setGraphicTags] = useState('Poster, Motion Graphic, Photoshop');

  // Video form state
  const [videoMode, setVideoMode] = useState<'gallery' | 'youtube'>('gallery');
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [videoTitle, setVideoTitle] = useState('');
  const [videoCategory, setVideoCategory] = useState('Motion Graphics & Animation');
  const [videoDescription, setVideoDescription] = useState('');
  const [videoTags, setVideoTags] = useState('Video Edit, Motion, Premiere Pro');
  const [isShortVideo, setIsShortVideo] = useState(false);

  // Loading & status
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const graphicInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Graphic file selection
  const handleGraphicFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setErrorMessage('অনুগ্রহ করে শুধুমাত্র ইমেজ ফাইল নির্বাচন করুন (JPG, PNG, WebP ইত্যাদি)');
      return;
    }

    setErrorMessage(null);
    try {
      setIsSubmitting(true);
      const { dataUrl, dimensions } = await processImageFile(file);
      setGraphicFile(file);
      setGraphicPreview(dataUrl);
      setGraphicDimensions(dimensions);
      if (!graphicTitle) {
        // Auto-fill title from filename without extension
        const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
        setGraphicTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
      }
    } catch {
      setErrorMessage('ইমেজ প্রসেসিংয়ে সমস্যা হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle Video file selection
  const handleVideoFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('video/')) {
      setErrorMessage('অনুগ্রহ করে শুধুমাত্র ভিডিও ফাইল নির্বাচন করুন (MP4, MOV, WebM ইত্যাদি)');
      return;
    }

    setErrorMessage(null);
    setVideoFile(file);
    const videoUrl = URL.createObjectURL(file);
    setVideoPreview(videoUrl);

    if (!videoTitle) {
      const cleanName = file.name.replace(/\.[^/.]+$/, '').replace(/[-_]/g, ' ');
      setVideoTitle(cleanName.charAt(0).toUpperCase() + cleanName.slice(1));
    }
  };

  // Extract YouTube ID helper
  const extractYoutubeId = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[2].length === 11 ? match[2] : null;
  };

  // Submit Graphic
  const handleSaveGraphic = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!graphicPreview) {
      setErrorMessage('অনুগ্রহ করে মোবাইল বা পিসি থেকে একটি ছবি/পোস্টার নির্বাচন করুন।');
      return;
    }
    if (!graphicTitle.trim()) {
      setErrorMessage('অনুগ্রহ করে প্রজেক্টের নাম দিন।');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const newGraphic: GraphicItem = {
        id: `custom-graphic-${Date.now()}`,
        filename: graphicPreview,
        title: graphicTitle.trim(),
        category: graphicCategory,
        dimensions: graphicDimensions || '1080 × 1440',
        tags: graphicTags.split(',').map((t) => t.trim()).filter(Boolean),
        description: graphicDescription.trim() || 'Custom visual art uploaded from gallery.',
        isCustomUpload: true,
        uploadedAt: Date.now()
      };

      await saveCustomGraphic(newGraphic);
      onProjectAdded();
      setSuccessMessage('পোস্টার / গ্রাফিক্স প্রজেক্টটি সফলভাবে গ্যালারি থেকে যুক্ত করা হয়েছে!');

      // Reset
      setTimeout(() => {
        setGraphicFile(null);
        setGraphicPreview(null);
        setGraphicTitle('');
        setGraphicDescription('');
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch {
      setErrorMessage('সেভ করতে সমস্যা হয়েছে। আবার চেষ্টা করুন।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Submit Video
  const handleSaveVideo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (videoMode === 'gallery' && !videoPreview) {
      setErrorMessage('অনুগ্রহ করে মোবাইল বা পিসির গ্যালারি থেকে একটি ভিডিও নির্বাচন করুন।');
      return;
    }
    if (videoMode === 'youtube') {
      const ytId = extractYoutubeId(youtubeUrl);
      if (!ytId) {
        setErrorMessage('সঠিক ইউটিউব লিংক দিন (যেমন: https://youtu.be/... অথবা shorts/...)');
        return;
      }
    }
    if (!videoTitle.trim()) {
      setErrorMessage('অনুগ্রহ করে ভিডিও প্রজেক্টের নাম দিন।');
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);

      const ytId = videoMode === 'youtube' ? (extractYoutubeId(youtubeUrl) || undefined) : undefined;

      const newVideo: VideoItem = {
        id: `custom-video-${Date.now()}`,
        youtubeId: ytId,
        videoUrl: videoMode === 'gallery' && videoPreview ? videoPreview : undefined,
        title: videoTitle.trim(),
        category: videoCategory,
        duration: isShortVideo ? 'Shorts (9:16)' : 'Video Cut (16:9)',
        isShort: isShortVideo,
        tags: videoTags.split(',').map((t) => t.trim()).filter(Boolean),
        description: videoDescription.trim() || 'Custom video edit uploaded from gallery.',
        isCustomUpload: true,
        uploadedAt: Date.now()
      };

      await saveCustomVideo(newVideo);
      onProjectAdded();
      setSuccessMessage('ভিডিও প্রজেক্টটি সফলভাবে পোর্টফোলিওতে যুক্ত করা হয়েছে!');

      // Reset
      setTimeout(() => {
        setVideoFile(null);
        setVideoPreview(null);
        setYoutubeUrl('');
        setVideoTitle('');
        setVideoDescription('');
        setSuccessMessage(null);
        onClose();
      }, 1200);
    } catch {
      setErrorMessage('ভিডিও সেভ করতে সমস্যা হয়েছে।');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Delete handler
  const handleDeleteGraphic = async (id: string) => {
    if (confirm('আপনি কি এই গ্রাফিক্স প্রজেক্টটি মুছে ফেলতে চান?')) {
      await deleteCustomGraphic(id);
      onProjectAdded();
    }
  };

  const handleDeleteVideo = async (id: string) => {
    if (confirm('আপনি কি এই ভিডিও প্রজেক্টটি মুছে ফেলতে চান?')) {
      await deleteCustomVideo(id);
      onProjectAdded();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden my-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center border border-amber-500/20">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-display font-bold text-slate-900 dark:text-white">
                গ্যালারি থেকে প্রজেক্ট আপলোড করুন
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                মোবাইল বা পিসির গ্যালারি থেকে সরাসরি ছবি ও ভিডিও যুক্ত করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-white hover:bg-slate-200/60 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-100/70 dark:bg-slate-950/40 p-1.5 gap-1.5">
          <button
            type="button"
            onClick={() => {
              setActiveTab('graphic');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'graphic'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <ImageIcon className="w-4 h-4 text-emerald-500" />
            <span>গ্রাফিক্স / পোস্টার</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('video');
              setErrorMessage(null);
            }}
            className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
              activeTab === 'video'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Video className="w-4 h-4 text-rose-500" />
            <span>ভিডিও প্রজেক্ট</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setActiveTab('manage');
              setErrorMessage(null);
            }}
            className={`py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold flex items-center justify-center gap-1.5 transition-all ${
              activeTab === 'manage'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200 dark:border-slate-700'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-500" />
            <span className="hidden sm:inline">আপলোডকৃত প্রজেক্ট</span>
            <span className="px-1.5 py-0.5 rounded-full text-[10px] bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
              {customGraphics.length + customVideos.length}
            </span>
          </button>
        </div>

        {/* Notifications */}
        {successMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs sm:text-sm flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <span>{successMessage}</span>
          </div>
        )}

        {errorMessage && (
          <div className="mx-6 mt-4 p-3 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs sm:text-sm flex items-center gap-2">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Tab 1: Graphic / Poster Upload */}
        {activeTab === 'graphic' && (
          <form onSubmit={handleSaveGraphic} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Gallery Upload Dropzone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                মোবাইল বা পিসির গ্যালারি থেকে ছবি / পোস্টার নির্বাচন করুন *
              </label>

              <input
                ref={graphicInputRef}
                type="file"
                accept="image/*"
                onChange={handleGraphicFileChange}
                className="hidden"
                id="gallery-graphic-file-input"
              />

              {graphicPreview ? (
                <div className="relative rounded-2xl overflow-hidden border-2 border-emerald-500/40 bg-slate-950 p-2 flex flex-col items-center">
                  <img
                    src={graphicPreview}
                    alt="Preview"
                    className="max-h-56 object-contain rounded-xl"
                  />
                  <div className="w-full mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 px-2">
                    <span className="truncate max-w-[200px]">
                      {graphicFile?.name || 'Uploaded Image'}
                    </span>
                    <span className="font-mono text-[11px] text-emerald-400">
                      {graphicDimensions}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        setGraphicFile(null);
                        setGraphicPreview(null);
                      }}
                      className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      <span>পরিবর্তন</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div
                  onClick={() => graphicInputRef.current?.click()}
                  className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-amber-500 dark:hover:border-amber-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50 hover:bg-amber-500/5"
                >
                  <div className="w-12 h-12 mx-auto rounded-full bg-amber-500/10 text-amber-500 flex items-center justify-center mb-2">
                    <Upload className="w-6 h-6" />
                  </div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    গ্যালারি বা ফাইল ওপেন করতে এখানে চাপুন
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    মোবাইলের ফটো গ্যালারি বা পিসি ড্র্যাগ অ্যান্ড ড্রপ সাপোর্ট করে (JPG, PNG, WebP)
                  </p>
                </div>
              )}
            </div>

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  প্রজেক্টের নাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Cyberpunk Neon Poster"
                  value={graphicTitle}
                  onChange={(e) => setGraphicTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ক্যাটাগরি (Category)
                </label>
                <select
                  value={graphicCategory}
                  onChange={(e) => setGraphicCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"
                >
                  <option value="Key Visual • Poster">Key Visual • Poster</option>
                  <option value="Typography • Editorial">Typography • Editorial</option>
                  <option value="Cover Art • VFX">Cover Art • VFX</option>
                  <option value="Commercial • Fashion">Commercial • Fashion</option>
                  <option value="Motion Identity • Esports">Motion Identity • Esports</option>
                  <option value="YouTube Thumbnail & Art">YouTube Thumbnail & Art</option>
                  <option value="Social Media Creative">Social Media Creative</option>
                </select>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                সংক্ষিপ্ত বিবরণ (Description)
              </label>
              <textarea
                rows={2}
                placeholder="ডিজাইন ও কালার গ্রেডিং সম্পর্কে সংক্ষেপে লিখুন..."
                value={graphicDescription}
                onChange={(e) => setGraphicDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ট্যাগসমূহ (কমা দিয়ে আলাদা করুন)
              </label>
              <input
                type="text"
                placeholder="Poster, Photoshop, Lighting FX, Cinematic"
                value={graphicTags}
                onChange={(e) => setGraphicTags(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-amber-500 dark:focus:border-amber-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting || !graphicPreview}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <span>প্রসেস হচ্ছে...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>পোর্টফোলিওতে যোগ করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: Video Project Upload */}
        {activeTab === 'video' && (
          <form onSubmit={handleSaveVideo} className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
            {/* Video Source Selector */}
            <div className="flex items-center gap-2 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 w-fit text-xs font-semibold">
              <button
                type="button"
                onClick={() => setVideoMode('gallery')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  videoMode === 'gallery'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                📱 গ্যালারি ভিডিও ফাইল
              </button>
              <button
                type="button"
                onClick={() => setVideoMode('youtube')}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  videoMode === 'youtube'
                    ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-sm'
                    : 'text-slate-500 dark:text-slate-400'
                }`}
              >
                ▶️ ইউটিউব লিংক
              </button>
            </div>

            {/* Option A: Gallery video */}
            {videoMode === 'gallery' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  মোবাইল বা পিসির গ্যালারি থেকে ভিডিও নির্বাচন করুন *
                </label>

                <input
                  ref={videoInputRef}
                  type="file"
                  accept="video/*"
                  onChange={handleVideoFileChange}
                  className="hidden"
                  id="gallery-video-file-input"
                />

                {videoPreview ? (
                  <div className="rounded-2xl overflow-hidden bg-black p-2 flex flex-col items-center border-2 border-rose-500/40">
                    <video
                      src={videoPreview}
                      controls
                      className="max-h-56 w-full rounded-xl object-contain"
                    />
                    <div className="w-full mt-2 pt-2 border-t border-slate-800 flex items-center justify-between text-xs text-slate-300 px-2">
                      <span className="truncate max-w-[220px]">
                        {videoFile?.name || 'Selected Video'}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          setVideoFile(null);
                          setVideoPreview(null);
                        }}
                        className="text-rose-400 hover:text-rose-300 flex items-center gap-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>পরিবর্তন</span>
                      </button>
                    </div>
                  </div>
                ) : (
                  <div
                    onClick={() => videoInputRef.current?.click()}
                    className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-rose-500 dark:hover:border-rose-500 rounded-2xl p-6 text-center cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50 hover:bg-rose-500/5"
                  >
                    <div className="w-12 h-12 mx-auto rounded-full bg-rose-500/10 text-rose-500 flex items-center justify-center mb-2">
                      <Film className="w-6 h-6" />
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white">
                      গ্যালারি থেকে ভিডিও ফাইল বাছাই করুন
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      মোবাইলে সংরক্ষিত MP4, MOV, WebM ভিডিও সিলেক্ট করুন
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Option B: YouTube URL */}
            {videoMode === 'youtube' && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ইউটিউব ভিডিও বা শর্টস লিংক *
                </label>
                <input
                  type="url"
                  placeholder="https://youtu.be/... অথবা https://youtube.com/shorts/..."
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-rose-500 dark:focus:border-rose-500"
                />
              </div>
            )}

            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ভিডিওর শিরোনাম (Title) *
                </label>
                <input
                  type="text"
                  required
                  placeholder="যেমন: Cinematic Travel Reel"
                  value={videoTitle}
                  onChange={(e) => setVideoTitle(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-rose-500 dark:focus:border-rose-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  ক্যাটাগরি (Category)
                </label>
                <select
                  value={videoCategory}
                  onChange={(e) => setVideoCategory(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-rose-500 dark:focus:border-rose-500"
                >
                  <option value="Motion Graphics & Animation">Motion Graphics & VFX</option>
                  <option value="Documentary & Story">Documentary & Stories</option>
                  <option value="Shorts & Adventure">Shorts & Reels</option>
                  <option value="Commercial Cut">Commercial Cut</option>
                  <option value="Music Video Edit">Music Video Edit</option>
                </select>
              </div>
            </div>

            {/* Shorts Checkbox */}
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isShortCheckbox"
                checked={isShortVideo}
                onChange={(e) => setIsShortVideo(e.target.checked)}
                className="w-4 h-4 rounded text-rose-600 focus:ring-rose-500 border-slate-300 dark:border-slate-700"
              />
              <label htmlFor="isShortCheckbox" className="text-xs text-slate-700 dark:text-slate-300 select-none">
                এটি একটি ভার্টিকাল শর্টস / রিলস (Vertical 9:16 Shorts)
              </label>
            </div>

            {/* Description */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                ভিডিও এডিটিং বিবরণ
              </label>
              <textarea
                rows={2}
                placeholder="সাউন্ড ডিজাইন, কাটিং পেস বা কালার প্যালেট সম্পর্কে লিখুন..."
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:border-rose-500 dark:focus:border-rose-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                বাতিল
              </button>
              <button
                type="submit"
                disabled={isSubmitting || (videoMode === 'gallery' && !videoPreview) || (videoMode === 'youtube' && !youtubeUrl)}
                className="px-6 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 disabled:opacity-50 text-white text-xs sm:text-sm font-bold shadow-lg shadow-rose-600/30 flex items-center gap-2 transition-all"
              >
                {isSubmitting ? (
                  <span>যুক্ত হচ্ছে...</span>
                ) : (
                  <>
                    <FileCheck className="w-4 h-4" />
                    <span>ভিডিও পোর্টফোলিওতে যোগ করুন</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {/* Tab 3: Manage Uploads */}
        {activeTab === 'manage' && (
          <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                গ্যালারি থেকে আপলোডকৃত গ্রাফিক্স ({customGraphics.length})
              </h3>
              {customGraphics.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500">
                  এখনো কোনো গ্রাফিক্স আপলোড করা হয়নি।
                </div>
              ) : (
                <div className="space-y-2">
                  {customGraphics.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.filename}
                          alt={item.title}
                          className="w-12 h-12 rounded-lg object-cover bg-black"
                        />
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteGraphic(item.id)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                গ্যালারি থেকে আপলোডকৃত ভিডিও ({customVideos.length})
              </h3>
              {customVideos.length === 0 ? (
                <div className="text-center p-6 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl text-xs text-slate-500">
                  এখনো কোনো ভিডিও আপলোড করা হয়নি।
                </div>
              ) : (
                <div className="space-y-2">
                  {customVideos.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-12 h-12 rounded-lg bg-black flex items-center justify-center text-rose-400 shrink-0">
                          <Film className="w-5 h-5" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400">
                            {item.category}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={() => handleDeleteVideo(item.id)}
                        className="p-2 text-rose-500 hover:bg-rose-500/10 rounded-lg transition-colors shrink-0"
                        title="Delete"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
