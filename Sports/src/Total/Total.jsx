import { Box, Button, Text } from "@chakra-ui/react";
import { getUserPathByUid } from "../services/users.service";
import { AppContext } from "../state/app.context";
import { useContext } from "react";
import { db } from "../config/firebase-config";
import { set, ref, get } from "firebase/database";
import { useEffect, useState } from "react";
import { FoodContext } from "../state/food.context";

function Total() {
  const { user } = useContext(AppContext);
  const {intake} = useContext(FoodContext)

  const [total, setTotal] = useState(null);

 const totalCalories = intake.reduce((sum, item) => {
    const calories = item.calories || item.nf_calories
    return sum + calories
  }, 0);


 const totalProtein = intake.reduce((sum, item) => {
    const protein = item.protein || item.nf_protein
    return sum + protein
  }, 0);

  const totalCarbs = intake.reduce((sum, item) => {
    const carbs = item.carbs || item.nf_total_carbohydrate
    return sum + carbs
  }, 0);

  const totalFat = intake.reduce((sum, item) => {
    const fat = item.fat || item.nf_total_fat
    return sum + fat
  }, 0);

  console.log(intake)
  console.log(totalCalories)
  async function getTotalDB() {
    if (!user) return;
    const uniqueUser = await getUserPathByUid(user.uid);
    if (!uniqueUser) return;

    const path = ref(db, `${uniqueUser}/total`);

    try {
      const snapshot = await get(path);
      if (snapshot.exists()) {
        setTotal(snapshot.val());
      } else {
        setTotal(null);
      }
    } catch (error) {
      console.error("Error while creating total", error);
    }
  }

  async function setTotalDB() {
    if (!user) return;

    const uniqueUser = await getUserPathByUid(user.uid);

    if (!uniqueUser) return;

    const path = ref(db, `${uniqueUser}/total`);

    const newTotal = {
      calories: totalCalories,
      protein: totalProtein,
      carbs: totalCarbs,
      fat: totalFat,
    };

    try {
      const newRef = await set(path, newTotal);
      return newRef;
    } catch (error) {
      console.error("Error while creating total", error);
    }
  }

  async function resetTotal() {
    if (!user) return;
    const uniqueUser = await getUserPathByUid(user.uid);

    if (!uniqueUser) return;

    const path = ref(db, `${uniqueUser}/total`);

    const zeroTotal = {
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  };

    try {
      await set(path, zeroTotal)
      setTotal(null)
      
    } catch (error) {
      console.error("Error while re-setting total", error);
    }
  }

  useEffect(() => {
    if (intake.length > 0) {
      setTotalDB();
    }
  }, [intake]);

  useEffect(() => {
    getTotalDB();
  }, [user]);

  return (
    <>
      {(intake.length > 0 || total) && (
        <Box mt={4} p={4} bg="gray.900" borderRadius="md">
          <Text fontWeight="bold">Macros:</Text>
          <Text>
            Calories:{" "}
            {(intake.length > 0 ? totalCalories : total?.calories)?.toFixed(1)}
          </Text>
          <Text>
            Protein:{" "}
            {(intake.length > 0 ? totalProtein : total?.protein)?.toFixed(1)}g
          </Text>
          <Text>
            Carbs: {(intake.length > 0 ? totalCarbs : total?.carbs)?.toFixed(1)}
            g
          </Text>
          <Text>
            Fat: {(intake.length > 0 ? totalFat : total?.fat)?.toFixed(1)}g
          </Text>
          <Button onClick={resetTotal}>Clear</Button>
        </Box>
      )}
    </>
  );
}

export default Total;
