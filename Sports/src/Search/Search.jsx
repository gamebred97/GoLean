import { useState, useContext } from "react";
import {
  Input,
  Button,
  VStack,
  Box,
  Text,
  Spinner,
  HStack,
} from "@chakra-ui/react";
import { getFoodNutrition } from "../server/server";
import { translateToEnglish } from "../server/server";
import { FoodContext } from "../state/food.context.jsx";


export default function Search() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);

  const {setResult} = useContext(FoodContext);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
   
        const response = await translateToEnglish(query)
      const data = await getFoodNutrition(response);
      console.log("Fetched data:", data);
      setResult(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
      setQuery("")
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