import { AppContext } from "../state/app.context";
import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase-config";

/**
 * Authenticated is a route protection wrapper.
 * It ensures that only logged-in users can access the children components.
 * If the user is not authenticated, it redirects them to the front page (`/`).
 * 
 * @param {Object} props
 * @param {JSX.Element} props.children - The protected component(s) to render.
 * @returns {JSX.Element} The children if authenticated, or a redirect/loading.
 */
export default function Authenticated({ children }) {
  // Gets user from AppContext (custom context storing app-wide user state)
  const { user } = useContext(AppContext);

  // Gets the current route path, used to redirect back after login
  const location = useLocation();

  // Gets Firebase-authenticated user and loading state
  const [firebaseUser, loading] = useAuthState(auth);

  // While Firebase is still checking auth status, show loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no user is authenticated in Firebase, redirect to front page
  if (!firebaseUser) {
    return <Navigate replace to="/" state={{ from: location }} />;
  }

  // If AppContext doesn't have user info yet, fall back to Firebase user
  const effectiveUser = user || firebaseUser;

  // If no user at all (very rare edge case), redirect
  if (!effectiveUser) {
    return <Navigate replace to="/" state={{ from: location }} />;
  }

  // User is authenticated — render the protected children
  return <>{children}</>;
}