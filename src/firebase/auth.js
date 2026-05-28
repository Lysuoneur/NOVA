/**
 * Firebase Authentication helpers
 * Wraps Firebase Auth SDK calls and syncs the Firestore user profile.
 */
import {
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from './config';

// ── Helpers ────────────────────────────────────────────────────────────────

/** Build the normalised user object the rest of the app expects. */
const buildUserShape = (uid, firebaseEmail, profile = {}) => ({
  id:      uid,
  name:    profile.displayName ?? firebaseEmail?.split('@')[0] ?? 'User',
  email:   firebaseEmail ?? '',
  role:    profile.role    ?? 'user',
  banned:  profile.banned  ?? false,
  phone:   profile.phone   ?? null,
  address: profile.address ?? null,
});

// ── Auth operations ────────────────────────────────────────────────────────

/**
 * Sign in with email + password.
 * Returns { token, user } matching the shape the rest of the app expects.
 */
export const loginWithEmail = async (email, password) => {
  const credential = await signInWithEmailAndPassword(auth, email, password);
  const fbUser = credential.user;

  const snap = await getDoc(doc(db, 'users', fbUser.uid));
  const profile = snap.exists() ? snap.data() : {};

  if (profile.banned) {
    await signOut(auth);
    throw new Error('Your account has been suspended. Please contact support.');
  }

  return {
    token: await fbUser.getIdToken(),
    user:  buildUserShape(fbUser.uid, fbUser.email, profile),
  };
};

/**
 * Create a new account and write a Firestore user document.
 * Returns { token, user }.
 */
export const registerWithEmail = async (name, email, password) => {
  const credential = await createUserWithEmailAndPassword(auth, email, password);
  const fbUser = credential.user;

  // Set display name on the Firebase Auth profile
  await updateProfile(fbUser, { displayName: name });

  const profile = {
    uid:         fbUser.uid,
    displayName: name,
    email,
    role:        'user',
    banned:      false,
    phone:       null,
    address:     null,
    createdAt:   serverTimestamp(),
  };

  await setDoc(doc(db, 'users', fbUser.uid), profile);

  return {
    token: await fbUser.getIdToken(),
    user:  buildUserShape(fbUser.uid, email, profile),
  };
};

/** Sign out the current user. */
export const logoutUser = async () => {
  await signOut(auth);
};

/**
 * Fetch the current user's merged profile (Firebase Auth + Firestore).
 * Returns null if no user is signed in or the document doesn't exist.
 */
export const getCurrentUserProfile = async () => {
  const fbUser = auth.currentUser;
  if (!fbUser) return null;

  const snap = await getDoc(doc(db, 'users', fbUser.uid));
  if (!snap.exists()) return null;

  return buildUserShape(fbUser.uid, fbUser.email, snap.data());
};
