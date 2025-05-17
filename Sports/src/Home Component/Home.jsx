
import Navigation from "../Nav/Navigation";
import Search from "../Search/Search";
import { Box, Spacer } from "@chakra-ui/react";
import Target from "../Target/Target";
import DailyIntake from "../DailyIntake/DailyIntake";

function Home() {
  return (
    <>
      <Navigation />
      <Box>
        <Target />
      </Box>
      <Box mt="30px">
        <Search />
      </Box>
      <Box>
        <DailyIntake/>
      </Box>
    </>
  );
}

export default Home;