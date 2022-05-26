import {
  Box,
  Flex,
  HStack,
  PresenceTransition,
  Text,
  useSafeArea,
  ZStack,
  Modal,
  Pressable,
  Center,
  Icon,
  Spinner,
  Stack,
} from "native-base";
import React, { useState, useEffect } from "react";
import {
  Ionicons,
  SimpleLineIcons,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";

import {
  Dimensions,
  StyleSheet,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import Modals from "../constants/Modals";
import Footer from "../constants/Footer";
import { Camera, CameraType } from "expo-camera";
function BrainstormArena({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const [type, setType] = useState("");
  const [hasPermission, setHasPermission] = useState(null);
  const [ctype, setCType] = useState(CameraType.back);
  const [showCam, setShowCam] = useState(false);

  const [users, setUsers] = useState([]);
  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 0,
  });

  let wheight = Dimensions.get("window").height;
  let wht = Dimensions.get("window").width;

  const fakeUsers = [
    {
      Name: "Kanye West",
      role: "User",
    },
    {
      Name: "Ki kayne",
      role: "Speaker",
    },
    {
      Name: "Kim kayne",
      role: "Speaker",
    },
    {
      Name: "Kie kayne",
      role: "Speaker",
    },
  ];
  let role = [];
  let user = [];
  const cam = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const ArrangeUsers = () => {
    for (const key in fakeUsers) {
      role.push(fakeUsers[key].role);
    }
    let rr = [];

    for (const key in fakeUsers) {
      if (fakeUsers[key].role === "Speaker") {
        user.splice(1, 0, {
          Name: fakeUsers[key].Name,
          role: fakeUsers[key].role,
        });
        rr.push(fakeUsers[key].Name);
      }
      const t = rr.length;

      if (fakeUsers[key].role === "Listener") {
        user.push({ Name: fakeUsers[key].Name, role: fakeUsers[key].role });
      }
      setTimeout(() => {
        if (fakeUsers[key].role === "Co-speaker") {
          user.splice(rr.length + 1, 0, {
            Name: fakeUsers[key].Name,
            role: fakeUsers[key].role,
          });
        }
      }, 1000);

      if (fakeUsers[key].role === "Host") {
        user.unshift({
          Name: fakeUsers[key].Name,
          role: fakeUsers[key].role,
        });
      }
      setTimeout(() => {
        if (fakeUsers[key].role === "User") {
          user.splice(1, 0, {
            Name: fakeUsers[key].Name,
            role: fakeUsers[key].role,
          });
          rr.push(fakeUsers[key].Name);
        }
      }, 700);
    }

    setUsers(user);
  };

  useEffect(() => {
    ArrangeUsers();
    cam();
  }, []);
  console.log(ArrangeUsers);

  if (users === []) {
    <Spinner size="sm" />;
  }

  const Calls = ({ item }) => {
    return (
      <Box
        width={users.length > 3 ? "48%" : "97%"}
        height={users.length > 3 ? "200" : "300"}
        bg="brand.200"
        m={0.5}
        borderWidth={0.2}
        rounded="sm"
        borderColor={"brand.800"}
        flexDirection="column"
        alignItems={"center"}
        justifyContent={"center"}
        shadow={"lg"}
      >
        <Box w="100%" h="80%" alignItems={"center"} justifyContent="center">
          {item.role === "User" && (
            <View
              style={{
                width: "95%",
                height: "95%",
                borderRadius: 10,
                aspectRatio: 1 / 1,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {showCam === false ? (
                <Text color={"brand.300"} fontSize="3xl">
                  {item.Name}
                </Text>
              ) : (
                <Camera
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: 10,
                    aspectRatio: 1 / 1,
                  }}
                  type={ctype}
                ></Camera>
              )}
            </View>
          )}
        </Box>
        <Box
          flexDirection={"column"}
          alignItems={"center"}
          justifyContent="flex-end"
        >
          <Box
            w="100%"
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent={"space-between"}
          >
            <Box
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"space-between"}
            >
              <Text color="brand.800" fontSize="lg">
                {item.Name}
              </Text>
              <Text color="brand.800" opacity={0.4} fontSize="sm">
                {item.role}
              </Text>
            </Box>
          </Box>
        </Box>
      </Box>
    );
  };

  return (
    <Box flex={1} w="full" h="100%" {...safeAreaProps}>
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
        <Box
          display={"flex"}
          flexDirection="column"
          justifyContent={"space-between"}
          h="full"
        >
          <Pressable
            height={wheight - 60}
            bg="brand.100"
            onPress={() => setShowModal(true)}
          >
            <Box
              p={2}
              style={{
                width: "100%",
                height: wheight - 50,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {users.length < 3 ? (
                <FlatList
                  style={{ width: `100%` }}
                  data={users}
                  scrollEnabled
                  renderItem={Calls}
                  keyExtractor={(item, index) =>
                    users.length > 2
                      ? item.Name +
                        Math.floor(
                          Math.random() * 100 +
                            users.length * Math.floor(Math.random() * 100)
                        )
                      : Math.floor(Math.random() * 10 + users.length * index) +
                        "#"
                  }
                  key={(item, index) =>
                    users.length > 3
                      ? item.Name +
                        Math.floor(Math.random() * 100 + users.length * index)
                      : Math.floor(Math.random() * 100 + users.length * index) +
                        "#"
                  }
                />
              ) : (
                <FlatList
                  numColumns={2}
                  data={users}
                  scrollEnabled
                  renderItem={Calls}
                  keyExtractor={(item, index) =>
                    item.Name +
                    Math.floor(
                      Math.random() * 100 +
                        users.length * Math.floor(Math.random() * 100)
                    )
                  }
                  key={(item, index) =>
                    Math.floor(Math.random() * 100 + users.length * index) + "#"
                  }
                />
              )}
            </Box>
          </Pressable>
          {/* /////////////////////footer/////////////////////// */}
          <Footer />
        </Box>
      </PresenceTransition>

      {/* /////////////////////////////modal/////////////////////// */}
      <Modal w="full" isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content
          borderRadius={0}
          backgroundColor={"transparent"}
          w="full"
          {...styles["top"]}
        >
          <Pressable w="full" onPress={() => navigation.navigate("frontpage")}>
            <HStack
              paddingX={4}
              paddingY={4}
              justifyContent="space-around"
              alignItems="center"
              w="100%"
              backgroundColor={"rgba(0,0,0,0.9)"}
            >
              <HStack space={3} alignItems="center" w="full">
                <Ionicons name="chevron-back-sharp" size={20} color="#E5E5E5" />
                <Text fontFamily="body" color="white" fontSize="20">
                  Home
                </Text>
              </HStack>
              <MaterialCommunityIcons
                name="camera-flip-outline"
                size={20}
                color="#E5E5E5"
              />
            </HStack>
          </Pressable>
        </Modal.Content>
        {/* //////////////////controls/////////////////// */}
        <Modal.Content
          borderRadius={0}
          backgroundColor={"rgba(0,0,0,0.1)"}
          w="3/5"
          {...styles["bottom"]}
        >
          <HStack
            paddingX={4}
            paddingY={4}
            justifyContent="center"
            alignItems="center"
            w="100%"
            backgroundColor={"rgba(0,0,0,0.1)"}
          >
            <HStack
              space={8}
              alignItems="center"
              justifyContent="center"
              w="full"
            >
              <Pressable>
                <MaterialCommunityIcons
                  name="microphone-outline"
                  size={20}
                  color="#E5E5E5"
                />
              </Pressable>

              <Pressable onPress={() => navigation.navigate("frontpage")}>
                <SimpleLineIcons
                  name="call-end"
                  style={{ transform: [{ scaleX: -1 }] }}
                  size={20}
                  color="red"
                />
              </Pressable>

              <Pressable onPress={() => setShowCam(!showCam)}>
                <MaterialCommunityIcons
                  name="camera-outline"
                  size={20}
                  color="#E5E5E5"
                  style={{ opacity: showCam ? 1 : 0.4 }}
                />
              </Pressable>

              <Pressable>
                <View>
                  <TouchableOpacity
                    onPress={() => {
                      setCType(
                        ctype === CameraType.back
                          ? CameraType.front
                          : CameraType.back
                      );
                    }}
                  >
                    <Text color="brand.800"> Flip </Text>
                  </TouchableOpacity>
                </View>
              </Pressable>
            </HStack>
          </HStack>
        </Modal.Content>
      </Modal>
      <Modals open={getModal} type={type} close={() => closeModal()} />
    </Box>
  );
}

const styless = StyleSheet.create({
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(12, 1fr)",
  },
});

const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0,
  },
  bottom: {
    marginBottom: 2,
    marginTop: "auto",
    backgroundColor: "brand.200",
    border: "none",
    borderRadius: 10,
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

export default BrainstormArena;
