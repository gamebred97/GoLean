import { useState, useEffect, useContext } from "react";
import { Box, Text, Input, Button, VStack, Heading } from "@chakra-ui/react";
import { getUserPathByUid } from "../services/users.service";
import { AppContext } from "../state/app.context";
import { get, set, ref } from "firebase/database";
import { db } from "../config/firebase-config";

function Target({ result, setResult, remaining, food }) {
  const [target, setTarget] = useState("");
  //   const [result, setResult] = useState("");

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
      maxW="700px" 
      w="90vw"
      mx="auto" 
      mt="calc(100px + 20px)"
      p={8}
      bg="gray.800"
      borderRadius="2xl"
      boxShadow="lg"
      color="white"
      minH="600px" // bigger height
      display="flex"
      flexDirection="column"
      justifyContent="center"
       fontFamily="'Ancizar Serif', serif"
    >
      <VStack spacing={6} align="stretch">
        <Heading size="5xl" textAlign="center" mb="50px"  fontFamily="'Ancizar Serif', serif">
          Calorie Target
        </Heading>

        <Input
          placeholder="Enter your calorie goal"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          bg="gray.700"
          _placeholder={{ color: "gray.400" }}
          mb="20px"
          height="70px"
          fontSize="32px"
          _placeholder={{
            color: "gray.400",
            fontSize: "32px",
          }}
        />

        <Button colorScheme="teal" onClick={handleAdd} fontSize="20px" fontWeight="700">
          Add
        </Button>

        <Text fontSize="sm" color="gray.400">
          Remaining = Goal - Food
        </Text>

        <Box p={6} bg="gray.700" borderRadius="lg" fontSize="40px">
          <Text>
            <strong>Goal:</strong> {result || "-"}
          </Text>
          <Text>
            <strong>Food:</strong> {food || "-"}
          </Text>
          {!result ? null : (
            <Text>
              <strong>Remaining:</strong> {remaining || "-"}
            </Text>
          )}
        </Box>
      </VStack>
    </Box>
  );
}

export default Target;
