import { Box, Heading, Input, Button, VStack } from "@chakra-ui/react";
import { useContext, useState } from "react";
import { AppContext } from "../../state/app.context";
import { loginUser } from "../../services/auth.service";
import { useNavigate } from "react-router-dom";
import Navigation from "../../Nav/Navigation";
import { googleLogin } from "../../services/auth.service";

/**
 * Login component allows users to sign in using email/password or Google OAuth.
 *
 * Features:
 * - Controlled inputs for email and password.
 * - Validates that both fields are filled before submitting.
 * - Calls `loginUser` service to authenticate with email and password.
 * - On success, updates global app context with user info and navigates to "/home".
 * - Supports Google login with `googleLogin` service, updates context and navigates on success.
 * - Shows a navigation bar on top.
 */

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
      .catch((e) =>   console.error("Login failed:", e.code, e.message));
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
    mt={250}  
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
      
    />
    <Input
      type="password"
      name="password"
      value={user.password}
      onChange={handleChange}
      placeholder="Enter password"
      
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
