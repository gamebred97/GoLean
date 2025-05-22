import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

/**
 * Retrieves user data by handle.
 * @param {string} username - The user's handle.
 * @returns {Promise} Promise with user data snapshot.
 */
export const getUserByHandle = (username) => {
  return get(ref(db, `users/${username}`));
};

/**
 * Creates a new user entry in the database.
 * @param {string} handle - Unique user handle.
 * @param {string} uid - Firebase user ID.
 * @param {string} email - User's email address.
 * @param {string} firstName - User's first name.
 * @param {string} lastName - User's last name.
 * @returns {Promise} Promise that resolves after setting user data.
 */
export const createUserHandle = (handle, uid, email, firstName, lastName) => {
  return set(ref(db, `users/${handle}`), {
    handle,
    uid,
    email,
    firstName,
    lastName,
    createdOn: new Date(),
    likedPosts: {}
  });
};

/**
 * Retrieves user data by Firebase UID.
 * @param {string} uid - Firebase user ID.
 * @returns {Promise<Object|null>} Promise resolving to user data or null.
 */
export const getUserData = async (uid) => {
  const snapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  return snapshot.val();
};

/**
 * Updates a user's first and last name in the database.
 * @param {string} uid - Firebase user ID.
 * @param {string} firstName - New first name.
 * @param {string} lastName - New last name.
 * @returns {Promise<void>}
 */
export const updateUserProfile = async (uid, firstName, lastName) => {
  const snapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );
  if (snapshot.exists()) {
    const users = snapshot.val();
    const handle = Object.keys(users)[0];
    const userRef = ref(db, `users/${handle}`);
    await set(userRef, {
      ...users[handle],
      firstName,
      lastName,
    });
  }
};

/**
 * Gets the database path for a user based on their UID.
 * @param {string} uid - Firebase user ID.
 * @returns {Promise<string|Object>} Path to user's data or empty object if not found.
 */
export const getUserPathByUid = async (uid) => {
  try {
    const usersQuery = query(ref(db, "users"), orderByChild("uid"), equalTo(uid));
    const snapshot = await get(usersQuery);

    if (snapshot.exists()) {
      const users = snapshot.val();
      const handle = Object.keys(users)[0];
      return `users/${handle}`; 
    } else {
      return {}; 
    }
  } catch (error) {
    console.error("Error fetching user path:", error);
  }
};