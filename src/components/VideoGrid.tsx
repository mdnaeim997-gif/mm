import React, { useState } from 'react';
import { Play, ExternalLink, Youtube, Film, Video as VideoIcon, Trash2, Heart, MessageSquare, Send, Plus, X } from 'lucide-react';
import { PORTFOLIO_VIDEOS } from '../data';
import { VideoItem, CommentItem } from '../types';
import { Translations } from '../utils/translations';

interface VideoGridProps {
  customVideos?: VideoItem[];
  onOpenUploadModal?: () => void;
  onAddVideo?: () => void;
  onDeleteVideo?: (id: string) => void;
  t: Translations;
  showLikesAndComments?: boolean;
}

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

export const VideoGrid: React.FC<VideoGridProps> = ({
  customVideos = [],
  onAddVideo,
  onDeleteVideo,
  t,
  showLikesAndComments = true
}) => {
  const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  
  // Likes & comments local state
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [likeCountMap, setLikeCountMap] = useState<Record<string, number>>({});
  const [activeCommentBox, setActiveCommentBox] = useState<string | null>(null);
  const [commentsMap, setCommentsMap] = useState<Record<string, CommentItem[]>>({});
  const [newCommentAuthor, setNewCommentAuthor] = useState('');
  const [newCommentText, setNewCommentText] = useState('');

  // Video catalog: Combine default PORTFOLIO_VIDEOS with custom uploads, ensuring all showcase videos are always visible
  const allVideos: VideoItem[] = React.useMemo(() => {
    const map = new Map<string, VideoItem>();
    // Add default portfolio videos first
    PORTFOLIO_VIDEOS.forEach((v) => map.set(v.id, v));
    // Add or override with custom videos
    customVideos.forEach((v) => map.set(v.id, v));
    return Array.from(map.values());
  }, [customVideos]);

  const categories = [
    { id: 'all', label: t.all },
    { id: 'youtube', label: 'YouTube' },
    { id: 'facebook', label: 'Facebook' },
    { id: 'custom', label: 'Uploads' }
  ];

  const filteredVideos = allVideos.filter((video) => {
    if (selectedCategory === 'all') return true;
    if (selectedCategory === 'custom') return !!video.isCustomUpload;
    if (selectedCategory === 'youtube') return video.platform === 'youtube' || (!video.platform && !!video.youtubeId);
    if (selectedCategory === 'facebook') return video.platform === 'facebook' || !!video.facebookUrl;
    return true;
  });

  const handleToggleLike = (id: string, initialCount = 12) => {
    const isLiked = likedMap[id];
    const current = likeCountMap[id] ?? initialCount;
    setLikedMap({ ...likedMap, [id]: !isLiked });
    setLikeCountMap({ ...likeCountMap, [id]: isLiked ? current - 1 : current + 1 });
  };

  const handleAddComment = (e: React.FormEvent, videoId: string) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    const newComment: CommentItem = {
      id: `c_${Date.now()}`,
      author: newCommentAuthor.trim() || 'Visitor',
      text: newCommentText.trim(),
      date: 'Just now'
    };
    const list = commentsMap[videoId] || [];
    setCommentsMap({ ...commentsMap, [videoId]: [newComment, ...list] });
    setNewCommentText('');
  };

  return (
    <section id="videos" className="py-12 sm:py-20 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-amber-500/15 via-amber-500/20 to-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/30 shadow-xs">
                <Film className="w-3.5 h-3.5 text-amber-500" />
                <span>{t.videoEditing}</span>
              </div>
            </div>

            <h2 className="text-2xl sm:text-4xl font-display font-black tracking-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-amber-700 to-amber-600 dark:from-white dark:via-amber-300 dark:to-amber-400">
                {t.videosHeading}
              </span>
            </h2>
            <p className="mt-1 text-xs sm:text-base text-slate-600 dark:text-slate-400">
              {t.videosSubheading}
            </p>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Grid on Both Mobile and PC with exact 808x636 Frame */}
        <div className="grid grid-cols-2 gap-3 sm:gap-6">
          {filteredVideos.map((video) => {
            const isPlaying = playingVideoId === video.id;
            const isFacebook = video.platform === 'facebook' || !!video.facebookUrl;
            const youtubeUrl = video.youtubeId
              ? (video.isShort ? `https://youtube.com/shorts/${video.youtubeId}` : `https://youtu.be/${video.youtubeId}`)
              : null;
            const targetUrl = isFacebook ? video.facebookUrl : youtubeUrl;
            const likes = likeCountMap[video.id] ?? (video.likes || 18);
            const commentsList = commentsMap[video.id] || video.comments || [];
            const isLiked = likedMap[video.id];

            const thumbnailSrc = video.thumbnailUrl
              ? video.thumbnailUrl
              : video.youtubeId
              ? `https://img.youtube.com/vi/${video.youtubeId}/hqdefault.jpg`
              : 'graphic1.jpg';

            return (
              <div
                key={video.id}
                className="group flex flex-col rounded-2xl sm:rounded-3xl overflow-hidden bg-white dark:bg-slate-900/90 border border-slate-200/90 dark:border-slate-800/90 shadow-md hover:shadow-xl transition-all duration-300"
              >
                {/* 808 by 636 Frame Aspect Ratio */}
                <div
                  className="relative w-full bg-black overflow-hidden select-none"
                  style={{ aspectRatio: '808 / 636' }}
                >
                  {isPlaying ? (
                    <div className="relative w-full h-full">
                      {/* Close / Reset button so returning always keeps the pristine thumbnail */}
                      <button
                        type="button"
                        onClick={() => setPlayingVideoId(null)}
                        className="absolute top-2 right-2 z-20 px-2 py-1 rounded-md bg-black/80 hover:bg-rose-600 text-white text-[10px] sm:text-xs font-bold flex items-center gap-1 shadow-md transition-colors"
                        title="থাম্বনেলে ফিরে যান"
                      >
                        <X className="w-3.5 h-3.5" />
                        <span>রিসেট</span>
                      </button>

                      {video.videoUrl ? (
                        <video src={video.videoUrl} controls autoPlay className="w-full h-full object-contain bg-black" />
                      ) : (
                        <iframe
                          src={`https://www.youtube.com/embed/${video.youtubeId}?autoplay=1&rel=0&modestbranding=1`}
                          title={video.title}
                          className="w-full h-full border-0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        />
                      )}
                    </div>
                  ) : (
                    <div
                      onClick={() => {
                        // Directly open video on YouTube or Facebook in a new tab so viewers can watch immediately
                        if (targetUrl) {
                          window.open(targetUrl, '_blank');
                        } else if (video.videoUrl) {
                          setPlayingVideoId(video.id);
                        }
                      }}
                      className="relative w-full h-full cursor-pointer overflow-hidden group/screen select-none"
                    >
                      <img
                        src={thumbnailSrc}
                        alt={video.title}
                        className="absolute inset-0 w-full h-full object-cover group-hover/screen:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-black/20" />

                      {/* Dead-Center Play Icon Button on All Devices */}
                      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
                        <div className={`w-11 h-11 sm:w-16 sm:h-16 rounded-full flex items-center justify-center shadow-2xl ring-4 ring-white/25 transform group-hover/screen:scale-115 transition-all duration-300 ${
                          isFacebook
                            ? 'bg-[#1877F2] text-white shadow-blue-600/50'
                            : 'bg-rose-600 text-white shadow-rose-600/50'
                        }`}>
                          {isFacebook ? (
                            <FacebookIcon className="w-5 h-5 sm:w-7 sm:h-7 fill-current" />
                          ) : (
                            <Play className="w-5 h-5 sm:w-8 sm:h-8 fill-current translate-x-0.5" />
                          )}
                        </div>
                      </div>

                      {/* Platform Tag */}
                      <span className="absolute top-2 left-2 z-10 px-2.5 py-1 rounded-md text-[10px] sm:text-xs font-bold uppercase bg-black/70 backdrop-blur-md text-white border border-white/10 shadow-sm flex items-center gap-1">
                        {isFacebook ? (
                          <>
                            <FacebookIcon className="w-3 h-3 fill-[#1877F2]" />
                            <span>Facebook</span>
                          </>
                        ) : (
                          <>
                            <YouTubeIcon className="w-3 h-3 fill-rose-500" />
                            <span>YouTube</span>
                          </>
                        )}
                      </span>

                      {/* Direct Link button */}
                      {targetUrl && (
                        <a
                          href={targetUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="absolute top-2 right-2 p-1.5 rounded-lg bg-black/60 hover:bg-black/80 text-white backdrop-blur-md"
                          title="Open on platform"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Info */}
                <div className="p-3 sm:p-4 flex flex-col flex-1 justify-between">
                  <div>
                    <h3 className="font-display font-black text-sm sm:text-base leading-snug tracking-tight">
                      <span className="text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-amber-700 to-amber-600 dark:from-white dark:via-amber-200 dark:to-amber-400 group-hover:from-amber-600 group-hover:to-amber-500 transition-all">
                        {video.title}
                      </span>
                    </h3>
                    {video.description && (
                      <p className="mt-1 text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 line-clamp-1 sm:line-clamp-2">
                        {video.description}
                      </p>
                    )}

                    {/* Premium Tags */}
                    {video.tags && video.tags.length > 0 && (
                      <div className="mt-2.5 flex flex-wrap gap-1.5">
                        {video.tags.map((tag, tIdx) => (
                          <span
                            key={tIdx}
                            className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] sm:text-[11px] font-semibold bg-gradient-to-r from-amber-500/10 via-amber-500/15 to-amber-500/5 text-amber-700 dark:text-amber-300 border border-amber-500/25 shadow-xs"
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
                        {/* Like Button */}
                        <button
                          type="button"
                          onClick={() => handleToggleLike(video.id)}
                          className={`flex items-center gap-1 font-bold text-[11px] sm:text-xs transition-colors ${
                            isLiked ? 'text-rose-500' : 'text-slate-500 hover:text-rose-500'
                          }`}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isLiked ? 'fill-rose-500' : ''}`} />
                          <span>{likes}</span>
                        </button>

                        {/* Comment Button */}
                        <button
                          type="button"
                          onClick={() => setActiveCommentBox(activeCommentBox === video.id ? null : video.id)}
                          className="flex items-center gap-1 font-semibold text-[11px] sm:text-xs text-slate-500 hover:text-amber-500"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          <span>{commentsList.length}</span>
                        </button>
                      </div>

                      {video.isCustomUpload && onDeleteVideo && (
                        <button
                          type="button"
                          onClick={() => onDeleteVideo(video.id)}
                          className="text-rose-400 hover:text-rose-500 p-1"
                          title="Delete"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  )}

                  {/* Expandable Comments Drawer */}
                  {showLikesAndComments && activeCommentBox === video.id && (
                    <div className="mt-2.5 pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
                      <form onSubmit={(e) => handleAddComment(e, video.id)} className="flex gap-1.5">
                        <input
                          type="text"
                          placeholder={t.addComment}
                          value={newCommentText}
                          onChange={(e) => setNewCommentText(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-[11px] text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
                        />
                        <button
                          type="submit"
                          className="px-2 py-1.5 rounded-lg bg-amber-500 text-slate-950 font-bold text-[11px]"
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

      </div>
    </section>
  );
};
