import { Box, Button, Text } from "@chakra-ui/react";
import { getUserPathByUid } from "../services/users.service";
import { AppContext } from "../state/app.context";
import { useContext } from "react";
import { db } from "../config/firebase-config";
import { set, ref, get ,update} from "firebase/database";
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
      await update(path, zeroTotal)
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

      <Box
        maxW="700px"
        w="90vw"
        mx="auto"
        mt="calc(100px + 20px)"
        p={8}
        bg="gray.800"
        borderRadius="2xl"
        boxShadow="lg"
        color="white"
        minH="600px"
        display="flex"
        flexDirection="column"
        justifyContent="center"
        fontFamily="'Ancizar Serif', serif"
      >
        <Text fontSize="8xl" fontWeight="bold" textAlign="center" mb={6}>
          Macros
        </Text>
        <Text fontSize="4xl" mb={2} textAlign="center">
          Calories:{" "}
          {((intake.length > 0 || total) ? totalCalories : total?.calories)?.toFixed(1)}
        </Text>
        <Text fontSize="4xl" mb={2} textAlign="center">
          Protein:{" "}
          {((intake.length > 0 || total) ? totalProtein : total?.protein)?.toFixed(1)}g
        </Text>
        <Text fontSize="4xl" mb={2} textAlign="center">
          Carbs:{" "}
          {((intake.length > 0 || total) ? totalCarbs : total?.carbs)?.toFixed(1)}g
        </Text>
        <Text fontSize="4xl" mb={6} textAlign="center">
          Fat: {((intake.length > 0 || total) ? totalFat : total?.fat)?.toFixed(1)}g
        </Text>
        {/* <Button
          onClick={resetTotal}
          colorScheme="red"
          fontSize="lg"
          fontWeight="bold"
          alignSelf="center"
        >
          Clear
        </Button> */}
      </Box>
    
  </>
);
}

export default Total;
