import { Box, Heading, Input, Button, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AppContext } from "../../state/app.context";
import { loginUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import Navigation from "../../Nav/Navigation";
import { googleLogin } from "../../services/auth.service";

function Login() {
  const { setContext } = useContext(AppContext);
  const navigate = useNavigate();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const onLogin = () => {
    if (!user.email || !user.password) {
      return alert("Please enter an email and password");
    }

    loginUser(user.email, user.password)
      .then((credential) => {
        setContext({
          user: credential.user,
        });
      })
      .then(() => {
        navigate("/home");
      })
      .catch((e) => console.log(e.message));
  };

  const handleGoogleLogin = () => {
    googleLogin()
      .then((result) => {
        const user = result.user;
        setContext({ user });
        navigate("/home");
      })
      .catch((error) => {
        console.error("Google login error:", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  return (
   <>
  <Navigation />

  <Box
    maxW="xl"
    w="100%"
    minH="400px"
    mx="auto"
    mt={250}  // Add margin top to create gap below navigation
    p={6}
    borderWidth={1}
    borderRadius="md"
    boxShadow="md"
  >
    <Heading mb={6} size="lg" textAlign="center">
      Login
    </Heading>
<form
  onSubmit={(e) => {
    e.preventDefault();
    onLogin();
  }}
>
  <Box display="flex" flexDirection="column" gap={7}>
    <Input
      type="email"
      name="email"
      value={user.email}
      onChange={handleChange}
      placeholder="Enter email"
      isRequired
    />
    <Input
      type="password"
      name="password"
      value={user.password}
      onChange={handleChange}
      placeholder="Enter password"
      isRequired
    />
    <Button type="submit" colorScheme="teal" width="full">
      Login
    </Button>
    <Button colorScheme="red" onClick={handleGoogleLogin}>
      Continue with Google
    </Button>
  </Box>
</form>
  </Box>
</>

  );
}

export default Login;
