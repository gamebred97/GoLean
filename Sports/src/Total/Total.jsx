import { Box, Text } from "@chakra-ui/react";

function Total({ intake }) {
  const totalCalories = intake.reduce((sum, item) => sum + item.nf_calories, 0);
  const totalProtein = intake.reduce((sum, item) => sum + item.nf_protein, 0);
  const totalCarbs = intake.reduce(
    (sum, item) => sum + item.nf_total_carbohydrate,
    0
  );
  const totalFat = intake.reduce((sum, item) => sum + item.nf_total_fat, 0);

  return (
    <>
      {intake.length > 0 && (
        <Box mt={4} p={4} bg="gray.900" borderRadius="md">
          <Text fontWeight="bold">Total:</Text>
          <Text>Calories: {totalCalories.toFixed(1)}</Text>
          <Text>Protein: {totalProtein.toFixed(1)}g</Text>
          <Text>Carbs: {totalCarbs.toFixed(1)}g</Text>
          <Text>Fat: {totalFat.toFixed(1)}g</Text>
        </Box>
      )}
    </>
  );
}

export default Total;
