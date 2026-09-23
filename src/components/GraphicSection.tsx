import React, { useState, useEffect } from 'react';
import { Palette, Maximize2, X, ChevronLeft, ChevronRight, Layers, Trash2, Heart, MessageSquare, Send, Plus, ExternalLink } from 'lucide-react';
import { GRAPHIC_WORKS } from '../data';
import { GraphicItem, CommentItem } from '../types';
import { Translations } from '../utils/translations';

// Behance Icon
const BehanceBadgeIcon: React.FC<{ className?: string }> = ({ className = "w-3 h-3" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M7.799 6c-2.316 0-4.198 1.488-4.198 4.256 0 2.298 1.442 3.864 3.737 3.864.887 0 1.636-.242 2.146-.576l-.427-1.396c-.482.264-1.042.433-1.64.433-1.373 0-2.096-.921-2.096-2.221h6.634c.068-.535.121-1.077.121-1.579C12.076 7.234 10.334 6 7.799 6zm-2.48 3.511c.148-1.037.954-1.921 2.373-1.921 1.258 0 2.146.793 2.297 1.921H5.319zm12.396-1.597h-4.398V6.6h4.398v1.314zm-4.398 9.943h4.412c2.408 0 4.093-1.378 4.093-3.69 0-1.639-.894-2.766-2.348-3.235 1.139-.462 1.838-1.443 1.838-2.784 0-2.14-1.674-3.342-3.876-3.342h-4.119v13.051zm2.392-11.233h1.838c1.171 0 1.989.584 1.989 1.678 0 1.144-.818 1.748-2.022 1.748h-1.805V8.224zm0 5.097h1.972c1.385 0 2.308.647 2.308 1.942 0 1.272-.942 2.012-2.374 2.012h-1.906v-3.954z"/>
  </svg>
);

interface GraphicSectionProps {
  customGraphics?: GraphicItem[];
  onOpenUploadModal?: () => void;
  onAddGraphic?: () => void;
  onDeleteGraphic?: (id: string) => void;
  t: Translations;
  showLikesAndComments?: boolean;
}

export const GraphicSection: React.FC<GraphicSectionProps> = ({
  customGraphics = [],
  onAddGraphic,
  onDeleteGraphic,
  t,
  showLikesAndComments = true
}) => {
  const [activeGraphic, setActiveGraphic] = useState<GraphicItem | null>(null);
  const [activeSubImageIndex, setActiveSubImageIndex] = useState<number>(0);
  const [filter, setFilter] = useState<string>('all');

  // Likes & comments local state
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>({});
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  const allGraphics: GraphicItem[] = [...customGraphics, ...GRAPHIC_WORKS];

  const categories = [
    { id: 'all', label: t.all },
    ...(customGraphics.length > 0 ? [{ id: 'custom', label: 'Uploads' }] : []),
    { id: 'poster', label: 'Key Visuals' },
    { id: 'commercial', label: 'Branding' }
  ];

  const filteredGraphics = allGraphics.filter((g) => {
    if (filter === 'all') return true;
    if (filter === 'custom') return g.isCustomUpload;
    if (filter === 'poster') return g.category?.toLowerCase().includes('poster') || g.category?.toLowerCase().includes('visual');
    if (filter === 'commercial') return g.category?.toLowerCase().includes('commercial') || g.category?.toLowerCase().includes('brand');
    return true;
  });

  const openLightbox = (graphic: GraphicItem) => {
    setActiveGraphic(graphic);
    setActiveSubImageIndex(graphic.thumbnailIndex || 0);
  };

  const closeLightbox = () => {
    setActiveGraphic(null);
    setActiveSubImageIndex(0);
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!activeGraphic) return;
      const images = activeGraphic.images && activeGraphic.images.length > 0
        ? activeGraphic.images
        : [activeGraphic.filename];

      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') {
        setActiveSubImageIndex((prev) => (prev + 1) % images.length);
      }
      if (e.key === 'ArrowLeft') {
        setActiveSubImageIndex((prev) => (prev - 1 + images.length) % images.length);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeGraphic]);

  const handleToggleLike = (id: string, initialCount = 24) => {
    const isLiked = likedMap[id];
    const current = likeCountMap[id] ?? initialCount;
    setLikedMap({ ...likedMap, [id]: !isLiked });
    setLikeCountMap({ ...likeCountMap, [id]: isLiked ? current - 1 : current + 1 });
  };

  const handleAddComment = (e: React.FormEvent, graphicId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: newCommentAuthor.trim() || 'Visitor',
      text: newCommentText.trim(),
      date: 'Just now'
    };
    const list = commentsMap[graphicId] || [];
    setCommentsMap({ ...commentsMap, [graphicId]: [newComment, ...list] });
    setNewCommentText('');
  };

  return (
    <section id="graphics" className="py-12 sm:py-20 relative bg-slate-50/50 dark:bg-slate-950/40">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-emerald-500/15 via-emerald-500/20 to-teal-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/30 shadow-xs">
                <Palette className="w-3.5 h-3.5 text-emerald-500" />
                <span>{t.graphicsDesign}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-emerald-700 to-teal-600 dark:from-white dark:via-emerald-300 dark:to-teal-400">
                {t.graphicsHeading}
              </span>
            </h2>
            <p className="mt-1 text-xs sm:text-base text-slate-600 dark:text-slate-400">
              {t.graphicsSubheading}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setFilter(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filter === cat.id
                    ? 'bg-emerald-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Grid on Both Mobile and PC with exact 808x636 Frame */}
        {filteredGraphics.length === 0 ? (
          <div className="text-center py-14 px-4 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center mb-3">
              <Layers className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-800 dark:text-slate-200">
              এখনো কোনো গ্রাফিক্স ডিজাইন যুক্ত করা হয়নি
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-md mx-auto">
              আপনার তৈরি করা ফটোশপ বা ইলাস্ট্রেটর ডিজাইন আপলোড করতে ওপরের "গ্রাফিক্স আপলোড (+)" বাটনে ক্লিক করুন।
            </p>
            {onAddGraphic && (
              <button
                type="button"
                onClick={onAddGraphic}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>নতুন গ্রাফিক্স আপলোড করুন</span>
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {filteredGraphics.map((item) => {
            const hasMultiple = item.images && item.images.length > 1;
            const slideCount = item.images?.length || 1;
            const coverImage = item.images && item.images.length > 0
              ? (item.images[item.thumbnailIndex ?? 0] || item.images[0])
              : item.filename;

            const likes = likeCountMap[item.id] ?? (item.likes || 24);
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
                  onClick={() => openLightbox(item)}
                >
                  <img
                    src={coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />

                  {/* Badges: Multi-Slide & Behance */}
                  <div className="absolute top-2 left-2 flex flex-col gap-1.5 z-10">
                    {item.behanceUrl && (
                      <a
                        href={item.behanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold bg-[#0057ff] hover:bg-[#0047d4] text-white shadow-md flex items-center gap-1.5 transition-transform hover:scale-105"
                        title="Open on Behance"
                      >
                        <BehanceBadgeIcon className="w-3.5 h-3.5 fill-white" />
                        <span>Behance</span>
                        <ExternalLink className="w-2.5 h-2.5" />
                      </a>
                    )}
                    {hasMultiple && (
                      <span className="px-2 py-0.5 rounded-md text-[10px] sm:text-xs font-bold bg-black/70 backdrop-blur-md text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                        <Layers className="w-3 h-3" />
                        <span>{slideCount} {t.slidesCount}</span>
                      </span>
                    )}
                  </div>

                  {/* Expand icon */}
                  <div className="absolute bottom-2.5 right-2.5 p-2 rounded-xl bg-black/60 text-white backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity">
                    <Maximize2 className="w-3.5 h-3.5" />
                  </div>
                </div>

                {/* Card Info */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base leading-snug tracking-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-emerald-700 to-teal-600 dark:from-white dark:via-emerald-200 dark:to-teal-400 group-hover:from-emerald-600 group-hover:to-teal-500 transition-all">
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
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-emerald-500/10 text-emerald-700 dark:text-emerald-300 border border-emerald-500/25 shadow-xs"
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
                          className="flex items-center gap-1 font-semibold text-[11px] sm:text-xs text-slate-500 hover:text-emerald-500"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{commentsList.length}</span>
                        </button>
                      </div>

                      {item.isCustomUpload && onDeleteGraphic && (
                        <button
                          type="button"
                          onClick={() => onDeleteGraphic(item.id)}
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
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        />
                        <button
                          type="submit"
                          className="px-2 py-1.5 rounded-lg bg-emerald-500 text-slate-950 font-bold text-[11px]"
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

      {/* Full-Screen Lightbox Modal for Case Studies */}
      {activeGraphic && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          onClick={closeLightbox}
        >
          <div
            className="relative max-w-4xl w-full max-h-[90vh] flex flex-col items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={closeLightbox}
              className="absolute -top-10 right-0 text-white hover:text-amber-400 p-2"
            >
              <X className="w-6 h-6" />
            </button>

            {(() => {
              const images = activeGraphic.images && activeGraphic.images.length > 0
                ? activeGraphic.images
                : [activeGraphic.filename];
              const currentImg = images[activeSubImageIndex] || images[0];

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
                          onClick={() => setActiveSubImageIndex((prev) => (prev - 1 + images.length) % images.length)}
                          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90"
                        >
                          <ChevronLeft className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => setActiveSubImageIndex((prev) => (prev + 1) % images.length)}
                          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 text-white hover:bg-black/90"
                        >
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </>
                    )}
                  </div>

                  {images.length > 1 && (
                    <div className="flex items-center gap-2 mt-3 overflow-x-auto max-w-full pb-2">
                      {images.map((img, i) => (
                        <div
                          key={i}
                          onClick={() => setActiveSubImageIndex(i)}
                          className={`w-14 h-11 rounded-lg overflow-hidden cursor-pointer border-2 transition-all shrink-0 ${
                            activeSubImageIndex === i ? 'border-emerald-500 scale-105' : 'border-transparent opacity-60 hover:opacity-100'
                          }`}
                        >
                          <img src={img} alt="" className="w-full h-full object-cover" />
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="text-center mt-3 text-white flex flex-col items-center gap-1.5">
                    <h3 className="text-base font-bold">{activeGraphic.title}</h3>
                    {images.length > 1 && (
                      <span className="text-xs text-slate-400">
                        Slide {activeSubImageIndex + 1} of {images.length}
                      </span>
                    )}
                    {activeGraphic.behanceUrl && (
                      <a
                        href={activeGraphic.behanceUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0057ff] hover:bg-[#0047d4] text-white text-xs font-bold shadow-lg shadow-blue-500/30 transition-transform hover:scale-105"
                      >
                        <BehanceBadgeIcon className="w-3.5 h-3.5 fill-white" />
                        <span>বিহান্সে সম্পূর্ণ প্রজেক্ট দেখুন (View Full Project on Behance)</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
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
