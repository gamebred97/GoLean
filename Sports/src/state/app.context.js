import { createContext } from "react";

/**
 * Global application context for storing user-related data.
 *
 * @property {Object|null} user - Authenticated user object or null.
 * @property {Object|null} userData - Additional user data from the database.
 * @property {Function} setAppState - Function to update the app state.
 * @property {string} firstName - User's first name.
 * @property {string} lastName - User's last name.
 */
export const AppContext = createContext({
    user: null,
    userData: null,
    setAppState: () => {},
    firstName: '',
    lastName: '',
});