import { useState, useEffect, useRef, useCallback } from 'react';
import { X, Save, Sparkles, AlertCircle } from 'lucide-react';
import { LoadingSpinner } from './Loading';

const NoteModalContent = ({ onClose, onSave, initialData, isLoading }) => {
  const [title, setTitle] = useState(initialData?.title || '');
  const [content, setContent] = useState(initialData?.content || '');
  const [error, setError] = useState('');
  const titleInputRef = useRef(null);

  const isEdit = Boolean(initialData && initialData.id);

  const handleSubmit = useCallback(
    async (e) => {
      if (e) e.preventDefault();
      if (!title.trim()) {
        setError('Please provide a title for your note.');
        titleInputRef.current?.focus();
        return;
      }
      setError('');
      await onSave({ title: title.trim(), content: content.trim() });
    },
    [title, content, onSave]
  );

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !isLoading) {
        handleSubmit(e);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLoading, onClose, handleSubmit]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => !isLoading && onClose()}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog Card */}
      <div className="relative w-full max-w-2xl rounded-3xl glass-panel border border-slate-700/60 shadow-2xl overflow-hidden animate-scale-in z-10 my-8">
        {/* Header Accent Glow */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500" />

        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-slate-800/80">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                {isEdit ? 'Edit Note' : 'Create New Note'}
              </h2>
              <p className="text-xs text-slate-400">
                {isEdit ? 'Update your note content and sync changes' : 'Capture your thoughts and sync to the cloud'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition disabled:opacity-40"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-950/50 border border-rose-500/30 text-rose-300 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {/* Title Field */}
          <div>
            <label htmlFor="note-title" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Note Title
            </label>
            <input
              id="note-title"
              ref={titleInputRef}
              type="text"
              autoFocus
              value={title}
              onChange={(e) => {
                setTitle(e.target.value);
                if (error) setError('');
              }}
              placeholder="e.g. System Architecture Notes"
              disabled={isLoading}
              maxLength={120}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-base outline-none transition"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Required</span>
              <span>{title.length}/120</span>
            </div>
          </div>

          {/* Content Field */}
          <div>
            <label htmlFor="note-content" className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
              Content / Details
            </label>
            <textarea
              id="note-content"
              rows={9}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start typing your ideas, snippets, to-dos, or checklists..."
              disabled={isLoading}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm outline-none transition resize-none leading-relaxed"
            />
            <div className="flex justify-between text-[11px] text-slate-500 mt-1">
              <span>Tip: Press Ctrl + Enter to save quickly</span>
              <span>{content.length} characters</span>
            </div>
          </div>

          {/* Modal Footer Actions */}
          <div className="pt-4 border-t border-slate-800/80 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800/60 transition active:scale-95 disabled:opacity-40"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2.5 rounded-xl text-sm font-semibold bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
            >
              {isLoading ? (
                <>
                  <LoadingSpinner size="sm" />
                  <span>Saving...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>{isEdit ? 'Update Note' : 'Save Note'}</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export const NoteModal = ({
  isOpen,
  onClose,
  onSave,
  initialData = null,
  isLoading = false,
}) => {
  if (!isOpen) return null;

  return (
    <NoteModalContent
      onClose={onClose}
      onSave={onSave}
      initialData={initialData}
      isLoading={isLoading}
    />
  );
};

export default NoteModal;
