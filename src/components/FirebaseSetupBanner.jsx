import { useState } from 'react';
import { AlertTriangle, Copy, Check, ChevronDown, ChevronUp } from 'lucide-react';

export const FirebaseSetupBanner = () => {
  const [copied, setCopied] = useState(false);
  const [expanded, setExpanded] = useState(false);

  const envSample = `VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=mini-notes-xyz.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=mini-notes-xyz
VITE_FIREBASE_STORAGE_BUCKET=mini-notes-xyz.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envSample);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-amber-950/40 border border-amber-500/30 text-amber-200 px-4 py-3 rounded-2xl mx-auto max-w-5xl my-4 backdrop-blur-md animate-slide-up">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-amber-500/20 rounded-xl text-amber-400 shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-amber-100">
              Firebase Configuration Required
            </h4>
            <p className="text-xs text-amber-300/80">
              Add your Firebase project keys to <code className="bg-black/30 px-1.5 py-0.5 rounded text-amber-200 font-mono">.env.local</code> to activate live Authentication and Cloud Firestore.
            </p>
          </div>
        </div>
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center gap-1 text-xs font-medium text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition"
        >
          {expanded ? 'Hide Steps' : 'Setup Guide'}
          {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
        </button>
      </div>

      {expanded && (
        <div className="mt-4 pt-3 border-t border-amber-500/20 text-xs space-y-3">
          <ol className="list-decimal list-inside space-y-1.5 text-amber-200/90">
            <li>Open the <a href="https://console.firebase.google.com/" target="_blank" rel="noreferrer" className="underline font-semibold hover:text-amber-100">Firebase Console</a> and create or select a project.</li>
            <li>Enable <strong>Authentication</strong> (Email/Password provider enabled).</li>
            <li>Create a <strong>Cloud Firestore</strong> database.</li>
            <li>In Project Settings &gt; General &gt; Your apps &gt; Web app, copy your configuration keys.</li>
            <li>Create a file named <code className="bg-black/40 px-1 py-0.5 rounded font-mono text-amber-300">.env.local</code> in the project root with the variables below:</li>
          </ol>

          <div className="relative mt-2">
            <pre className="bg-slate-950/80 p-3 rounded-xl border border-slate-800 text-slate-300 font-mono text-xs overflow-x-auto">
              {envSample}
            </pre>
            <button
              onClick={copyToClipboard}
              className="absolute top-2 right-2 flex items-center gap-1 px-2.5 py-1 bg-slate-800/90 hover:bg-slate-700 text-slate-200 rounded-lg text-xs transition"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Template'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FirebaseSetupBanner;
