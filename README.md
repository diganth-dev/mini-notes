# 📝 Mini Notes — Cloud Notes Web Application

A modern, polished, responsive personal cloud notes web application built with **React**, **Vite**, **Tailwind CSS**, and **Firebase (Authentication & Cloud Firestore)**.

---

## ✨ Features

- **Authentication**: Email & Password authentication powered by Firebase Auth.
  - Sign Up with Display Name, Email, Password, and Confirmation.
  - Sign In with validation & friendly error messages.
  - Protected routes (`/dashboard`) and public-only routes (`/login`, `/register`).
- **Cloud Firestore**:
  - Real-time synchronization via Firestore `onSnapshot`.
  - User isolation: notes stored securely at `users/{userId}/notes/{noteId}`.
  - Server timestamps (`createdAt`, `updatedAt`).
- **Modern Animated SaaS UI**:
  - Dark modern aesthetic with ambient glowing gradients.
  - Glassmorphic panels and cards.
  - Animated hero with floating mockups.
  - Note cards with hover lift effects, relative timestamps, and responsive grid (1 col mobile, 2 cols tablet, 3-4 cols desktop).
  - Smooth modal creation and editing with keyboard shortcuts (`Ctrl/Cmd + Enter` to quick-save, `Esc` to close).
  - Custom animated deletion confirmation dialog.
  - Real-time search and filter across titles and contents.
  - Animated empty states and skeleton loaders.
  - Interactive toast notification system.

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Firebase Project

### 2. Configure Firebase Environment Variables
1. Create a Firebase project in the [Firebase Console](https://console.firebase.google.com/).
2. Enable **Authentication** (enable the **Email/Password** provider).
3. Enable **Cloud Firestore Database** (start in test mode or production mode).
4. Apply the Firestore security rules below.
5. In Project Settings > General > Your apps, register a Web App to get your configuration keys.
6. Create a `.env.local` file in the root directory (refer to [.env.example](file:///.env.example)):

```bash
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 3. Deploy Firestore Security Rules
In your Firebase Console -> Firestore Database -> Rules tab, paste the rules from [firestore.rules](file:///firestore.rules):

```javascript
rules_version = '2';

service cloud.firestore {
  match /databases/{database}/documents {
    // Only authenticated users can access their own notes
    match /users/{userId}/notes/{noteId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 4. Run Development Server

```bash
npm run dev
```

### 5. Build for Production

```bash
npm run build
npm run preview
```

---

## 📂 Project Architecture

```
src/
├── components/
│   ├── ConfirmDialog.jsx      # Custom animated deletion confirmation modal
│   ├── FirebaseSetupBanner.jsx# Setup guide helper banner when credentials are unset
│   ├── Loading.jsx            # Animated loaders & card skeletons
│   ├── Navbar.jsx             # Responsive glassmorphism header & user state
│   ├── NoteCard.jsx           # Note preview card with animations & actions
│   ├── NoteModal.jsx          # Create & edit note modal with shortcuts
│   ├── Toast.jsx              # Toast notification container
│   └── ToastContext.js        # Toast hook & context
│
├── hooks/
│   ├── authContextDef.js      # Context definition for Fast Refresh
│   ├── AuthContext.jsx        # Auth state provider with Firebase listener
│   └── useAuth.js             # useAuth custom hook
│
├── pages/
│   ├── Home.jsx               # Animated SaaS landing page
│   ├── Login.jsx              # Sign In page
│   ├── Register.jsx           # Sign Up page
│   └── Dashboard.jsx          # Protected personal notes dashboard
│
├── services/
│   ├── firebase.js            # Firebase app, auth, and db initialization
│   └── notes.js               # Real-time Firestore CRUD operations
│
├── App.jsx                    # Routing & protected route guards
├── main.jsx                   # React root entry
└── index.css                  # Tailwind CSS, custom keyframes & glassmorphism
```
