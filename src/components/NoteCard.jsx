import { Pencil, Trash2, Clock } from 'lucide-react';

const formatTimestamp = (timestamp) => {
  if (!timestamp) return 'Just now';

  try {
    let date;
    if (timestamp.toDate && typeof timestamp.toDate === 'function') {
      date = timestamp.toDate();
    } else if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp instanceof Date) {
      date = timestamp;
    } else {
      date = new Date(timestamp);
    }

    if (isNaN(date.getTime())) return 'Recently';

    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffSec < 60) return 'Just now';
    if (diffMin < 60) return `${diffMin}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;

    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
    });
  } catch {
    return 'Recently';
  }
};

export const NoteCard = ({ note, index = 0, onEdit, onDelete }) => {
  const isUpdated = Boolean(note.updatedAt && note.createdAt && note.updatedAt !== note.createdAt);
  const timeLabel = isUpdated ? 'Updated' : 'Created';
  const displayTime = formatTimestamp(note.updatedAt || note.createdAt);

  return (
    <div
      style={{ animationDelay: `${Math.min(index * 60, 600)}ms` }}
      className="group relative flex flex-col justify-between rounded-2xl glass-card p-6 border border-slate-800/80 hover:border-indigo-500/40 shadow-lg hover:shadow-2xl hover:shadow-indigo-500/10 hover:-translate-y-1.5 transition-all duration-300 animate-slide-up"
    >
      {/* Decorative top accent line with subtle gradient */}
      <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-indigo-500/30 to-transparent group-hover:via-indigo-400 group-hover:h-[2px] transition-all" />

      {/* Note Body */}
      <div>
        <h3 className="text-lg font-bold text-slate-100 group-hover:text-indigo-200 transition-colors line-clamp-2 leading-snug break-words">
          {note.title || 'Untitled Note'}
        </h3>

        <p className="mt-3 text-sm text-slate-400 leading-relaxed line-clamp-5 whitespace-pre-wrap break-words">
          {note.content || <span className="italic text-slate-600">No content provided</span>}
        </p>
      </div>

      {/* Note Footer */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-1.5" title={`${timeLabel} ${displayTime}`}>
          <Clock className="w-3.5 h-3.5 text-slate-500 shrink-0" />
          <span>{displayTime}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1.5 opacity-90 sm:opacity-80 sm:group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit(note)}
            className="p-2 rounded-xl text-slate-400 hover:text-indigo-300 hover:bg-indigo-500/10 border border-transparent hover:border-indigo-500/20 transition-all active:scale-95"
            aria-label={`Edit ${note.title}`}
            title="Edit note"
          >
            <Pencil className="w-4 h-4" />
          </button>

          <button
            onClick={() => onDelete(note)}
            className="p-2 rounded-xl text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 border border-transparent hover:border-rose-500/20 transition-all active:scale-95"
            aria-label={`Delete ${note.title}`}
            title="Delete note"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NoteCard;
