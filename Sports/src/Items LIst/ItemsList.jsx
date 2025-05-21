import { Box, VStack, Button, Text } from "@chakra-ui/react";
import { useEffect } from "react";

function ItemsList({ handleRemoveList, allFood, handleList }) {
  useEffect(() => {
    handleList();
  }, [handleList]);

  return (
    <>
      <Box mt={6}>
        <Text fontSize="md" fontWeight="bold">
          All Foods (from DB):
        </Text>
        <VStack spacing={2} align="start">
          {allFood &&
            typeof allFood === "object" &&
            Object.entries(allFood).map(([id, item]) => (
              <Box key={id} p={2} bg="gray.800" borderRadius="md" w="100%">
                <Text>{item.name}</Text>
                <Text fontSize="sm">Calories: {item.calories}</Text>
                <Text fontSize="sm">Protein: {item.protein}g</Text>
                <Text fontSize="sm">Carbs: {item.carbs}g</Text>
                <Text fontSize="sm">Fat: {item.fat}g</Text>
                <Text fontSize="xs" color="gray.400">
                  Date: {item.date}
                </Text>
                <Button onClick={() => handleRemoveList({ ...item, id })}>
                  Remove
                </Button>
              </Box>
            ))}
        </VStack>
      </Box>
    </>
  );
}

export default ItemsList;