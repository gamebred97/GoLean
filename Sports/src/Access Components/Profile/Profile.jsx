import { useContext, useState } from "react";
import {
  Box,
  Input,
  Button,
  Text,
  Heading,
  VStack,
  HStack
} from "@chakra-ui/react";
import { AppContext } from "../../state/app.context";
import { updateUserProfile, getUserData } from "../../services/users.service";
import Navigation from "../../Nav/Navigation";

export default function Profile() {
  const { user, userData, setContext } = useContext(AppContext);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    email: userData?.email || user?.email || "",
  });

  if (!user) return <Box p={8}>Please log in to view your profile.</Box>;

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSave = async () => {
    await updateUserProfile(user.uid, form.firstName, form.lastName);
    const updatedData = await getUserData(user.uid);
    const userData = updatedData
      ? updatedData[Object.keys(updatedData)[0]]
      : null;
    setContext((prev) => ({
      ...prev,
      userData: userData,
    }));
    setEditMode(false);
  };

  return (
    <>
      <Navigation />
      <Box
        maxW="400px"
        mx="auto"
      
        p={6}
        borderRadius="md"
        boxShadow="md"
        bg="gray.900"
        color="white"
        mt="200px"
      >
        <Heading size="md" mb={4}>
          Profile
        </Heading>

        {editMode ? (
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={1}>First Name:</Text>
              <Input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                bg="white"
                color="black"
                _placeholder={{ color: "gray.500" }}
              />
            </Box>
            <Box>
              <Text mb={1}>Last Name:</Text>
              <Input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                bg="white"
                color="black"
                _placeholder={{ color: "gray.500" }}
              />
            </Box>

            <HStack spacing={3} pt={2}>
              <Button flex={1} colorScheme="blue" onClick={handleSave}>
                Save
              </Button>
              <Button
                flex={1}
                bg="gray.300"
                color="black"
                _hover={{ bg: "gray.400" }}
                onClick={() => setEditMode(false)}
              >
                Cancel
              </Button>
            </HStack>
          </VStack>
        ) : (
          <VStack spacing={4} align="stretch">
            <Box>
              <Text mb={1}>First Name:</Text>
              <Box bg="white" p={2} border="1px solid #ccc" borderRadius="md" color="black">
                {form.firstName}
              </Box>
            </Box>
            <Box>
              <Text mb={1}>Last Name:</Text>
              <Box bg="white" p={2} border="1px solid #ccc" borderRadius="md" color="black">
                {form.lastName}
              </Box>
            </Box>
            <Box>
              <Text mb={1}>Email:</Text>
              <Box bg="white" p={2} border="1px solid #ccc" borderRadius="md" color="black">
                {form.email}
              </Box>
            </Box>
            <Button colorScheme="blue" mt={2} onClick={() => setEditMode(true)}>
              Edit
            </Button>
          </VStack>
        )}
      </Box>
    </>
  );
}