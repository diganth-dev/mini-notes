import { Link } from 'react-router-dom';
import {
  Sparkles,
  Cloud,
  ShieldCheck,
  Zap,
  ArrowRight,
  Lock,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import FirebaseSetupBanner from '../components/FirebaseSetupBanner';

export const Home = () => {
  const { user, isConfigured } = useAuth();

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col justify-between overflow-hidden">
      {/* Background ambient glowing gradients */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none animate-pulse-glow" />
      <div className="absolute top-1/3 left-1/4 w-[400px] h-[350px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[400px] bg-cyan-600/10 rounded-full blur-[150px] pointer-events-none" />

      {/* Main Container */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-16 z-10 w-full">
        {!isConfigured && <FirebaseSetupBanner />}

        {/* HERO SECTION */}
        <section className="text-center pt-8 sm:pt-16 pb-12 sm:pb-20 relative">
          {/* Subtle Tag / Pill */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass-panel border border-indigo-500/30 text-indigo-300 text-xs sm:text-sm font-medium mb-6 shadow-lg shadow-indigo-500/10 animate-slide-up">
            <Sparkles className="w-4 h-4 text-indigo-400 animate-spin" style={{ animationDuration: '6s' }} />
            <span>Modern, Fast &amp; Secure Cloud Workspace</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black tracking-tight text-white mb-6 leading-[1.08] animate-slide-up">
            Mini Notes
          </h1>

          {/* Slogan */}
          <p className="text-xl sm:text-3xl font-semibold bg-gradient-to-r from-indigo-300 via-violet-200 to-cyan-300 bg-clip-text text-transparent max-w-3xl mx-auto mb-6">
            "Your thoughts. Anywhere. Anytime."
          </p>

          {/* Short Description */}
          <p className="text-base sm:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed mb-10">
            Capture your ideas, organize your thoughts, and keep everything synced in the cloud with real-time Firestore persistence.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-95"
              >
                <span>Go to Dashboard</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            ) : (
              <>
                <Link
                  to="/register"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-bold text-base shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 group active:scale-95"
                >
                  <span>Get Started</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl glass-panel hover:bg-slate-800/60 border border-slate-700/60 text-slate-200 hover:text-white font-semibold text-base transition-all duration-200 active:scale-95 flex items-center justify-center"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>

          {/* Interactive Floating Note Preview Showcase */}
          <div className="relative mt-16 sm:mt-20 max-w-5xl mx-auto">
            {/* Ambient Background Panel */}
            <div className="rounded-3xl glass-panel p-6 sm:p-8 border border-white/10 shadow-2xl relative overflow-hidden">
              <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-6">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                  <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                  <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                  <span className="text-xs text-slate-500 font-mono ml-2">mini-notes.app/workspace</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-indigo-400 font-medium">
                  <Cloud className="w-3.5 h-3.5" />
                  <span>Real-time Active</span>
                </div>
              </div>

              {/* Grid of sample cards illustrating animations */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-left">
                {/* Floating Card 1 */}
                <div className="glass-card p-5 rounded-2xl border border-indigo-500/20 shadow-lg animate-float">
                  <div className="flex items-center justify-between text-xs text-indigo-400 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Zap className="w-3.5 h-3.5" /> Ideas
                    </span>
                    <span>Just now</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mb-1.5">🚀 Launch Next Feature</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Set up Firestore real-time listeners and instant client filtering for sub-millisecond search responses.
                  </p>
                </div>

                {/* Floating Card 2 */}
                <div className="glass-card p-5 rounded-2xl border border-violet-500/20 shadow-lg animate-float-slow">
                  <div className="flex items-center justify-between text-xs text-violet-400 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Lock className="w-3.5 h-3.5" /> Security
                    </span>
                    <span>10m ago</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mb-1.5">🔐 User Isolation Rules</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Granular document rules ensuring each authenticated user can solely access their personal workspace.
                  </p>
                </div>

                {/* Floating Card 3 */}
                <div className="glass-card p-5 rounded-2xl border border-cyan-500/20 shadow-lg animate-float-reverse">
                  <div className="flex items-center justify-between text-xs text-cyan-400 mb-2 font-medium">
                    <span className="flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" /> Inspiration
                    </span>
                    <span>Today</span>
                  </div>
                  <h4 className="font-bold text-slate-100 text-sm mb-1.5">💡 Minimalist Flow</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    A distraction-free dark UI engineered for clarity, speed, and effortless capture.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES SECTION */}
        <section className="py-16 sm:py-24 border-t border-slate-800/80">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-indigo-400 mb-2">
              Why Mini Notes?
            </h2>
            <p className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Crafted for Speed &amp; Peace of Mind
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Feature 1: Cloud Synced */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-indigo-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 mb-6">
                <Cloud className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Cloud Synced</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Your notes are stored on Google Cloud Firestore with real-time listeners. Edits synchronize instantly across all your browser tabs and sessions.
              </p>
            </div>

            {/* Feature 2: Secure */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-violet-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-violet-500/10 border border-violet-500/20 flex items-center justify-center text-violet-400 mb-6">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Secure</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Protected by Firebase Authentication and server-enforced security rules. Passwords are never stored in Firestore, and nobody else can access your notes.
              </p>
            </div>

            {/* Feature 3: Simple */}
            <div className="glass-panel p-8 rounded-3xl border border-slate-800 hover:border-cyan-500/30 transition-all duration-300 hover:-translate-y-1">
              <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 mb-6">
                <Zap className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold text-white mb-3">Simple</h3>
              <p className="text-sm text-slate-400 leading-relaxed">
                Zero clutter. Fast search, intuitive keyboard shortcuts, instant modal creation, and silky smooth transitions for a frictionless note-taking experience.
              </p>
            </div>
          </div>
        </section>

        {/* BOTTOM CTA SECTION */}
        <section className="mt-8 rounded-3xl glass-panel p-8 sm:p-14 border border-indigo-500/20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/10 via-violet-500/10 to-indigo-500/10 pointer-events-none" />
          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
              Ready to organize your thoughts?
            </h2>
            <p className="text-slate-400 text-base mb-8">
              Join Mini Notes today and experience note-taking the way it was meant to be.
            </p>
            <Link
              to={user ? '/dashboard' : '/register'}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-white text-slate-950 font-bold hover:bg-slate-200 transition-all shadow-xl hover:shadow-2xl active:scale-95"
            >
              <span>{user ? 'Open Dashboard' : 'Get Started For Free'}</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-8 text-center text-xs text-slate-500 z-10">
        <p>© 2026 Mini Notes. Powered by React, Vite, Tailwind CSS &amp; Cloud Firestore.</p>
      </footer>
    </div>
  );
};

export default Home;