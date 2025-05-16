import { Box, Button, Heading, Input } from '@chakra-ui/react';
import { useState, useContext } from "react";
import { AppContext } from "../../state/app.context";
import { getUserByHandle } from "../../services/users.service";
import { registerUser } from "../../services/auth.service";
import { createUserHandle } from "../../services/users.service";
import { useNavigate } from "react-router-dom";
import Navigation from '../../Nav/Navigation';

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
              isRequired
            />
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
            <Input
              name="firstName"
              value={user.firstName}
              onChange={handleChange}
              placeholder="Enter first name"
              isRequired
            />
            <Input
              name="lastName"
              value={user.lastName}
              onChange={handleChange}
              placeholder="Enter last name"
              isRequired
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