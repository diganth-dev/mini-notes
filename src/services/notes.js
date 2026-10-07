import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from './firebase';

/**
 * Returns a reference to the user's notes collection: users/{userId}/notes
 */
export const getUserNotesCollection = (userId) => {
  if (!db || !userId) {
    throw new Error('Database is not initialized or user ID is missing.');
  }
  return collection(db, 'users', userId, 'notes');
};

/**
 * Subscribes in real-time to a user's notes sorted by updatedAt descending.
 * Returns an unsubscribe cleanup function.
 */
export const subscribeNotes = (userId, onData, onError) => {
  if (!isFirebaseConfigured || !db || !userId) {
    if (onError) onError(new Error('Firebase is not configured or user is missing.'));
    return () => {};
  }

  try {
    const notesRef = getUserNotesCollection(userId);
    const notesQuery = query(notesRef, orderBy('updatedAt', 'desc'));

    const unsubscribe = onSnapshot(
      notesQuery,
      (snapshot) => {
        const notesList = snapshot.docs.map((docSnap) => {
          const data = docSnap.data();
          return {
            id: docSnap.id,
            title: data.title || '',
            content: data.content || '',
            createdAt: data.createdAt,
            updatedAt: data.updatedAt,
          };
        });
        onData(notesList);
      },
      (error) => {
        // If security rules reject access, forward immediately
        if (error?.code === 'permission-denied') {
          if (onError) onError(error);
          return;
        }

        // Fallback: If index is building or ordering fails on null serverTimestamp initially
        console.warn('Subscription ordered query error, falling back to unordered:', error);
        // Retry with default snapshot without order if needed
        const fallbackUnsubscribe = onSnapshot(
          getUserNotesCollection(userId),
          (snapshot) => {
            const notesList = snapshot.docs.map((docSnap) => {
              const data = docSnap.data();
              return {
                id: docSnap.id,
                title: data.title || '',
                content: data.content || '',
                createdAt: data.createdAt,
                updatedAt: data.updatedAt,
              };
            });
            // Client-side sort by updatedAt or createdAt fallback
            notesList.sort((a, b) => {
              const timeA = a.updatedAt?.toMillis ? a.updatedAt.toMillis() : (a.createdAt?.toMillis ? a.createdAt.toMillis() : 0);
              const timeB = b.updatedAt?.toMillis ? b.updatedAt.toMillis() : (b.createdAt?.toMillis ? b.createdAt.toMillis() : 0);
              return timeB - timeA;
            });
            onData(notesList);
          },
          (fallbackErr) => {
            console.error('Notes subscription failed:', fallbackErr);
            if (onError) onError(fallbackErr);
          }
        );
        return fallbackUnsubscribe;
      }
    );

    return unsubscribe;
  } catch (error) {
    console.error('Error starting notes listener:', error);
    if (onError) onError(error);
    return () => {};
  }
};

/**
 * Creates a new note in Firestore
 */
export const createNote = async (userId, { title, content }) => {
  if (!isFirebaseConfigured || !db || !userId) {
    throw new Error('Firebase is not configured or user is unauthenticated.');
  }
  const notesRef = getUserNotesCollection(userId);
  const docRef = await addDoc(notesRef, {
    title: title.trim(),
    content: content.trim(),
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return docRef.id;
};

/**
 * Updates an existing note in Firestore
 */
export const updateNote = async (userId, noteId, { title, content }) => {
  if (!isFirebaseConfigured || !db || !userId || !noteId) {
    throw new Error('Missing parameters to update note.');
  }
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await updateDoc(noteRef, {
    title: title.trim(),
    content: content.trim(),
    updatedAt: serverTimestamp(),
  });
};

/**
 * Deletes a note in Firestore
 */
export const deleteNote = async (userId, noteId) => {
  if (!isFirebaseConfigured || !db || !userId || !noteId) {
    throw new Error('Missing parameters to delete note.');
  }
  const noteRef = doc(db, 'users', userId, 'notes', noteId);
  await deleteDoc(noteRef);
};
