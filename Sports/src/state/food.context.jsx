import { createContext, useEffect, useState } from "react";
import { ref, get } from "firebase/database";
import { db } from "../config/firebase-config";
import { getUserPathByUid } from "../services/users.service";
import { useContext } from "react";
import { AppContext } from "./app.context";

export const FoodContext = createContext();

export function FoodProvider({ children }) {
  const [result, setResult] = useState(null);
  const [intake, setIntake] = useState([]);
  const { user } = useContext(AppContext);

  useEffect(() => {
    async function fetchIntakeFromDB() {
      if (!user) return;
      const uniqueUser = await getUserPathByUid(user.uid);
      if (!uniqueUser) return;

      const macrosRef = ref(db, `${uniqueUser}/macros`);

      try {
        const snapshot = await get(macrosRef);
        if (snapshot.exists()) {
          const rawData = snapshot.val();
          const intakeList = Object.entries(rawData).map(([id, item]) => ({
            ...item,
            id,
          }));
          setIntake(intakeList);
        }
      } catch (error) {
        console.error("Failed to load intake from Firebase:", error);
      }
    }

    fetchIntakeFromDB();
  }, [user]);

  return (
      <FoodContext.Provider value={{ result, setResult, intake, setIntake }}>
        {children}
      </FoodContext.Provider>
  );
}
