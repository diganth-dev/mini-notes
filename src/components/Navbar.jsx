import { Link, useNavigate, useLocation } from 'react-router-dom';
import { NotebookPen, LogOut, Cloud, Sparkles, ArrowRight } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from './ToastContext';

export const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { showToast } = useToast();

  const handleLogout = async () => {
    try {
      await logout();
      showToast('Logged out successfully', 'info');
      navigate('/');
    } catch (error) {
      showToast('Failed to log out: ' + error.message, 'error');
    }
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname === '/dashboard';

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-white/[0.06] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link
          to="/"
          className="flex items-center gap-2.5 group transition-transform active:scale-95"
        >
          <div className="relative">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-violet-500 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 group-hover:scale-105 transition-all duration-300">
              <NotebookPen className="w-5 h-5 text-white" />
            </div>
            <span className="absolute -bottom-1 -right-1 flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
          </div>

          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-bold tracking-tight text-white group-hover:text-indigo-300 transition-colors">
                Mini Notes
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-medium bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <Cloud className="w-2.5 h-2.5" /> Cloud
              </span>
            </div>
          </div>
        </Link>

        {/* Right Section Actions */}
        <div className="flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {/* User badge */}
              <div className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-800 text-slate-300 text-xs">
                <div className="w-6 h-6 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-semibold text-xs border border-indigo-500/30">
                  {user.displayName
                    ? user.displayName.charAt(0).toUpperCase()
                    : user.email
                    ? user.email.charAt(0).toUpperCase()
                    : 'U'}
                </div>
                <span className="max-w-[120px] sm:max-w-[180px] truncate font-medium text-slate-200">
                  {user.displayName || user.email}
                </span>
              </div>

              {/* Navigation button depending on current page */}
              {!isDashboard && (
                <Link
                  to="/dashboard"
                  className="px-3.5 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/40 transition-all flex items-center gap-1.5 active:scale-95"
                >
                  Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}

              {/* Logout button */}
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs sm:text-sm font-medium text-slate-300 hover:text-white bg-slate-900/60 hover:bg-rose-500/20 border border-slate-800 hover:border-rose-500/40 rounded-xl transition-all duration-200 active:scale-95"
                title="Log out of Mini Notes"
              >
                <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-400" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              {!isAuthPage && (
                <>
                  <Link
                    to="/login"
                    className="px-3.5 py-2 text-xs sm:text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/60 rounded-xl transition active:scale-95"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-all active:scale-95 flex items-center gap-1.5"
                  >
                    <span>Get Started</span>
                    <Sparkles className="w-3.5 h-3.5" />
                  </Link>
                </>
              )}

              {location.pathname === '/login' && (
                <Link
                  to="/register"
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition"
                >
                  Create Account
                </Link>
              )}

              {location.pathname === '/register' && (
                <Link
                  to="/login"
                  className="px-4 py-2 text-xs sm:text-sm font-medium text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 rounded-xl transition"
                >
                  Sign In
                </Link>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;