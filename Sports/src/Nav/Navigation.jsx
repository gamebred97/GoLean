import { Box, Flex, HStack, Button, Spacer, Text } from "@chakra-ui/react";
import { Link as RouterLink, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../state/app.context";
import { logoutUser } from "../services/auth.service";

function Navigation() {
  const { user, setContext } = useContext(AppContext);
  const navigate = useNavigate();
  const location = useLocation();

  const onLogout = () => {
    logoutUser()
      .then(() => {
        setContext({ user: null, userData: null });
        navigate("/");
      })
      .catch((error) => {
        console.error("Logout failed:", error);
      });
  };

  const onLoginPage = location.pathname === "/login";
  const onRegisterPage = location.pathname === "/register";

  return (
    <Box  p={7} bg="gray.900">
      <Flex align="center" px={250}>
        <Box>
          <RouterLink to="/">
            <Text
              fontSize="5xl"
              fontWeight="bold"
              font-family='"Share Tech", sans-serif'
              color="white"
            >
              GoLean
            </Text>
          </RouterLink>
        </Box>
        <Spacer />
        <HStack spacing={4}>
          {user ? (
            <>
            <RouterLink to="/foods">
              <Text>Foods</Text>
            </RouterLink>
            <RouterLink to="/home">
              <Text>Home</Text>
            </RouterLink>
             <RouterLink to="/profile">
                <Text fontSize="3xl" color="white">
                  <i className="fa-solid fa-user"></i>
                </Text>
              </RouterLink>
              <Button colorScheme="red" onClick={onLogout} ml='50px' bg='gray.900' color="white">
                Logout
              </Button>
            </>
          ) : onLoginPage || onRegisterPage ? (
            <>
              <RouterLink to="/login">
                <Text fontSize="lg" color="white">
                  Login
                </Text>
              </RouterLink>
              <Box w="4" />
              <RouterLink to="/register">
                <Text fontSize="lg" color="white">
                  Register
                </Text>
              </RouterLink>
            </>
          ) : (
            <RouterLink to="/login">
              <Text fontSize="3xl" color="white">
                <i className="fa-solid fa-user"></i>
              </Text>
            </RouterLink>
          )}
        </HStack>
      </Flex>
    </Box>
  );
}

export default Navigation;
