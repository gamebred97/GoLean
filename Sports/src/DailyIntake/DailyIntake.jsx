import { useContext, useState, useCallback } from "react";
import { Box, Text, VStack, Button, Image } from "@chakra-ui/react";
import { FoodContext } from "../state/food.context.jsx";
import { getUserPathByUid } from "../services/users.service.js";
import { AppContext } from "../state/app.context.js";
import { ref, push, remove, get } from "firebase/database";
import { db } from "../config/firebase-config";
import moment from "moment";
import ItemsList from "../Items LIst/ItemsList.jsx";
import Search from "../Search/Search.jsx";

/**
 * Component for displaying and managing daily food intake.
 * Shows search results, allows adding foods to intake,
 * lists all stored macros, and allows removal.
 *
 * @component
 * @returns {JSX.Element} The DailyIntake component.
 */
function DailyIntake() {
  const { intake, setIntake, result, setResult } = useContext(FoodContext);
  const { user } = useContext(AppContext);
  const [allFood, setAllFood] = useState({});

  /**
   * Fetch all macros data from Firebase for the current user
   * and update the allFood state.
   *
   * @async
   * @function
   */
  const handleList = useCallback(async () => {
    if (!user) return;
    const uniqueUser = await getUserPathByUid(user.uid);
    if (!uniqueUser) return;

    const macrosRef = ref(db, `${uniqueUser}/macros`);
    try {
      const snapshot = await get(macrosRef);
      if (snapshot.exists()) {
        setAllFood(snapshot.val());
      } else {
        setAllFood({});
      }
    } catch (error) {
      console.error("Error fetching macros:", error);
      setAllFood({});
    }
  }, [user]);

  /**
   * Add a food macro entry to Firebase for the current user.
   *
   * @async
   * @function
   * @param {Object} food - The food object containing nutrition info.
   * @param {string} food.food_name - Name of the food.
   * @param {number} food.nf_calories - Calories.
   * @param {number} food.nf_protein - Protein amount.
   * @param {number} food.nf_total_carbohydrate - Carbohydrate amount.
   * @param {number} food.nf_total_fat - Fat amount.
   * @returns {Promise<string|undefined>} The new database key if successful.
   */
  async function addMacros(food) {
    if (!user) return;

    const uniqueUser = await getUserPathByUid(user.uid);
    if (!uniqueUser) return;

    const macroRef = ref(db, `${uniqueUser}/macros`);
    const newData = {
      photo: food.photo.highres,
      name: food.food_name || "",
      calories: food.nf_calories || "",
      protein: food.nf_protein || "",
      carbs: food.nf_total_carbohydrate || "",
      fat: food.nf_total_fat || "",
      date: moment().format("LLL"),
    };

    try {
      const newRef = await push(macroRef, newData);
      return newRef.key;
    } catch (error) {
      console.error("Error while creating macros", error);
    }
  }

  /**
   * Handle adding a food from search results to the intake and database.
   *
   * @async
   * @function
   * @param {Object} food - The food item to add.
   */
  async function handleAdd(food) {
    if (!user) return;
    const id = await addMacros(food);
    setIntake((prev) => [...prev, { ...food, id }]);
    handleList();
  }

  /**
   * Remove the current search results from the UI.
   *
   * @function
   */
  function handleRemoveSearch() {
    setResult(null);
  }

  /**
   * Remove a food item from Firebase and update intake and local state.
   *
   * @async
   * @function
   * @param {Object} foodToRemove - The food item to remove.
   * @param {string} foodToRemove.id - The ID of the food item in Firebase.
   */
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

      setAllFood((prev) => {
        const updated = { ...prev };
        delete updated[foodToRemove.id];
        return updated;
      });
    } catch (error) {
      console.error("Error removing macro:", error);
    }
  }

  return (
    <>
      <Box
        p={4}
        borderWidth="1px"
        borderRadius="md"
        minHeight="200px"
        display="flex"
        flexDirection="column"
        height="80vh"
        overflowY="auto"
      >
        <Search />
        {result?.foods?.map((food, idx) => (
          <Box
            key={idx}
            mb={3}
            mt={4}
            alignItems="center"
            display="flex"
            gap={6}
            fontSize="20px"
          >
            <Image
              src={food.photo?.highres}
              alt={food.photo?.highres || "Food Image"}
              boxSize="50px"
              objectFit="cover"
              borderRadius="md"
              backgroundColor="transparent"
            />
            <Text fontWeight="bold">{`${food.food_name.toUpperCase()}`}</Text>
            <Text>Calories: {food.nf_calories.toFixed()}</Text>
            <Text>Protein: {food.nf_protein}g</Text>
            <Text>Carbs: {food.nf_total_carbohydrate}g</Text>
            <Text>Fat: {food.nf_total_fat}g</Text>
            <Button
              onClick={() => handleAdd(food)}
              variant="ghost"
              size="lg"
              fontSize="2xl"
              p={4}
              minW="50px"
              minH="50px"
            >
              ✅
            </Button>
            <Button
              onClick={() => handleRemoveSearch(food)}
              variant="ghost"
              size="lg"
              fontSize="2xl"
              p={4}
              minW="50px"
              minH="50px"
            >
              ❌
            </Button>
          </Box>
        ))}

        <ItemsList
          allFood={allFood}
          setAllFood={setAllFood}
          intake={intake}
          handleRemoveList={handleRemoveList}
          handleList={handleList}
        />
      </Box>
    </>
  );
}

export default DailyIntake;
