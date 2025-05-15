import { get, set, ref, query, equalTo, orderByChild } from 'firebase/database';
import { db } from '../config/firebase-config';

export const getUserByHandle = (username) => {

  return get(ref(db, `users/${username}`));
};

export const createUserHandle = (handle, uid, email) => {

  return set(ref(db, `users/${handle}`), { handle, uid, email, createdOn: new Date(), likedPosts: {} })
};

export const getUserData = async (uid) => {
  const snapshot = await get(
    query(ref(db, "users"), orderByChild("uid"), equalTo(uid))
  );

  return snapshot.val();
};

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