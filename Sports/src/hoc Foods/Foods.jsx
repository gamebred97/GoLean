import DailyIntake from "../DailyIntake/DailyIntake";

import Total from "../Total/Total";
import { FoodContext } from "../state/food.context";
import { useContext } from "react";
import Navigation from "../Nav/Navigation";
import { Grid } from "@chakra-ui/react";

/**
 * Foods component that renders the main food management UI,
 * including navigation, search, daily intake list, and total calories.
 *
 * Uses FoodContext to access and update the list of food intake items.
 *
 * @component
 * @returns {JSX.Element}
 */
function Foods() {
  const { intake, setIntake } = useContext(FoodContext);

  return (
    <>
      <Navigation />
      <Grid templateColumns="1fr 1fr" gap={4}>
      <DailyIntake intake={intake} setIntake={setIntake} />
      <Total/>
      </Grid>
    </>
  );
}

export default Foods;