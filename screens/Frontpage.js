import {
  Button,
  Center,
  Container,
  Modal,
  Text,
  Box,
  HStack,
  VStack,
  Flex,
  Avatar,
} from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { StatusBar, View, Animated } from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Link, useNavigate } from "react-router-native";
import { getAuth } from "firebase/auth";
import { app } from "../Firebase";
import useStore from "../store/user";

function CallPage({ navigation, route }) {
  const [showModal, setShowModal] = useState(false);
  const [user, setUser] = useState({});
  const [index, setindex] = useState(0);
  let [fontsLoaded] = useFonts({
    "Raleway-Regular": require("../assets/fonts/static/Raleway-Regular.ttf"),
    "AlmendraSC-Regular": require("../assets/fonts/AlmendraSC-Regular.ttf"),
  });
  const ballAnimatedValue = useRef(new Animated.Value(0)).current;

  ////////higher icon/////////
  const xVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -5],
  });

  const yVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });
  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
      { translateX: xVal },
      { scaleX: -1 },
    ],
  };
  ////////lower icon//////
  const mVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -20],
  });

  const nVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 1],
  });
  const mnimStyle = {
    transform: [
      {
        translateY: mVal,
      },
      { translateX: nVal },
    ],
  };

  const MoveIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(ballAnimatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const MoveOut = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(ballAnimatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const Push = () => {
    MoveOut();
    setTimeout(() => {
      MoveIn();
    }, 1000);

    setTimeout(() => {
      if (index >= 3) {
        setIndex(index - 2);
      } else setIndex(index + 1);
      console.log(index);
    }, 2000);
  };

  const switchIndex = (value) => {
    setindex(value);
  };

  const use = useStore((state) => state.user);

  useEffect(() => {
    console.log(use + "from use");
    MoveIn();
  }, [index]);

  return (
    <View style={{ flex: 1, width: "100%", backgroundColor: "#151515" }}>
      <StatusBar barStyle="default" />
      <Box safeAreaTop />
      <HStack
        px="3"
        py="3"
        justifyContent="space-between"
        alignItems="center"
        w="100%"
      >
        <HStack space={3} alignItems="center" w="full">
          <Avatar
            size={"sm"}
            bg="brand.400"
            source={{
              uri: use !== null ? use.photoURL : null,
            }}
          >
            Q
          </Avatar>

          <Text fontFamily="body" color="white" fontSize="20">
            {use !== null ? use.displayName : null}
          </Text>
        </HStack>
      </HStack>

      <View>
        <VStack space={2} alignItems="center">
          <Button
            onPress={() => navigation.navigate("personalcall")}
            justifyContent="flex-start"
            w="full"
            bg="brand.400"
            rounded="md"
            shadow={3}
            color="brand.800"
            p={2}
          >
            <HStack alignItems="center" space={4}>
              <Box borderRadius={5} bg="#3385FF" p={1}>
                <Ionicons name="person-outline" size={30} color="#fff" />
              </Box>
              <Text color="brand.800" fontSize={18}>
                Personal Call
              </Text>
            </HStack>
          </Button>

          {/* /////////////// */}
          <Button
            justifyContent="flex-start"
            w="full"
            bg="brand.400"
            rounded="md"
            shadow={3}
            color="brand.800"
            p={2}
          >
            <HStack alignItems="center" space={4}>
              <Box borderRadius={5} bg="#FFF07C" p={1}>
                <Ionicons name="people-outline" size={30} color="#9C8B00" />
              </Box>
              <Text color="brand.800" fontSize={18}>
                Group Call
              </Text>
            </HStack>
          </Button>

          <Button
            onPress={() => navigation.navigate("brainstorm")}
            justifyContent="flex-start"
            w="full"
            bg="brand.400"
            rounded="md"
            shadow={3}
            color="brand.800"
            p={2}
          >
            <HStack alignItems="center" space={4}>
              <Box borderRadius={5} bg="#FF475D" p={1}>
                <SimpleLineIcons name="puzzle" size={30} color="#B60016" />
              </Box>
              <Text color="brand.800" fontSize={18}>
                Brainstorm Arena
              </Text>
            </HStack>
          </Button>

          <Button
            justifyContent="flex-start"
            w="full"
            bg="brand.400"
            rounded="md"
            shadow={3}
            color="brand.800"
            p={2}
          >
            <HStack alignItems="center" space={4}>
              <Box borderRadius={5} bg="#EB9BFF" p={1}>
                <MaterialCommunityIcons
                  name="checkbox-blank-badge-outline"
                  size={30}
                  color="#7C009B"
                />
              </Box>
              <Text color="brand.800" fontSize={18}>
                Start Meeting
              </Text>
            </HStack>
          </Button>
        </VStack>
        {/* //////////////////////////////session/////////////// */}

        <Box p={2}>
          <Box
            display="flex"
            flexDirection="row"
            alignItems="center"
            justifyContent={"space-between"}
          >
            <Text color="brand.800" fontSize={20} opacity={0.5}>
              Sessions
            </Text>
            <Box>
              <Button.Group
                isAttached
                colorScheme="gray"
                mx={{
                  base: "auto",
                  md: 0,
                }}
                size="sm"
              >
                <Button
                  variant={index !== 0 ? "ghost" : null}
                  name={0}
                  onPress={() => switchIndex(0)}
                >
                  Live
                </Button>
                <Button
                  variant={index !== 1 ? "ghost" : null}
                  onPress={() => switchIndex(1)}
                  name={1}
                >
                  History
                </Button>
              </Button.Group>
            </Box>
          </Box>
          <View style={{ width: "100%" }}>
            <Animated.View
              style={[
                {
                  display: "flex",
                  alignItems: "center",
                },
                animStyle,
              ]}
            >
              <AntDesign name="exclamation" size={100} color="#4F4F4F" />
            </Animated.View>
            <Animated.View
              style={[{ display: "flex", alignItems: "center" }, mnimStyle]}
            >
              <AntDesign name="exclamation" size={100} color="#E5E5E5" />
            </Animated.View>
            <Box
              display="flex"
              flexDirection="row"
              alignItems="center"
              justifyContent={"center"}
            >
              <Text color="brand.800" fontSize={20} opacity={0.2}>
                No Activity
              </Text>
            </Box>
          </View>
        </Box>

        {/* //////////////////////////////modal/////////////// */}
        <Modal
          borderWidth={"0"}
          isOpen={showModal}
          onClose={() => setShowModal(false)}
        >
          <Modal.Content
            paddingX={2}
            paddingY={5}
            w="full"
            {...styles["bottom"]}
          >
            <Box w="full">
              <Text color="brand.800" mb="10%" fontSize={18}>
                Seems you haven’t added anyone to your quiver...
              </Text>
              <Box>
                <Box w="full" {...styles["display"]}>
                  <Button
                    bg={"brand.400"}
                    w="1/4"
                    mr={4}
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    <Text color="brand.800">Close</Text>
                  </Button>
                  <Button
                    bg={"brand.800"}
                    w="2/4"
                    color="brand.100"
                    onPress={() => {
                      setShowModal(false);
                    }}
                  >
                    <Text>Find Cliques</Text>
                  </Button>
                </Box>
              </Box>
            </Box>
          </Modal.Content>
        </Modal>
      </View>
    </View>
  );
}
const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0,
  },
  bottom: {
    marginBottom: 0,
    marginTop: "auto",
    backgroundColor: "brand.200",
    border: "none",
  },
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
  },
  center: {},
  display: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  place: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default CallPage;
