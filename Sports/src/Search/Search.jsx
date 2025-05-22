import { useState, useContext } from "react";
import {
  Input,
  Button,
  VStack,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { getFoodNutrition, translateToEnglish } from "../server/server";
import { FoodContext } from "../state/food.context.jsx";

/**
 * Search component that allows users to input a food query,
 * translates it to English, fetches nutritional data,
 * and updates the global food result context.
 * 
 * @component
 * @returns {JSX.Element} The search input, button, and loading spinner
 */
export default function Search() {
  /** 
   * State for user input query string.
   * @type {[string, function(string): void]}
   */
  const [query, setQuery] = useState("");

  /**
   * Loading state during async fetch operations.
   * @type {[boolean, function(boolean): void]}
   */
  const [loading, setLoading] = useState(false);

  /**
   * setResult function from FoodContext to update global food result data.
   * @type {function(any): void}
   */
  const { setResult } = useContext(FoodContext);

  /**
   * Handles the search operation:
   * - ignores empty queries,
   * - translates query to English,
   * - fetches nutrition data,
   * - updates context result state,
   * - manages loading and resets input.
   * 
   * @async
   * @function
   * @returns {Promise<void>}
   */
  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await translateToEnglish(query);
      const data = await getFoodNutrition(response);
      setResult(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setQuery("");
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack>
        <Input
          placeholder="Search foods here"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </HStack>

      {loading && <Spinner />}
    </VStack>
  );
}