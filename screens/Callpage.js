import {
  Button,
  Modal,
  Text,
  Box,
  HStack,
  VStack,
  Avatar,
  Spinner,
  Center,
  PresenceTransition,
  useToast,
} from "native-base";
import React, { useEffect, useState, useRef } from "react";
import { StatusBar, View, Animated } from "react-native";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import HmsManager from "@100mslive/react-native-hms";
import useStore from "../store/user";
import { HMSProvider } from "../constants/HMSContext";
import { ToastAndroid } from "react-native";
import { getAuth } from "firebase/auth";

function CallPage({ navigation, route }) {
  const [showModal, setShowModal] = useState(false);
  const user = getAuth().currentUser;
  const [index, setindex] = useState(0);

  const ballAnimatedValue = useRef(new Animated.Value(0)).current;

  const [hmsInstanceLoaded, setHmsInstanceLoaded] = useState(false);

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

  const switchIndex = (value) => {
    setindex(value);
  };

  const use = useStore((state) => state.user);

  const hmsInstance = async () => {
    await HmsManager.build();
  };

  const getToken = () => {
    fetch(`https://three-waves-enjoy-197-211-63-60.loca.lt/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({ userName: "obi" }),
    })
      .then((res) => {
        try {
          console.log(res.json, "worked");
        } catch (err) {
          console.log(err, "err");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const regVoxUser = async () => {
    const payload = {
      userName: user.displayName,
      userDisplayName: user.displayName,
      userPassword: user.displayName + "quiver",
      applicationId: "10464912",
    };
    await fetch(`https://three-waves-enjoy-197-211-63-60.loca.lt`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        try {
          const jsonRes = await res.json();
          if (res.status === 200) {
            ToastAndroid.showWithGravity(
              jsonRes.message,
              ToastAndroid.SHORT,
              ToastAndroid.CENTER
            );
          }
        } catch (err) {
          console.log(err, "err");
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    getToken();

    MoveIn();
  }, []);

  return (
    <HMSProvider value={hmsInstance}>
      <View style={{ flex: 1, width: "100%", backgroundColor: "#151515" }}>
        <StatusBar barStyle="default" />
        <Box safeAreaTop />
        <PresenceTransition
          visible={true}
          initial={{
            opacity: 0,
          }}
          animate={{
            opacity: 1,
            transition: {
              duration: 250,
            },
          }}
        >
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
                onPress={() =>
                  navigation.navigate("brainstorm", {
                    roomID: Math.random().toString(36).slice(2, 16),
                    host: use.uid,
                  })
                }
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
          </View>
        </PresenceTransition>
      </View>
      {/* )} */}
    </HMSProvider>
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
