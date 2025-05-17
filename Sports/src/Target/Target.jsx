import { useState, useEffect, useContext } from "react";
import { Box, Text, Input, Button, VStack, Heading } from "@chakra-ui/react";
import { getUserPathByUid } from "../services/users.service";
import { AppContext } from "../state/app.context";
import { get, set, ref } from "firebase/database";
import { db } from "../config/firebase-config";

function Target() {
  const [target, setTarget] = useState("");
  const [result, setResult] = useState("");

  const { user } = useContext(AppContext);

  async function addBaseGoal(goal) {
    if (!user) return;

    const uniqueUser = await getUserPathByUid(user.uid);
    if (!uniqueUser) return;

    const goalRef = ref(db, `${uniqueUser}/goal`);
    const newData = {
      baseGoal: goal || "",
      food: "",
      exercise: "",
    };

    try {
      await set(goalRef, newData);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  }

  async function fetchGoal() {
    if (!user) return;

    const uniqueUser = await getUserPathByUid(user.uid);
    if (!uniqueUser) return;

    const goalRef = ref(db, `${uniqueUser}/goal`);
    const snapshot = await get(goalRef);

    if (snapshot.exists()) {
      const data = snapshot.val();
      setResult(data.baseGoal || "");
    }
  }

  useEffect(() => {
    fetchGoal();
  }, [user]);

  async function handleAdd() {
    if (!user) return;
    setResult(target);
    await addBaseGoal(target);
    setTarget("");
  }

  return (
    <Box
      maxW="400px"
      mx="auto"
      mt={10}
      p={6}
      bg="gray.800"
      borderRadius="2xl"
      boxShadow="lg"
      color="white"
    >
      <VStack spacing={4} align="stretch">
        <Heading size="md" textAlign="center">
          Calorie Target
        </Heading>

        <Input
          placeholder="Enter your calorie goal"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          bg="gray.700"
          _placeholder={{ color: "gray.400" }}
        />

        <Button colorScheme="teal" onClick={handleAdd}>
          Add
        </Button>

        <Text fontSize="sm" color="gray.400">
          Remaining = Goal - Food + Exercise
        </Text>

        <Box p={4} bg="gray.700" borderRadius="lg">
          <Text>
            <strong>BASE GOAL:</strong> {result || "Not set"}
          </Text>
          <Text>
            <strong>FOOD:</strong> -
          </Text>
          <Text>
            <strong>EXERCISE:</strong> -
          </Text>
          <Text>
            <strong>REMAINING:</strong> -
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default Target;