import { AppContext } from "../state/app.context";
import { useContext } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "../config/firebase-config";

export default function Authenticated({ children }) {
  const { user } = useContext(AppContext);
  const location = useLocation();
  const [firebaseUser, loading] = useAuthState(auth);

  // While Firebase is still loading
  if (loading) {
    return <div>Loading...</div>;
  }

  // If no Firebase user at all
  if (!firebaseUser) {
    return <Navigate replace to="/" state={{ from: location }} />;
  }

  // Use Firebase user if AppContext not ready
  const effectiveUser = user || firebaseUser;

  if (!effectiveUser) {
    return <Navigate replace to="/" state={{ from: location }} />;
  }

  return <>{children}</>;
}