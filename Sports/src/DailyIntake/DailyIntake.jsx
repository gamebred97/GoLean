import { useContext } from "react";
import { Box, Text, VStack, Button } from "@chakra-ui/react";
import { FoodContext } from "../state/food.context.jsx";
import { getUserPathByUid } from "../services/users.service.js";
import { AppContext } from "../state/app.context.js";
import { ref, push, remove } from "firebase/database";
import { db } from "../config/firebase-config";


function DailyIntake() {
//   const [intake, setIntake] = useState([]);

  const {intake, setIntake} = useContext(FoodContext)
  const { result, setResult } = useContext(FoodContext);
  const { user } = useContext(AppContext);

  async function addMacros(food) {
    if (!user) return;

    const uniqueUser = await getUserPathByUid(user.uid);
    if (!uniqueUser) return;

    const macroRef = ref(db, `${uniqueUser}/macros`);
    const newData = {
      name: food.food_name || "",
      calories: food.nf_calories || "",
      protein: food.nf_protein || "",
      carbs: food.nf_total_carbohydrate || "",
      fat: food.nf_total_fat || "",
    };

    try {
      const newRef = await push(macroRef, newData);
      return newRef.key;
    } catch (error) {
      console.error("Error while creating macros", error);
    }
  }

  async function handleAdd(food) {
    if (!user) return;
    const id = await addMacros(food);
    setIntake((prev) => [...prev, { ...food, id }]);
  }

  function handleRemoveSearch() {
    setResult(null);
  }

  async function handleRemoveList(foodToRemove) {
    if (!user) return;

    const uniqueUser = await getUserPathByUid(user.uid);
    if (!uniqueUser) return;

    const macroRef = ref(db, `${uniqueUser}/macros/${foodToRemove.id}`);

    try {
      await remove(macroRef);
      setIntake((prev) =>
        prev.filter((element) => element.id !== foodToRemove.id)
      );
    } catch (error) {
      console.error("Error removing macro:", error);
    }
  }

  return (
    <>
      {(result || intake.length > 0) && (
        <Box p={4} borderWidth="1px" borderRadius="md">
          {result?.foods?.map((food, idx) => (
            <Box key={idx} mb={3}>
              <Text fontWeight="bold">{food.food_name}</Text>
              <Text>Calories: {food.nf_calories.toFixed()}</Text>
              <Text>Protein: {food.nf_protein}g</Text>
              <Text>Carbs: {food.nf_total_carbohydrate}g</Text>
              <Text>Fat: {food.nf_total_fat}g</Text>
              <Button onClick={() => handleAdd(food)}>Add</Button>
              <Button onClick={handleRemoveSearch}>Remove</Button>
            </Box>
          ))}

          {intake.length > 0 && (
            <Box mt={6}>
              <Text fontSize="md" fontWeight="bold">
                Items Added:
              </Text>
              <VStack spacing={2} align="start">
                {intake.map((item, i) => (
                  <Box key={i} p={2} bg="gray.900" borderRadius="md" w="100%">
                    <Text>{item.food_name}</Text>
                    <Text fontSize="sm">Calories: {item.nf_calories}</Text>
                    <Text fontSize="sm">Protein: {item.nf_protein}g</Text>
                    <Text fontSize="sm">
                      Carbs: {item.nf_total_carbohydrate}g
                    </Text>
                    <Text fontSize="sm">Fat: {item.nf_total_fat}g</Text>
                    <Button onClick={() => handleRemoveList(item)}>
                      Remove
                    </Button>
                  </Box>
                ))}
              </VStack>
            </Box>
          )}
        </Box>
      )}
    </>
  );
}

export default DailyIntake;