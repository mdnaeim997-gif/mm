import React, { useState } from 'react';
import { X, Check, Upload, Image as ImageIcon, Trash2, Film, Palette, Megaphone, Link as LinkIcon, RefreshCw } from 'lucide-react';
import { VideoItem, GraphicItem, MarketingItem } from '../types';
import { optimizeImageFile, parseVideoLink, fetchVideoMetadata, generateFacebookVideoThumbnail, fetchBehanceMetadata, generateBehanceThumbnail } from '../utils/storage';

interface EditProjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  videoItem?: VideoItem | null;
  graphicItem?: GraphicItem | null;
  marketingItem?: MarketingItem | null;
  onSaveVideo?: (video: VideoItem) => void;
  onSaveGraphic?: (graphic: GraphicItem) => void;
  onSaveMarketing?: (marketing: MarketingItem) => void;
}

export const EditProjectModal: React.FC<EditProjectModalProps> = ({
  isOpen,
  onClose,
  videoItem,
  graphicItem,
  marketingItem,
  onSaveVideo,
  onSaveGraphic,
  onSaveMarketing
}) => {
  if (!isOpen) return null;

  // 1. Video edit state
  const [videoTitle, setVideoTitle] = useState(videoItem?.title || '');
  const [videoLink, setVideoLink] = useState(
    videoItem?.facebookUrl ||
    (videoItem?.youtubeId ? `https://youtube.com/watch?v=${videoItem.youtubeId}` : '')
  );
  const [videoDescription, setVideoDescription] = useState(videoItem?.description || '');
  const [videoThumbnailUrl, setVideoThumbnailUrl] = useState(videoItem?.thumbnailUrl || '');
  const [isFetchingTitle, setIsFetchingTitle] = useState<boolean>(false);

  // Auto handle video link change in edit mode
  const handleEditVideoLinkChange = async (url: string) => {
    setVideoLink(url);
    if (!url.trim()) return;

    const parsed = parseVideoLink(url, videoTitle);
    if (parsed.platform === 'youtube' && parsed.thumbnail) {
      setVideoThumbnailUrl(parsed.thumbnail);
    } else if (parsed.platform === 'facebook') {
      setVideoThumbnailUrl(parsed.thumbnail || generateFacebookVideoThumbnail(videoTitle.trim() || 'Facebook Video'));
    }

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
        console.warn('Metadata fetch error in edit modal:', err);
      } finally {
        setIsFetchingTitle(false);
      }
    }
  };

  // 2. Graphic edit state
  const [graphicTitle, setGraphicTitle] = useState(graphicItem?.title || '');
  const [graphicBehanceUrl, setGraphicBehanceUrl] = useState(graphicItem?.behanceUrl || '');
  const [graphicDescription, setGraphicDescription] = useState(graphicItem?.description || '');
  const [graphicImages, setGraphicImages] = useState<string[]>(
    graphicItem?.images && graphicItem.images.length > 0
      ? [...graphicItem.images]
      : graphicItem?.filename ? [graphicItem.filename] : []
  );
  const [graphicThumbIndex, setGraphicThumbIndex] = useState<number>(graphicItem?.thumbnailIndex || 0);
  const [isFetchingBehance, setIsFetchingBehance] = useState<boolean>(false);

  // Auto fetch Behance details in edit modal
  const handleEditBehanceUrlChange = async (url: string) => {
    setGraphicBehanceUrl(url);
    if (!url.trim()) return;

    if (url.includes('behance.net') || url.includes('be.net')) {
      setIsFetchingBehance(true);
      try {
        const meta = await fetchBehanceMetadata(url);
        if (meta) {
          if (!graphicTitle.trim() && meta.title) {
            setGraphicTitle(meta.title);
          }
          if (graphicImages.length === 0) {
            const thumb = meta.thumbnail || generateBehanceThumbnail(meta.title || graphicTitle || 'Behance Graphic Project', meta.author);
            setGraphicImages([thumb]);
            setGraphicThumbIndex(0);
          }
        }
      } catch (err) {
        console.warn('Error fetching Behance in edit modal:', err);
      } finally {
        setIsFetchingBehance(false);
      }
    }
  };

  // 3. Marketing edit state
  const [marketingTitle, setMarketingTitle] = useState(marketingItem?.title || '');
  const [marketingDescription, setMarketingDescription] = useState(marketingItem?.description || '');
  const [marketingPlatform, setMarketingPlatform] = useState(marketingItem?.platform || 'Meta Ads');
  const [marketingRoas, setMarketingRoas] = useState(marketingItem?.metrics?.roas || '4.5×');
  const [marketingReach, setMarketingReach] = useState(marketingItem?.metrics?.reach || '200K+');
  const [marketingSales, setMarketingSales] = useState(marketingItem?.metrics?.sales || '$15,000');
  const [marketingImages, setMarketingImages] = useState<string[]>(
    marketingItem?.images && marketingItem.images.length > 0
      ? [...marketingItem.images]
      : marketingItem?.thumbnailUrl ? [marketingItem.thumbnailUrl] : []
  );
  const [marketingThumbIndex, setMarketingThumbIndex] = useState<number>(0);

  // Handler for custom video thumbnail
  const handleVideoThumbUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const optimized = await optimizeImageFile(file, 1600, 0.88);
      setVideoThumbnailUrl(optimized);
    } catch (err) {
      console.error(err);
    }
  };

  // Handler for adding graphic images
  const handleAddGraphicImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const promises: Promise<string>[] = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(optimizeImageFile(files[i], 1800, 0.88));
      }
      const newImgs = await Promise.all(promises);
      setGraphicImages((prev) => [...prev, ...newImgs]);
    } catch (err) {
      console.error(err);
    }
  };

  // Handler for adding marketing images
  const handleAddMarketingImages = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      const promises: Promise<string>[] = [];
      for (let i = 0; i < files.length; i++) {
        promises.push(optimizeImageFile(files[i], 1800, 0.88));
      }
      const newImgs = await Promise.all(promises);
      setMarketingImages((prev) => [...prev, ...newImgs]);
    } catch (err) {
      console.error(err);
    }
  };

  // Save Video
  const handleSaveVideoItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!videoItem || !onSaveVideo) return;
    const parsed = parseVideoLink(videoLink, videoTitle);
    const updated: VideoItem = {
      ...videoItem,
      title: videoTitle.trim(),
      description: videoDescription.trim(),
      platform: parsed.platform || videoItem.platform,
      youtubeId: parsed.platform === 'youtube' ? parsed.id : (parsed.platform === 'facebook' ? '' : videoItem.youtubeId),
      facebookUrl: parsed.platform === 'facebook' ? (parsed.cleanUrl || videoLink.trim()) : (parsed.platform === 'youtube' ? undefined : videoItem.facebookUrl),
      thumbnailUrl: videoThumbnailUrl || parsed.thumbnail || videoItem.thumbnailUrl
    };
    onSaveVideo(updated);
    onClose();
  };

  // Save Graphic
  const handleSaveGraphicItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!graphicItem || !onSaveGraphic) return;
    const coverImage = graphicImages[graphicThumbIndex] || graphicImages[0] || graphicItem.filename;
    const updated: GraphicItem = {
      ...graphicItem,
      title: graphicTitle.trim(),
      description: graphicDescription.trim(),
      filename: coverImage,
      images: graphicImages.length > 0 ? graphicImages : [coverImage],
      thumbnailIndex: graphicThumbIndex,
      behanceUrl: graphicBehanceUrl.trim() || undefined
    };
    onSaveGraphic(updated);
    onClose();
  };

  // Save Marketing
  const handleSaveMarketingItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!marketingItem || !onSaveMarketing) return;
    const coverImage = marketingImages[marketingThumbIndex] || marketingImages[0] || marketingItem.thumbnailUrl;
    const updated: MarketingItem = {
      ...marketingItem,
      title: marketingTitle.trim(),
      description: marketingDescription.trim(),
      platform: marketingPlatform,
      thumbnailUrl: coverImage,
      images: marketingImages.length > 0 ? marketingImages : (coverImage ? [coverImage] : []),
      metrics: {
        roas: marketingRoas,
        reach: marketingReach,
        sales: marketingSales
      }
    };
    onSaveMarketing(updated);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="relative w-full max-w-2xl rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 text-white my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            {videoItem && <Film className="w-5 h-5 text-amber-400" />}
            {graphicItem && <Palette className="w-5 h-5 text-emerald-400" />}
            {marketingItem && <Megaphone className="w-5 h-5 text-blue-400" />}
            <h3 className="text-lg font-bold">
              প্রজেক্ট এডিট করুন (Edit Project)
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* 1. EDIT VIDEO FORM */}
        {videoItem && (
          <form onSubmit={handleSaveVideoItem} className="mt-5 space-y-4">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  ভিডিওর শিরোনাম (Title) *
                </label>
                {isFetchingTitle && (
                  <span className="text-[11px] text-amber-400 font-semibold animate-pulse flex items-center gap-1">
                    <RefreshCw className="w-3 h-3 animate-spin" />
                    টাইটেল আনা হচ্ছে...
                  </span>
                )}
              </div>
              <input
                type="text"
                required
                value={videoTitle}
                onChange={(e) => setVideoTitle(e.target.value)}
                placeholder="ভিডিওর শিরোনাম লিখুন বা লিংক দিলে অটো আসবে"
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                YouTube বা Facebook ভিডিও লিংক
              </label>
              <input
                type="url"
                value={videoLink}
                onChange={(e) => handleEditVideoLinkChange(e.target.value)}
                placeholder="https://youtu.be/... অথবা https://facebook.com/..."
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                কাস্টম থাম্বনেল (808 × 636)
              </label>
              <div className="flex items-center gap-4">
                <div className="w-24 h-16 rounded-xl bg-black overflow-hidden border border-slate-700 shrink-0" style={{ aspectRatio: '808 / 636' }}>
                  <img src={videoThumbnailUrl || 'graphic1.jpg'} alt="" className="w-full h-full object-cover" />
                </div>
                <div>
                  <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-amber-400 text-xs font-bold border border-slate-700">
                    <Upload className="w-3.5 h-3.5" />
                    <span>নতুন থাম্বনেল আপলোড করুন</span>
                    <input type="file" accept="image/*" onChange={handleVideoThumbUpload} className="hidden" />
                  </label>
                </div>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                বিবরণ / ডেসক্রিপশন (ঐচ্ছিক)
              </label>
              <textarea
                rows={3}
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-amber-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold shadow-md"
              >
                সংরক্ষণ করুন (Save Changes)
              </button>
            </div>
          </form>
        )}

        {/* 2. EDIT GRAPHICS FORM */}
        {graphicItem && (
          <form onSubmit={handleSaveGraphicItem} className="mt-5 space-y-4">
            {/* Behance Link */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-emerald-400 mb-1 flex items-center gap-1.5">
                <LinkIcon className="w-3.5 h-3.5" />
                <span>বিহান্স প্রজেক্ট লিংক (Behance Project URL)</span>
              </label>
              <div className="relative">
                <input
                  type="url"
                  placeholder="https://www.behance.net/gallery/..."
                  value={graphicBehanceUrl}
                  onChange={(e) => handleEditBehanceUrlChange(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-10"
                />
                {isFetchingBehance && (
                  <div className="absolute right-3 top-2.5 text-emerald-400">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  </div>
                )}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                ডিজাইন শিরোনাম (Title) *
              </label>
              <input
                type="text"
                required
                value={graphicTitle}
                onChange={(e) => setGraphicTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  ডিজাইন ইমেজসমূহ ({graphicImages.length}টি) • কভার সিলেক্ট করতে ছবিতে ক্লিক করুন:
                </label>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 text-xs font-bold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>আরও ছবি যোগ করুন</span>
                  <input type="file" multiple accept="image/*" onChange={handleAddGraphicImages} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                {graphicImages.map((img, idx) => {
                  const isCover = graphicThumbIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setGraphicThumbIndex(idx)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isCover ? 'border-emerald-500 shadow-md shadow-emerald-500/30' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                      style={{ aspectRatio: '808 / 636' }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {isCover && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-emerald-500 text-slate-950 text-[9px] font-black uppercase">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setGraphicImages((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 p-1 rounded bg-rose-500 text-white hover:bg-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                বিবরণ / ডেসক্রিপশন (ঐচ্ছিক)
              </label>
              <textarea
                rows={3}
                value={graphicDescription}
                onChange={(e) => setGraphicDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold shadow-md"
              >
                সংরক্ষণ করুন (Save Changes)
              </button>
            </div>
          </form>
        )}

        {/* 3. EDIT MARKETING FORM */}
        {marketingItem && (
          <form onSubmit={handleSaveMarketingItem} className="mt-5 space-y-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                ক্যাম্পেইন শিরোনাম (Title) *
              </label>
              <input
                type="text"
                required
                value={marketingTitle}
                onChange={(e) => setMarketingTitle(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  ROAS
                </label>
                <input
                  type="text"
                  value={marketingRoas}
                  onChange={(e) => setMarketingRoas(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Reach
                </label>
                <input
                  type="text"
                  value={marketingReach}
                  onChange={(e) => setMarketingReach(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                  Sales / Leads
                </label>
                <input
                  type="text"
                  value={marketingSales}
                  onChange={(e) => setMarketingSales(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-xs text-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-300">
                  বিজ্ঞাপন ক্রিয়েটিভ ইমেজসমূহ ({marketingImages.length}টি) • কভার সিলেক্ট করুন:
                </label>
                <label className="cursor-pointer inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-500/20 text-blue-400 hover:bg-blue-500/30 text-xs font-bold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>আরও ছবি যোগ করুন</span>
                  <input type="file" multiple accept="image/*" onChange={handleAddMarketingImages} className="hidden" />
                </label>
              </div>

              <div className="grid grid-cols-3 sm:grid-cols-4 gap-2.5 p-3 rounded-2xl bg-slate-950 border border-slate-800">
                {marketingImages.map((img, idx) => {
                  const isCover = marketingThumbIndex === idx;
                  return (
                    <div
                      key={idx}
                      onClick={() => setMarketingThumbIndex(idx)}
                      className={`relative rounded-xl overflow-hidden cursor-pointer border-2 transition-all ${
                        isCover ? 'border-blue-500 shadow-md shadow-blue-500/30' : 'border-slate-800 opacity-70 hover:opacity-100'
                      }`}
                      style={{ aspectRatio: '808 / 636' }}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      {isCover && (
                        <span className="absolute top-1 left-1 px-1.5 py-0.5 rounded bg-blue-500 text-white text-[9px] font-black uppercase">
                          Cover
                        </span>
                      )}
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setMarketingImages((prev) => prev.filter((_, i) => i !== idx));
                        }}
                        className="absolute top-1 right-1 p-1 rounded bg-rose-500 text-white hover:bg-rose-600"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                বিবরণ / ডেসক্রিপশন (ঐচ্ছিক)
              </label>
              <textarea
                rows={3}
                value={marketingDescription}
                onChange={(e) => setMarketingDescription(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-800">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-bold"
              >
                বাতিল (Cancel)
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md"
              >
                সংরক্ষণ করুন (Save Changes)
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};
