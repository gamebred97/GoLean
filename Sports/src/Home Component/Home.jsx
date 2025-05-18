
import Navigation from "../Nav/Navigation";
import { Box, Spacer } from "@chakra-ui/react";
import Target from "../Target/Target";
import DailyIntake from "../DailyIntake/DailyIntake";
import { useState , useEffect, useContext} from "react";
import { FoodContext } from "../state/food.context";

function Home() {

  const {intake} = useContext(FoodContext)

   const [result, setResult] = useState("")
    // const [intake, setIntake] = useState([]);
    const [food, setFood] = useState(0)
    const [remaining, setRemaining] = useState("");

    const totalCalories = intake.reduce((sum, item) => sum + item.nf_calories, 0);


  function handleRemaining() {
    const res = result - totalCalories;
    setRemaining(res)
  }

  function handleCaloriesSum(){
    setFood(totalCalories)
  }

   useEffect(() => {
      handleRemaining()
      handleCaloriesSum()
    },[intake, result])

  return (
    <>
      <Navigation />
      <Box display='grid' gridTemplateColumns="1fr 1fr" gap={4}>
      <Box>
        <Target result={result} setResult={setResult} remaining={remaining} food={food}/>
      </Box>
      </Box>
    </>
  );
}

export default Home;