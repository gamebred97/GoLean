import { useState } from "react";
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

export default function Search() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
   
        const response = await translateToEnglish(query)
      const data = await getFoodNutrition(response);
      setResult(data);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <VStack spacing={4} align="stretch">
      <HStack>
        <Input
          placeholder="e.g. 1 apple, 2 boiled eggs"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button onClick={handleSearch}>Search</Button>
      </HStack>

      {loading && <Spinner />}

      {result && (
        <Box p={4} borderWidth="1px" borderRadius="md">
          {result.foods.map((food, idx) => (
            <Box key={idx} mb={3}>
              <Text fontWeight="bold">{food.food_name}</Text>
              <Text>Calories: {food.nf_calories}</Text>
              <Text>Protein: {food.nf_protein}g</Text>
              <Text>Carbs: {food.nf_total_carbohydrate}g</Text>
              <Text>Fat: {food.nf_total_fat}g</Text>
            </Box>
          ))}
        </Box>
      )}
    </VStack>
  );
}