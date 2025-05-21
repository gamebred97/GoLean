
import Navigation from "../Nav/Navigation";
import { Box, Spacer } from "@chakra-ui/react";
import Target from "../Target/Target";
import { useState , useEffect, useContext} from "react";
import { FoodContext } from "../state/food.context";

function Home() {

  const {intake} = useContext(FoodContext)

   const [result, setResult] = useState("")
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
      <Box>
        <Target result={result} setResult={setResult} remaining={remaining} food={food}/>
      </Box>

    </>
  );
}

export default Home;