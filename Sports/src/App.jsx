import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppContext } from "./state/app.context";
import "./App.css";
import Home from "./Home Component/Home";
import Front from "./Front/Front";
import Login from "./Access Components/Login/Login";
import Register from "./Access Components/Register/Register";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./config/firebase-config";
import { getUserData } from "./services/users.service";
import Authenticated from "./Authenitcated/Authenitcated";
import Profile from "./Access Components/Profile/Profile";
import { FoodProvider } from "./state/food.context.jsx";
import Foods from "./hoc Foods/Foods.jsx";

/**
 * The root component of the application.
 * Sets up routing, Firebase authentication, and global app context.
 * 
 * @returns {JSX.Element} The full React app wrapped in routing and context providers.
 */
function App() {
  // Local state to store the current authenticated user and their userData
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  // Firebase authentication hook
  const [user, loading, error] = useAuthState(auth);

  /**
 * Effect to synchronize app state with Firebase auth user and fetch user profile data.
 *
 * Runs whenever the Firebase `user` object changes.
 * 
 * Workflow:
 * - If there is no logged-in user (`user` is null), do nothing and exit early.
 * - When a user logs in, update `appState.user` to the current Firebase user.
 * - Then, fetch additional user profile data from the database using the user's UID.
 * - If user data exists in the database, update `appState.userData` with that data.
 * - If no data is found, log a message but do not update `userData`.
 * - Catch and log any errors during data fetching, and alert the user.
 */
useEffect(() => {
  if (!user) return;

  // Update appState with the authenticated Firebase user info
  setAppState((prev) => ({
    ...prev,
    user,
  }));

  // Fetch user profile data from the database by UID
  getUserData(user.uid)
    .then(async (data) => {
      // If no data found, log a message and skip update
      if (!data || Object.keys(data).length === 0) {
        console.log("No user data returned");
        return;
      }

      // Extract the actual user data object (key is the handle)
      const userData = data[Object.keys(data)[0]];

      // Update appState with user profile data
      setAppState((prev) => ({
        ...prev,
        userData: {
          ...userData,
        },
      }));
    })
    .catch((error) => {
      // Log and notify on any errors while fetching user data
      console.error(error);
      alert("Error fetching user data.");
    });
}, [user]);

  // Show loading state while Firebase checks authentication
  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  // Show error if authentication fails
  if (error) {
    console.error(error);
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <Router>
      {/* Provide app-wide user context and food state */}
      <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
        <FoodProvider>
          <Routes>
            <Route path="/" element={<Front />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Authenticated><Home /></Authenticated>} />
            <Route path="/profile" element={<Authenticated><Profile /></Authenticated>} />
            <Route path="/foods" element={<Authenticated><Foods /></Authenticated>} />
          </Routes>
        </FoodProvider>
      </AppContext.Provider>
    </Router>
  );
}

export default App;