import { useState, useEffect, useMemo } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Plus,
  Search,
  X,
  FileText,
  Sparkles,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../components/ToastContext';
import {
  subscribeNotes,
  createNote,
  updateNote,
  deleteNote,
} from '../services/notes';
import NoteCard from '../components/NoteCard';
import NoteModal from '../components/NoteModal';
import ConfirmDialog from '../components/ConfirmDialog';
import { NotesGridSkeleton } from '../components/Loading';
import FirebaseSetupBanner from '../components/FirebaseSetupBanner';

export const Dashboard = () => {
  const { user, loading: authLoading, isConfigured } = useAuth();
  const { showToast } = useToast();

  const [notes, setNotes] = useState([]);
  const [loadingNotes, setLoadingNotes] = useState(() => Boolean(user?.uid));
  const [firestoreError, setFirestoreError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [modalSaving, setModalSaving] = useState(false);

  // Delete dialog states
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deletingNote, setDeletingNote] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Real-time Firestore listener
  useEffect(() => {
    if (!user || !user.uid) {
      return;
    }

    const unsubscribe = subscribeNotes(
      user.uid,
      (updatedNotes) => {
        setNotes(updatedNotes);
        setLoadingNotes(false);
      },
      (error) => {
        console.group('[Mini Notes Firestore Diagnostic]');
        console.log('Project ID:', 'note-df83b');
        console.log('Authenticated User UID:', user.uid);
        console.log('Target Path:', `users/${user.uid}/notes`);
        console.log('Error Code:', error?.code);
        console.log('Error Message:', error?.message);
        console.groupEnd();

        const isPermission =
          error?.code === 'permission-denied' ||
          error?.message?.includes('permission-denied') ||
          error?.message?.includes('insufficient permissions');

        setFirestoreError(
          isPermission
            ? 'Permission denied (permission-denied: Missing or insufficient permissions). Your Firestore Security Rules currently reject read/write operations for this collection path.'
            : `Unable to sync notes from Cloud Firestore: ${error?.message || 'Network error'}`
        );
        setLoadingNotes(false);
      }
    );

    return () => {
      if (unsubscribe && typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, [user]);

  // Filter notes by search query across title & content
  const filteredNotes = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return notes;
    return notes.filter((n) => {
      const titleMatch = (n.title || '').toLowerCase().includes(q);
      const contentMatch = (n.content || '').toLowerCase().includes(q);
      return titleMatch || contentMatch;
    });
  }, [notes, searchQuery]);

  // Auth redirect check
  if (!authLoading && !user) {
    return <Navigate to="/login" replace />;
  }

  // Handle Note Save (Create or Update)
  const handleSaveNote = async ({ title, content }) => {
    if (!user) return;
    setModalSaving(true);
    try {
      if (editingNote && editingNote.id) {
        await updateNote(user.uid, editingNote.id, { title, content });
        showToast('Note updated successfully!');
      } else {
        await createNote(user.uid, { title, content });
        showToast('Note created successfully!');
      }
      setIsModalOpen(false);
      setEditingNote(null);
    } catch (err) {
      console.error('Error saving note:', err);
      showToast(err.message || 'Failed to save note. Please try again.', 'error');
    } finally {
      setModalSaving(false);
    }
  };

  // Open Edit Modal
  const handleOpenEdit = (note) => {
    setEditingNote(note);
    setIsModalOpen(true);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setEditingNote(null);
    setIsModalOpen(true);
  };

  // Open Delete Confirmation
  const handleOpenDelete = (note) => {
    setDeletingNote(note);
    setIsDeleteDialogOpen(true);
  };

  // Confirm Delete
  const handleConfirmDelete = async () => {
    if (!user || !deletingNote) return;
    setIsDeleting(true);
    try {
      await deleteNote(user.uid, deletingNote.id);
      showToast('Note deleted successfully!', 'info');
      setIsDeleteDialogOpen(false);
      setDeletingNote(null);
    } catch (err) {
      console.error('Error deleting note:', err);
      showToast(err.message || 'Failed to delete note.', 'error');
    } finally {
      setIsDeleting(false);
    }
  };

  const displayName =
    user?.displayName || (user?.email ? user.email.split('@')[0] : 'Notes Creator');

  return (
    <div className="min-h-[calc(100vh-4rem)] pb-16 relative">
      {/* Ambient background glows */}
      <div className="absolute top-10 left-1/3 w-[500px] h-[350px] bg-indigo-600/10 rounded-full blur-[130px] pointer-events-none animate-pulse-glow" />
      <div className="absolute bottom-20 right-1/4 w-[400px] h-[300px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        {!isConfigured && <FirebaseSetupBanner />}

        {/* Dashboard Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Personal Workspace</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              Welcome back, {displayName} 👋
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              {notes.length === 0
                ? 'Your canvas is clear. Create your first note anytime.'
                : `You have ${notes.length} ${notes.length === 1 ? 'note' : 'notes'} synced with the cloud.`}
            </p>
          </div>

          {/* Action Row: Search & Create Button */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            {/* Search Input */}
            <div className="relative min-w-[240px] sm:min-w-[280px]">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                <Search className="w-4 h-4" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search notes by keyword..."
                className="w-full pl-10 pr-9 py-2.5 rounded-xl bg-slate-900/80 border border-slate-800 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 text-white placeholder-slate-500 text-sm outline-none transition"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300 transition"
                  aria-label="Clear search query"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Create Note Button */}
            <button
              onClick={handleOpenCreate}
              className="px-5 py-2.5 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center justify-center gap-2 active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Create Note</span>
            </button>
          </div>
        </div>

        {/* Firestore Error Alert */}
        {firestoreError && (
          <div className="my-6 p-4 rounded-2xl bg-rose-950/60 border border-rose-500/40 text-rose-300 flex items-start justify-between gap-3 animate-slide-up">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-semibold text-sm text-rose-200">Cloud Sync Warning</h4>
                <p className="text-xs text-rose-300/90 mt-0.5 leading-relaxed">{firestoreError}</p>
              </div>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="p-1.5 rounded-lg text-rose-400 hover:text-rose-200 hover:bg-rose-500/20 transition shrink-0"
              title="Refresh connection"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Notes Content Section */}
        <section className="mt-8">
          {/* Real-time Loading Skeleton */}
          {loadingNotes ? (
            <NotesGridSkeleton count={6} />
          ) : notes.length === 0 ? (
            /* EMPTY STATE: 0 notes in database */
            <div className="py-20 flex flex-col items-center justify-center text-center rounded-3xl glass-panel border border-dashed border-slate-800/80 p-8 sm:p-12 animate-fade-in relative overflow-hidden">
              <div className="relative mb-6">
                <div className="w-20 h-20 rounded-3xl bg-indigo-600/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 animate-float shadow-xl shadow-indigo-500/10">
                  <FileText className="w-10 h-10" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-violet-500/20 flex items-center justify-center text-violet-400 animate-pulse">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              <h2 className="text-2xl font-bold text-white mb-2">
                No notes yet
              </h2>
              <p className="text-slate-400 text-sm max-w-md mb-8 leading-relaxed">
                Create your first note and start capturing your ideas, plans, and snippets in the cloud.
              </p>

              <button
                onClick={handleOpenCreate}
                className="px-6 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 transition-all flex items-center gap-2 active:scale-95 group"
              >
                <Plus className="w-4 h-4 group-hover:rotate-90 transition-transform duration-200" />
                <span>Create Your First Note</span>
              </button>
            </div>
          ) : filteredNotes.length === 0 ? (
            /* EMPTY SEARCH STATE */
            <div className="py-16 flex flex-col items-center justify-center text-center rounded-2xl glass-panel border border-slate-800/80 p-8 animate-fade-in">
              <div className="w-14 h-14 rounded-2xl bg-slate-800/60 flex items-center justify-center text-slate-400 mb-4">
                <Search className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-bold text-white mb-1">
                No notes matched "{searchQuery}"
              </h3>
              <p className="text-xs text-slate-400 mb-5 max-w-sm">
                Try searching for a different keyword or title.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-slate-800 hover:bg-slate-700 text-slate-200 transition active:scale-95"
              >
                Clear Search
              </button>
            </div>
          ) : (
            /* NOTES RESPONSIVE GRID: Desktop 3 or 4 cols, Tablet 2, Mobile 1 */
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredNotes.map((note, idx) => (
                <NoteCard
                  key={note.id}
                  note={note}
                  index={idx}
                  onEdit={handleOpenEdit}
                  onDelete={handleOpenDelete}
                />
              ))}
            </div>
          )}
        </section>
      </div>

      {/* Note Creation / Editing Modal */}
      <NoteModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingNote(null);
        }}
        onSave={handleSaveNote}
        initialData={editingNote}
        isLoading={modalSaving}
      />

      {/* Note Delete Confirmation Dialog */}
      <ConfirmDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setDeletingNote(null);
        }}
        onConfirm={handleConfirmDelete}
        title="Delete Note"
        message={`Are you sure you want to delete "${deletingNote?.title || 'this note'}"? This action cannot be undone.`}
        confirmText="Delete Note"
        cancelText="Cancel"
        isLoading={isDeleting}
      />
    </div>
  );
};

export default Dashboard;
