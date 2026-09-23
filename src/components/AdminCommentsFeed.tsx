import React, { useState, useEffect } from 'react';
import { MessageCircle, Trash2, RefreshCw, Film, Palette, Megaphone, User } from 'lucide-react';
import { getAllProjectComments, deleteProjectComment, ProjectCommentEntry } from '../utils/storage';

interface AdminCommentsFeedProps {
  onCommentDeleted?: () => void;
}

export const AdminCommentsFeed: React.FC<AdminCommentsFeedProps> = ({ onCommentDeleted }) => {
  const [comments, setComments] = useState<ProjectCommentEntry[]>([]);
  const [loading, setLoading] = useState(false);

  const loadComments = async () => {
    setLoading(true);
    try {
      const items = await getAllProjectComments();
      // Sort newest first
      setComments(items.reverse());
    } catch (err) {
      console.error('Failed to load comments', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleDelete = async (projectId: string, projectType: 'video' | 'graphic' | 'marketing', commentId: string) => {
    if (!confirm('আপনি কি এই কমেন্টটি মুছে ফেলতে চান?')) return;
    try {
      await deleteProjectComment(projectId, projectType, commentId);
      await loadComments();
      if (onCommentDeleted) onCommentDeleted();
    } catch (err) {
      console.error('Failed to delete comment', err);
    }
  };

  return (
    <div className="space-y-4 p-5 sm:p-6 rounded-3xl bg-slate-900/90 border border-slate-800">
      <div className="flex items-center justify-between border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <MessageCircle className="w-5 h-5 text-amber-400" />
          <h3 className="text-sm sm:text-base font-bold text-white">
            ভিজিটরদের কমেন্ট ফিড ({comments.length}টি কমেন্ট)
          </h3>
        </div>
        <button
          type="button"
          onClick={loadComments}
          disabled={loading}
          className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors"
          title="রিফ্রেশ করুন"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
        </button>
      </div>

      {comments.length === 0 ? (
        <p className="text-xs text-slate-500 italic text-center py-6">
          এখনো কোনো কমেন্ট আসেনি। পাবলিক পোর্টফোলিওতে ভিজিটররা কমেন্ট করলে এখানে সাথে সাথে দেখা যাবে।
        </p>
      ) : (
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-1">
          {comments.map((entry) => (
            <div
              key={entry.comment.id}
              className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 flex items-start justify-between gap-3 group"
            >
              <div className="flex items-start gap-3 overflow-hidden">
                {/* Project Thumbnail */}
                <div className="w-14 h-11 rounded-lg bg-black overflow-hidden shrink-0 border border-slate-800" style={{ aspectRatio: '808 / 636' }}>
                  <img
                    src={entry.projectThumbnail || 'graphic1.jpg'}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="space-y-1 overflow-hidden">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-bold text-white flex items-center gap-1">
                      <User className="w-3 h-3 text-amber-400" />
                      {entry.comment.author || 'Visitor'}
                    </span>
                    <span className="text-[10px] text-slate-500">• {entry.comment.date}</span>
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-bold uppercase bg-slate-800 text-slate-300">
                      {entry.projectType}
                    </span>
                  </div>

                  <p className="text-xs text-slate-300 break-words">
                    "{entry.comment.text}"
                  </p>

                  <p className="text-[10px] text-slate-500 truncate">
                    প্রজেক্ট: <span className="text-slate-400 font-semibold">{entry.projectTitle}</span>
                  </p>
                </div>
              </div>

              {/* Delete Comment */}
              <button
                type="button"
                onClick={() => handleDelete(entry.projectId, entry.projectType, entry.comment.id)}
                className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500 hover:text-white transition-colors opacity-80 group-hover:opacity-100 shrink-0"
                title="কমেন্ট মুছুন"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
