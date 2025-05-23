import { useState, useEffect, useContext } from "react";
import { Box, Text, Input, Button, VStack, Heading } from "@chakra-ui/react";
import { getUserPathByUid } from "../services/users.service";
import { AppContext } from "../state/app.context";
import { get, set, ref } from "firebase/database";
import { db } from "../config/firebase-config";

/**
 * Target component lets the user set and view their calorie target,
 * and shows current food intake and remaining calories.
 *
 * It interacts with Firebase to fetch and save the base calorie goal for the user.
 *
 * @param {Object} props
 * @param {string | number} props.result - Current calorie target value from parent
 * @param {function(string | number): void} props.setResult - Setter to update calorie target in parent
 * @param {string | number} props.remaining - Remaining calories after intake
 * @param {number} props.food - Total calories consumed from food intake
 *
 * @component
 * @returns {JSX.Element}
 */
function Target({ result, setResult, remaining, food }) {
  /**
   * Local state to hold user input for target calories before submitting.
   * @type {string}
   */
  const [target, setTarget] = useState("");

  const { user } = useContext(AppContext);

  /**
   * Saves the base calorie goal and resets related fields in Firebase for the current user.
   *
   * @param {string | number} goal - The calorie goal to save
   * @param {string | number} remaining - Remaining calories to save initially (often equal to goal)
   */
  async function addBaseGoal(goal, remaining) {
    if (!user) return;

    const uniqueUser = await getUserPathByUid(user.uid);
    if (!uniqueUser) return;

    const goalRef = ref(db, `${uniqueUser}/goal`);
    const newData = {
      baseGoal: goal || "",
      food: "",
      exercise: "",
      remaining: remaining || "",
    };

    try {
      await set(goalRef, newData);
    } catch (error) {
      console.error("Error creating goal:", error);
    }
  }

  /**
   * Fetches the saved calorie goal for the current user from Firebase
   * and updates the `result` state in parent.
   */
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
    fetchGoal()
  }, [user]);

  /**
   * Handles adding/updating the base calorie goal.
   * Saves to Firebase and updates parent state.
   */
  async function handleAdd() {
    if (!user) return;
    setResult(target);
    await addBaseGoal(target, target);
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
      minH="600px"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      fontFamily="'Ancizar Serif', serif"
    >
      <VStack spacing={6} align="stretch">
        <Heading
          size="5xl"
          textAlign="center"
          mb="50px"
          fontFamily="'Ancizar Serif', serif"
        >
          Calorie Target
        </Heading>

        <Input
          placeholder="Enter your calorie goal"
          value={target}
          onChange={(e) => setTarget(e.target.value)}
          bg="gray.700"
          _placeholder={{ color: "gray.400", fontSize: "32px" }}
          mb="20px"
          height="70px"
          fontSize="32px"
        />

        <Button
          colorScheme="teal"
          onClick={handleAdd}
          fontSize="20px"
          fontWeight="700"
        >
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
            <strong>Food:</strong> {Number(food).toFixed() || "-"}
          </Text>
          <Text>
            <strong>Remaining:</strong> {Number(remaining).toFixed() || "-"}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
}

export default Target;