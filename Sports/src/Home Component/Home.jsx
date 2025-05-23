import Navigation from "../Nav/Navigation";
import { Box } from "@chakra-ui/react";
import Target from "../Target/Target";
import { useState, useEffect, useContext } from "react";
import { FoodContext } from "../state/food.context";
import { AppContext } from "../state/app.context";
import { ref, update } from "firebase/database";
import { db } from "../config/firebase-config";
import { getUserPathByUid } from "../services/users.service";

/**
 * Home component displays the user's daily calorie target and food intake,
 * calculates the remaining calories, and syncs this info with Firebase database.
 *
 * It consumes user data from AppContext and food intake from FoodContext.
 * The component updates Firebase with the remaining calories and total food calories whenever intake or target changes.
 *
 * @component
 * @returns {JSX.Element} Home component JSX
 */
function Home() {
  const { user } = useContext(AppContext);
  const { intake } = useContext(FoodContext);

  /**
   * Target calories set by the user.
   * @type {string | number}
   */
  const [result, setResult] = useState("");

  /**
   * Total calories consumed from food intake.
   * @type {number}
   */
  const [food, setFood] = useState(0);

  /**
   * Remaining calories after food intake, i.e., target - consumed.
   * @type {number | string}
   */
  const [remaining, setRemaining] = useState("");

  // Calculate total calories from intake array.
  const totalCalories = intake.reduce((sum, item) => {
    const calories = item.calories || item.nf_calories
    return sum + calories
  }, 0);

  useEffect(() => {
    const resultAfter = Number(result) - totalCalories;
    setRemaining(resultAfter);
    setFood(totalCalories);

    // Update the Firebase database with remaining and food calories for the current user
    async function setRemainingDB() {
      if (!user) return;
      const uniqueUser = await getUserPathByUid(user.uid);
      if (!uniqueUser) return;

      const path = ref(db, `${uniqueUser}/goal`);

      try {
        await update(path, { remaining: resultAfter });
        await update(path, { food: totalCalories });
      } catch (error) {
        console.error("Error updating remaining goal:", error);
      }
    }

    setRemainingDB();
  }, [intake, result, user]);

  return (
    <>
      <Navigation />
      <Box>
        <Target
          result={result}
          setResult={setResult}
          remaining={remaining}
          food={food}
        />
      </Box>
    </>
  );
}

export default Home;
