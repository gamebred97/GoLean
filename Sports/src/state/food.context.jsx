import { createContext, useState } from "react";

export const FoodContext = createContext();

export function FoodProvider({ children }) {
  const [result, setResult] = useState(null);

  return (
    <FoodContext.Provider value={{ result, setResult }}>
      {children}
    </FoodContext.Provider>
  );
}