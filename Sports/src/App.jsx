import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AppContext } from "./state/app.context";
import "./App.css";
import Home from "./Home Component/Home";
import Front from "./Front/Front";
import Login from "./Access Components/Login/Login";
import Register from "./Access Components/Register/Register";
import {useAuthState}  from 'react-firebase-hooks/auth';
import { auth } from "./config/firebase-config";
import { getUserData } from "./services/users.service";
import Authenticated from "./Authenitcated/Authenitcated";
import Profile from "./Access Components/Profile/Profile";
import { FoodProvider } from "./state/food.context.jsx";
import Foods from "./hoc Foods/Foods.jsx";

function App() {
  const [appState, setAppState] = useState({
    user: null,
    userData: null,
  });

  const [user, loading, error] = useAuthState(auth);

  useEffect(() => {
    if (!user) return;

    setAppState((prev) => ({
      ...prev,
      user,
    }));

    getUserData(user.uid)
      .then(async (data) => {
        if (!data || Object.keys(data).length === 0) {
          console.log("No user data returned");
          return;
        }

        const userData = data[Object.keys(data)[0]];

        setAppState((prev) => ({
          ...prev,
          userData: {
            ...userData,
          },
        }));
      })
      .catch((error) => {
        console.error(error);
        alert("Error fetching user data.");
      });
  }, [user]);

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    console.error(error);
    return <div className="error">Error: {error.message}</div>;
  }

  return (
    <>
      <Router>
        <AppContext.Provider value={{ ...appState, setContext: setAppState }}>
          <FoodProvider>
          <Routes>
            <Route path="/" element={<Front />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/home" element={<Authenticated><Home /></Authenticated>} />
            <Route path="/profile" element={<Authenticated><Profile/></Authenticated>}/>
            <Route path="/foods" element={<Authenticated><Foods/></Authenticated>}/>
          </Routes>
          </FoodProvider>
        </AppContext.Provider>
      </Router>
    </>
  );
}

export default App;
