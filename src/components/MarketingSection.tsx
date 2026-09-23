import React, { useState } from 'react';
import { Megaphone, Target, TrendingUp, DollarSign, Users, Trash2, Heart, MessageSquare, Send, Maximize2, X, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { DEFAULT_MARKETING_WORKS } from '../data';
import { MarketingItem, CommentItem } from '../types';
import { Translations } from '../utils/translations';

interface MarketingSectionProps {
  customMarketing?: MarketingItem[];
  onOpenUploadModal?: () => void;
  onAddMarketing?: () => void;
  onDeleteMarketing?: (id: string) => void;
  t: Translations;
  showLikesAndComments?: boolean;
}

export const MarketingSection: React.FC<MarketingSectionProps> = ({
  customMarketing = [],
  onAddMarketing,
  onDeleteMarketing,
  t,
  showLikesAndComments = true
}) => {
  const [filter, setFilter] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<MarketingItem | null>(null);
  const [activeSubIndex, setActiveSubIndex] = useState<number>(0);

  // Likes & comments local state
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>({});
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const allCampaigns: MarketingItem[] = [...customMarketing, ...DEFAULT_MARKETING_WORKS];

  const platforms = [
    { id: 'all', label: t.all },
    ...(customMarketing.length > 0 ? [{ id: 'custom', label: 'Uploads' }] : []),
    { id: 'meta', label: 'Meta Ads' },
    { id: 'facebook', label: 'Facebook' }
  ];

  const filteredCampaigns = allCampaigns.filter((item) => {
    if (filter === 'all') return true;
    if (filter === 'custom') return item.isCustomUpload;
    if (filter === 'meta') return item.platform.toLowerCase().includes('meta');
    if (filter === 'facebook') return item.platform.toLowerCase().includes('facebook');
    return true;
  });

  const handleToggleLike = (id: string, initialCount = 30) => {
    const isLiked = likedMap[id];
    const current = likeCountMap[id] ?? initialCount;
    setLikedMap({ ...likedMap, [id]: !isLiked });
    setLikeCountMap({ ...likeCountMap, [id]: isLiked ? current - 1 : current + 1 });
  };

  const handleAddComment = (e: React.FormEvent, itemId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: newCommentAuthor.trim() || 'Visitor',
      text: newCommentText.trim(),
      date: 'Just now'
    };
    const list = commentsMap[itemId] || [];
    setCommentsMap({ ...commentsMap, [itemId]: [newComment, ...list] });
    setNewCommentText('');
  };

  return (
    <section id="marketing" className="py-12 sm:py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-blue-500/15 via-blue-500/20 to-indigo-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/30 shadow-xs">
                <Megaphone className="w-3.5 h-3.5 text-blue-500" />
                <span>{t.metaMarketing}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-600 dark:from-white dark:via-blue-300 dark:to-indigo-400">
                {t.marketingHeading}
              </span>
            </h2>
            <p className="mt-1 text-xs sm:text-base text-slate-600 dark:text-slate-400">
              {t.marketingSubheading}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {platforms.map((p) => (
              <button
                key={p.id}
                onClick={() => setFilter(p.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === p.id
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Grid on Both Mobile and PC with exact 808x636 Frame */}
        {filteredCampaigns.length === 0 ? (
          <div className="text-center py-14 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-blue-500/10 text-blue-500 flex items-center justify-center mb-3">
              <Megaphone className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              এখনো কোনো মেটা মার্কেটিং প্রজেক্ট যুক্ত করা হয়নি
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              আপনার নিজস্ব ফেসবুক ও ইনস্টাগ্রাম অ্যাড ক্যাম্পেইন বা ক্রিয়েটিভ ডিজাইন আপলোড করতে ওপরের "মার্কেটিং আপলোড (+)" বাটনে ক্লিক করুন।
            </p>
            {onAddMarketing && (
              <button
                type="button"
                onClick={onAddMarketing}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন মার্কেটিং প্রজেক্ট আপলোড করুন</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {filteredCampaigns.map((item) => {
            const hasMultiple = item.images && item.images.length > 1;
            const coverImage = item.images && item.images.length > 0
              ? item.images[0]
              : (item.thumbnailUrl || 'graphic1.jpg');

            const likes = likeCountMap[item.id] ?? (item.likes || 28);
            const commentsList = commentsMap[item.id] || item.comments || [];
            const isLiked = likedMap[item.id];

            return (
              <div
                key={item.id}
                className="group flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* 808 by 636 Frame Aspect Ratio */}
                <div
                  className="relative w-full bg-slate-950 overflow-hidden cursor-pointer"
                  style={{ aspectRatio: '808 / 636' }}
                  onClick={() => {
                    setActiveItem(item);
                    setActiveSubIndex(0);
                  }}
                >
                  <img
                    src={coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-black/20" />

                  {/* Platform Badge */}
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold uppercase bg-blue-600 text-white shadow-md">
                    {item.platform}
                  </span>

                  {/* Metrics Badge if available */}
                  {item.metrics?.roas && (
                    <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-extrabold bg-emerald-500 text-slate-950 shadow-md flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      <span>{item.metrics.roas} ROAS</span>
                    </span>
                  )}

                  <div className="absolute bottom-2 right-2 p-1.5 rounded-lg bg-black/60 text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base leading-snug tracking-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-blue-700 to-indigo-600 dark:from-white dark:via-blue-200 dark:to-indigo-400 group-hover:from-blue-600 group-hover:to-indigo-500 transition-all">
                        {item.title}
                      </span>
                    </h3>
                    {item.description && (
                      <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2">
                        {item.description}
                      </p>
                    )}

                    {/* Premium Tags */}
                    {item.tags && item.tags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {item.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-blue-500/10 text-blue-700 dark:text-blue-300 border border-blue-500/25 shadow-xs"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Likes & Comments Controls */}
                  {showLikesAndComments && (
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => handleToggleLike(item.id)}
                          className={`flex items-center gap-1 font-bold text-[11px] sm:text-xs transition-colors ${
                            isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                          <span>{likes}</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => setActiveCommentBox(activeCommentBox === item.id ? null : item.id)}
                          className="flex items-center gap-1 font-semibold text-[11px] sm:text-xs text-slate-500 hover:text-blue-500"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{commentsList.length}</span>
                        </button>
                      </div>

                      {item.isCustomUpload && onDeleteMarketing && (
                        <button
                          type="button"
                          onClick={() => onDeleteMarketing(item.id)}
                          className="text-rose-400 hover:text-rose-500 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expandable Comments Drawer */}
                  {showLikesAndComments && activeCommentBox === item.id && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <form onSubmit={(e) => handleAddComment(e, item.id)} className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder={t.addComment}
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        <button
                          type="submit"
                          className="px-2 py-1.5 rounded-lg bg-blue-500 text-white font-bold text-[11px]"
                        >
                          <Send className="w-3 h-3" />
                        </button>
                      </form>

                      {commentsList.length > 0 && (
                        <div className="max-h-24 overflow-y-auto space-y-1.5 text-[11px] no-scrollbar">
                          {commentsList.slice(0, 3).map((c, i) => (
                            <div key={i} className="bg-slate-50 dark:bg-slate-800/50 p-1.5 rounded-md">
                              <span className="font-bold text-slate-800 dark:text-slate-200">{c.author}: </span>
                              <span className="text-slate-600 dark:text-slate-400">{c.text}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}

                </div>
              </div>
            );
          })}
        </div>
        )}

      </div>

      {/* Lightbox for Marketing Creatives */}
      {activeItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={() => setActiveItem(null)}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setActiveItem(null)}
              className="absolute -top-10 right-0 text-white hover:text-blue-400 p-2"
            >
              <X className="w-6 h-6" />
            </button>

            {(() => {
              const images = activeItem.images && activeItem.images.length > 0
                ? activeItem.images
                : [activeItem.thumbnailUrl || 'graphic1.jpg'];
              const currentImg = images[activeSubIndex] || images[0];

              return (
                <div className="w-full flex flex-col items-center">
                  <div
                    className="relative w-full rounded-2xl overflow-hidden bg-slate-950 border border-slate-800 shadow-2xl flex items-center justify-center"
                    style={{ maxHeight: '75vh', aspectRatio: '808 / 636' }}
                  >
                    <img src={currentImg} alt="" className="w-full h-full object-contain" />

                    {images.length > 1 && (
                      <>
                        <button
                          onClick={() => setActiveSubIndex((prev) => (prev - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActiveSubIndex((prev) => (prev + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  <div className="text-center mt-3 text-white">
                    <h3 className="text-sm font-bold">{activeItem.title}</h3>
                    {activeItem.metrics?.roas && (
                      <span className="text-xs font-semibold text-emerald-400">
                        {activeItem.metrics.roas} ROAS • {activeItem.platform}
                      </span>
                    )}
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      )}
    </section>
  );
};
