import { createContext, useState } from "react";

/**
 * Context to store and manage food-related data,
 * including calculation results and food intake list.
 * 
 * @typedef {Object} FoodContextType
 * @property {any} result - The result of a food-related calculation or query (can be null initially)
 * @property {function(any): void} setResult - Function to update the result state
 * @property {Array<Object>} intake - Array representing the current list of food intake items
 * @property {function(Array<Object>): void} setIntake - Function to update the intake array
 */

/** 
 * React Context for food data management.
 * @type {React.Context<FoodContextType>}
 */
export const FoodContext = createContext();

/**
 * Provider component to wrap parts of the app that need access
 * to food-related state: `result` and `intake`.
 * 
 * @param {Object} props
 * @param {React.ReactNode} props.children - React children components
 * @returns {JSX.Element} FoodContext provider wrapping children
 */
export function FoodProvider({ children }) {
  /** 
   * Result state, e.g., for nutrition calculations or queries.
   * @type {any}
   */
  const [result, setResult] = useState(null);

  /**
   * Array of food intake entries.
   * Each item is expected to be an object describing a food intake.
   * @type {Array<Object>}
   */
  const [intake, setIntake] = useState([]);

  return (
    <FoodContext.Provider value={{ result, setResult, intake, setIntake }}>
      {children}
    </FoodContext.Provider>
  );
}