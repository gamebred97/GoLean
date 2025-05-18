import { createContext, useState } from "react";

export const FoodContext = createContext();

export function FoodProvider({ children }) {
  const [result, setResult] = useState(null);
  const [intake, setIntake] = useState([])

  return (
    <FoodContext.Provider value={{ result, setResult, intake, setIntake }}>
      {children}
    </FoodContext.Provider>
  );
}