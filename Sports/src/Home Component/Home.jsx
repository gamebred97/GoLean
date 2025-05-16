
import Navigation from "../Nav/Navigation";
import Search from "../Search/Search";
import { Box, Spacer } from "@chakra-ui/react";
import Target from "../Target/Target";

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
    </>
  );
}

export default Home;