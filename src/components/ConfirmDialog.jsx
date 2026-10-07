import { useEffect } from 'react';
import { Trash2, X } from 'lucide-react';
import { LoadingSpinner } from './Loading';

export const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Delete Note',
  message = 'Are you sure you want to delete this note? This action cannot be undone.',
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isLoading = false,
}) => {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, isLoading, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={() => !isLoading && onClose()}
        className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity animate-fade-in"
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-md rounded-3xl glass-panel border border-slate-700/60 shadow-2xl overflow-hidden animate-scale-in z-10 p-6">
        {/* Glow accent */}
        <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-rose-500 via-rose-600 to-rose-500" />

        <div className="flex items-start gap-4">
          <div className="p-3 rounded-2xl bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
            <Trash2 className="w-6 h-6" />
          </div>

          <div className="flex-1 pr-6">
            <h3 className="text-lg font-bold text-white leading-tight">
              {title}
            </h3>
            <p className="mt-2 text-sm text-slate-400 leading-relaxed">
              {message}
            </p>
          </div>

          <button
            onClick={onClose}
            disabled={isLoading}
            className="absolute top-5 right-5 p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition disabled:opacity-40"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2.5 rounded-xl text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/80 transition active:scale-95 disabled:opacity-40"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-600/30 hover:shadow-rose-600/50 transition-all active:scale-95 flex items-center gap-2 disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <LoadingSpinner size="sm" />
                <span>Deleting...</span>
              </>
            ) : (
              <>
                <Trash2 className="w-4 h-4" />
                <span>{confirmText}</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmDialog;
