import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../config/firebase-config';

/**
 * Registers a new user with email and password.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise} Firebase user credential promise.
 */
export const registerUser = (email, password) => {
    return createUserWithEmailAndPassword(auth, email, password);
};

/**
 * Logs in a user with email and password.
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @returns {Promise} Firebase user credential promise.
 */
export const loginUser = (email, password) => {
    return signInWithEmailAndPassword(auth, email, password);
};

/**
 * Logs out the currently authenticated user.
 * @returns {Promise} Promise that resolves when the user is signed out.
 */
export const logoutUser = () => {
    return signOut(auth);
};

const provider = new GoogleAuthProvider();

/**
 * Signs in the user with a Google popup.
 * @returns {Promise} Firebase user credential promise from Google login.
 */
export const googleLogin = () => {
  return signInWithPopup(auth, provider);
};