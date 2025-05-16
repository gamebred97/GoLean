import Navigation from "../Nav/Navigation"
import Search from "../Search/Search"
import { Box , Spacer} from "@chakra-ui/react"

function Home() {
    return (
        <>
        <Navigation/>
        <Box mt="30px">
        <Search/>

        </Box>
        </>
    )
}

export default Home
