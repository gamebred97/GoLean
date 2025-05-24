import { useContext, useState, useCallback } from "react";
import { Box, Text, Flex, Button, Image } from "@chakra-ui/react";
import { FoodContext } from "../state/food.context.jsx";
import { getUserPathByUid } from "../services/users.service.js";
import { AppContext } from "../state/app.context.js";
import { ref, push, remove, get } from "firebase/database";
import { db } from "../config/firebase-config";
import moment from "moment";
import ItemsList from "../Items LIst/ItemsList.jsx";
import Search from "../Search/Search.jsx";

function DailyIntake() {
  const { intake, setIntake, result, setResult } = useContext(FoodContext);
  const { user } = useContext(AppContext);
  const [allFood, setAllFood] = useState({});

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

  async function handleAdd(food) {
    if (!user) return;
    const id = await addMacros(food);
    setIntake((prev) => [...prev, { ...food, id }]);
    handleList();
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
    <Box
      p={{ base: 2, md: 4 }}
      borderWidth="1px"
      borderRadius="md"
      minHeight="200px"
      height={{ base: "55vh", md: "69vh" }}
      overflowY="auto"
    >
      <Search />

      {result?.foods?.map((food, idx) => (
        <Flex
          key={idx}
          mb={{ base: 3, md: 4 }}
          mt={{ base: 3, md: 4 }}
          flexWrap="wrap"
          alignItems="center"
          gap={{ base: 2, md: 6 }}
          fontSize={{ base: "sm", md: "md" }}
        >
          <Image
            src={food.photo?.highres}
            alt={food.photo?.highres || "Food Image"}
            boxSize={{ base: "40px", md: "50px" }}
            objectFit="cover"
            borderRadius="md"
            backgroundColor="transparent"
          />
          <Text fontWeight="bold">{food.food_name.toUpperCase()}</Text>
          <Text>Calories: {food.nf_calories.toFixed()}</Text>
          <Text>Protein: {food.nf_protein}g</Text>
          <Text>Carbs: {food.nf_total_carbohydrate}g</Text>
          <Text>Fat: {food.nf_total_fat}g</Text>
          <Button
            onClick={() => handleAdd(food)}
            variant="ghost"
            size="sm"
            fontSize={{ base: "lg", md: "2xl" }}
            p={{ base: 2, md: 4 }}
            minW="40px"
            minH="40px"
          >
            ✅
          </Button>
          <Button
            onClick={() => handleRemoveSearch(food)}
            variant="ghost"
            size="sm"
            fontSize={{ base: "lg", md: "2xl" }}
            p={{ base: 2, md: 4 }}
            minW="40px"
            minH="40px"
          >
            ❌
          </Button>
        </Flex>
      ))}

      <ItemsList
        allFood={allFood}
        setAllFood={setAllFood}
        intake={intake}
        handleRemoveList={handleRemoveList}
        handleList={handleList}
      />
    </Box>
  );
}

export default DailyIntake;