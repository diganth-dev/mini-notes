import { Sparkles } from 'lucide-react';

export const LoadingSpinner = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-6 h-6 border-2',
    lg: 'w-10 h-10 border-3',
  };

  return (
    <div
      className={`inline-block animate-spin rounded-full border-slate-700 border-t-indigo-500 ${
        sizeClasses[size] || sizeClasses.md
      } ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export const LoadingScreen = ({ message = 'Loading Mini Notes...' }) => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#090d16] text-white px-4">
      <div className="relative flex items-center justify-center mb-6">
        {/* Glowing backdrop rings */}
        <div className="absolute w-24 h-24 rounded-full bg-indigo-500/20 blur-xl animate-pulse-glow" />
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 animate-bounce">
          <Sparkles className="w-8 h-8 text-white animate-spin" style={{ animationDuration: '4s' }} />
        </div>
      </div>
      <h3 className="text-xl font-semibold tracking-tight text-slate-100">{message}</h3>
      <p className="text-sm text-slate-400 mt-1">Syncing with secure cloud...</p>
    </div>
  );
};

export const NoteSkeleton = () => {
  return (
    <div className="glass-card rounded-2xl p-6 border border-slate-800/80 animate-shimmer relative overflow-hidden flex flex-col justify-between h-56">
      <div>
        <div className="h-5 bg-slate-800/80 rounded-md w-3/4 mb-4" />
        <div className="space-y-2.5">
          <div className="h-3.5 bg-slate-800/60 rounded-md w-full" />
          <div className="h-3.5 bg-slate-800/60 rounded-md w-5/6" />
          <div className="h-3.5 bg-slate-800/60 rounded-md w-2/3" />
        </div>
      </div>
      <div className="flex items-center justify-between pt-4 border-t border-slate-800/60">
        <div className="h-3 bg-slate-800/60 rounded-md w-24" />
        <div className="flex gap-2">
          <div className="w-7 h-7 bg-slate-800/80 rounded-lg" />
          <div className="w-7 h-7 bg-slate-800/80 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export const NotesGridSkeleton = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <NoteSkeleton key={idx} />
      ))}
    </div>
  );
};

export default LoadingScreen;
