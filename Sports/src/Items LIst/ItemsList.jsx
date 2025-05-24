import { Box, VStack, Button, Text, Flex, Image } from "@chakra-ui/react";
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
        <Box mt={6} p={4} bg="gray.800" borderRadius="md">
          <Text fontSize="30px" fontWeight="bold" mb={6}>
            Food List
          </Text>
          <Flex wrap="wrap" gap={4}>
            {Object.entries(allFood).map(([id, item]) => (
              <Box
                key={id}
                p={2}
                bg="gray.700"
                borderRadius="md"
                minW="150px"
                maxW="200px"
                 display="flex"  flexDirection="column" alignItems="center"
              >
                <Image
                  src={item.photo}
                  alt={item.photo || "Food Image"}
                  boxSize="50px"
                  objectFit="cover"
                  borderRadius="md"
                />

                <Text fontWeight="semibold">{item.name}</Text>
                <Text fontSize="sm">Calories: {item.calories}</Text>
                <Text fontSize="sm">Protein: {item.protein}g</Text>
                <Text fontSize="sm">Carbs: {item.carbs}g</Text>
                <Text fontSize="sm">Fat: {item.fat}g</Text>
                <Text fontSize="xs" color="gray.400">
                </Text>
                <Button
                  size="xs"
                  mt={2}
                  onClick={() => handleRemoveList({ ...item, id })}
                  style={{ backgroundColor: "transparent" }}
                >
                  ❌
                </Button>
              </Box>
            ))}
          </Flex>
        </Box>
      )}
    </>
  );
}

export default ItemsList;
