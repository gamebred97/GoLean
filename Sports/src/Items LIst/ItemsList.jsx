import { Box, VStack, Button, Text } from "@chakra-ui/react";
import { useEffect } from "react";

/**
 * Component to display the list of added food items with their macros.
 * Allows removal of individual items from the list.
 * 
 * @param {Object} props - Component props.
 * @param {function} props.handleRemoveList - Callback to remove a food item.
 * @param {Object} props.allFood - Object containing all food items, keyed by ID.
 * @param {function} props.handleList - Callback to fetch the list of foods.
 * 
 * @component
 * @returns {JSX.Element} The ItemsList component.
 */
function ItemsList({ handleRemoveList, allFood, handleList }) {
  useEffect(() => {
    handleList();
  }, [handleList]);


  return (
    <>
{Object.keys(allFood).length > 0 && (
  <Box mt={6}>
    <Text fontSize="md" fontWeight="bold">Added Foods:</Text>
    <VStack spacing={2} align="start">
      {Object.entries(allFood).map(([id, item]) => (
        <Box key={id} p={2} bg="gray.800" borderRadius="md" w="100%">
          <Text>{item.name}</Text>
          <Text fontSize="sm">Calories: {item.calories}</Text>
          <Text fontSize="sm">Protein: {item.protein}g</Text>
          <Text fontSize="sm">Carbs: {item.carbs}g</Text>
          <Text fontSize="sm">Fat: {item.fat}g</Text>
          <Text fontSize="xs" color="gray.400">Date: {item.date}</Text>
          <Button onClick={() => handleRemoveList({ ...item, id })}>
            Remove
          </Button>
        </Box>
      ))}
    </VStack>
  </Box>
)}
    </>
  );
}

export default ItemsList;