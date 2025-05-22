import { Box, Button, Heading, Input } from '@chakra-ui/react';
import { useState, useContext } from "react";
import { AppContext } from "../../state/app.context";
import { getUserByHandle } from "../../services/users.service";
import { registerUser } from "../../services/auth.service";
import { createUserHandle } from "../../services/users.service";
import { useNavigate } from "react-router-dom";
import Navigation from '../../Nav/Navigation';

/**
 * Register component allows new users to create an account with:
 * - Username (handle)
 * - Email
 * - Password
 * - First name
 * - Last name
 *
 * Workflow:
 * 1. User fills all input fields.
 * 2. On submit, it checks if all fields are filled.
 * 3. Calls `getUserByHandle` to verify if the username is already taken.
 * 4. If username is free, calls `registerUser` to create a new Firebase auth user with email and password.
 * 5. After successful registration, calls `createUserHandle` to save the user handle and profile data in the database.
 * 6. Updates global app context with the new user info.
 * 7. Navigates user to the "/home" route.
 *
 * Uses Chakra UI components for styling.
 *
 * Key state and variables:
 * - `user`: holds form input values for username, email, password, firstName, lastName.
 * - `setUser`: updates `user` state when inputs change.
 * - `setContext`: function from AppContext to update global user data after registration.
 * - `navigate`: react-router function to programmatically change routes.
 *
 * Functions:
 * - `onRegister`: main handler for registration logic and API calls.
 * - `handleChange`: updates form input state on each keystroke.
 *
 * @returns JSX for rendering the registration form and handling user input/submit.
 */

function Register() {
  const { setContext } = useContext(AppContext);
  const [user, setUser] = useState({
    username: '',
    email: '',
    password: '',
    firstName: '',
    lastName: '',
  });

  const navigate = useNavigate();

  const onRegister = () => {
    if (!user.username || !user.email || !user.password || !user.firstName || !user.lastName) {
      alert('Please enter all fields!');
      return;
    }

    getUserByHandle(user.username)
      .then(snapshot => {
        if (snapshot.exists()) {
          throw new Error(`Handle @${user.username} has already been taken!`);
        }
        return registerUser(user.email, user.password);
      })
      .then(credential => {
        return createUserHandle(user.username, credential.user.uid, credential.user.email, user.firstName, user.lastName)
          .then(() => {
            setContext({
              user: credential.user,
              userData: null,
              firstName: user.firstName,
              lastName: user.lastName
            });
          });
      })
      .then(() => {
        navigate('/home');
      })
      .catch(e => console.log(e));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser(prev => ({ ...prev, [name]: value }));
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
        boxShadow="rgba(0, 0, 0, 0.25) 0px 54px 55px,
                   rgba(0, 0, 0, 0.12) 0px -12px 30px,
                   rgba(0, 0, 0, 0.12) 0px 4px 6px,
                   rgba(0, 0, 0, 0.17) 0px 12px 13px,
                   rgba(0, 0, 0, 0.09) 0px -3px 5px"
      >
        <Heading mb={6} size="lg" textAlign="center">
          Register
        </Heading>
        <form onSubmit={(e) => {
          e.preventDefault();
          onRegister();
        }}>
          <Box display="flex" flexDirection="column" gap={7}>
            <Input
              name="username"
              value={user.username}
              onChange={handleChange}
              placeholder="Enter username"
              
            />
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
            <Input
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              
            />
            <Input
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              
            />
            <Button type="submit" colorScheme="teal" width="full">
              Register
            </Button>
          </Box>
        </form>
      </Box>
    </>
  );
}

export default Register;