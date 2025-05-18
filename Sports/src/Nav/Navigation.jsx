import { Box, Flex, HStack, Button, Text } from "@chakra-ui/react";
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
    <Box p={7} bg="gray.900"  fontFamily="'Ancizar Serif', serif">
      <Flex align="baseline" px={250} justify="space-between">
        <HStack spacing={12} align="baseline" gap="50px">
          <RouterLink to="/">
            <Text
              fontSize="5xl"
              fontWeight="bold"
               fontFamily="'Ancizar Serif', serif"
              color="white"
            >
              GoLean
            </Text>
          </RouterLink>

          {user && (
            <>
              <RouterLink to="/home">
                <Text fontSize="xl" color="white">
                  Home
                </Text>
              </RouterLink>
              <RouterLink to="/foods">
                <Text fontSize="xl" color="white">
                  Foods
                </Text>
              </RouterLink>
            </>
          )}
        </HStack>

        <HStack spacing={6} align="baseline">
          {user ? (
            <>
              <RouterLink to="/profile">
                <Text fontSize="3xl" color="white">
                  <i className="fa-solid fa-user"></i>
                </Text>
              </RouterLink>
              <Button
                colorScheme="red"
                onClick={onLogout}
                bg="gray.900"
                color="white"
                fontSize="xl"
              >
                Logout
              </Button>
            </>
          ) : onLoginPage || onRegisterPage ? (
            <>
              <RouterLink to="/login">
                <Text fontSize="xl" color="white">
                  Login
                </Text>
              </RouterLink>
              <RouterLink to="/register">
                <Text fontSize="xl" color="white">
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