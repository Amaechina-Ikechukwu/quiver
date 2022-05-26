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
import { Link, useNavigate } from "react-router-native";
import { Dimensions, StyleSheet, View } from "react-native";
import Modals from "../constants/Modals";
function Footer({ navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const [type, setType] = useState("");
  const [users, setUsers] = useState([]);
  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 0,
  });

  const [a, setA] = useState(false);
  const [b, setB] = useState(false);
  const [c, setC] = useState(false);
  const [d, setD] = useState(false);

  const chats = (type) => {
    setGetModal(!getModal);
    setType(type);
    setC(!c);
  };

  const ideaPad = (type) => {
    setA(!a);
    setGetModal(true);
    setType(type);
  };

  const liveCaption = (type) => {
    setD(!d);
    setGetModal(true);
    setType(type);
  };

  const closeModal = () => {
    setGetModal(false);
    if (c === true) {
      setC(false);
    }
    if (a === true) {
      setA(false);
    }
    if (d === true) {
      setD(false);
    }
  };

  let wheight = Dimensions.get("window").height;

  return (
    <Box flex={1} w="full" height="auto">
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
          {/* /////////////////////footer/////////////////////// */}
          <Box>
            <HStack
              bg="brand.400"
              alignItems="center"
              safeAreaBottom
              shadow={6}
            >
              <Pressable
                py="3"
                flex={1}
                onPress={() => ideaPad("ideapad")}
                opacity={a === true ? 1 : 0.4}
              >
                <Center>
                  <Icon
                    mb="1"
                    as={<MaterialCommunityIcons name="note-edit-outline" />}
                    color="brand.800"
                    size="sm"
                  />
                  <Text color="brand.800" fontSize="12">
                    Idea Pad
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                py="2"
                flex={1}
                onPress={() => setB(!b)}
                opacity={b === true ? 1 : 0.4}
              >
                <Center>
                  <Icon
                    mb="1"
                    as={<MaterialCommunityIcons name="record-circle-outline" />}
                    color="brand.800"
                    size="sm"
                  />
                  <Text color="brand.800" fontSize="12">
                    Record
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                opacity={c === true ? 1 : 0.4}
                py="2"
                flex={1}
                onPress={() => chats("chats")}
              >
                <Center>
                  <Icon
                    mb="1"
                    as={<MaterialIcons name="chat-bubble-outline" />}
                    color="brand.800"
                    size="sm"
                  />
                  <Text color="brand.800" fontSize="12">
                    Chats
                  </Text>
                </Center>
              </Pressable>
              <Pressable
                opacity={d === true ? 1 : 0.4}
                py="2"
                flex={1}
                onPress={() => liveCaption("livecaption")}
              >
                <Center>
                  <Icon
                    mb="1"
                    as={
                      <MaterialCommunityIcons name={"closed-caption-outline"} />
                    }
                    color="brand.800"
                    size="sm"
                  />
                  <Text color="brand.800" fontSize="12">
                    Captions
                  </Text>
                </Center>
              </Pressable>
            </HStack>
          </Box>
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
            <Pressable
              w="full"
              onPress={() => navigation.navigate("frontpage")}
            >
              <HStack
                space={8}
                alignItems="center"
                justifyContent="center"
                w="full"
              >
                <MaterialCommunityIcons
                  name="microphone-outline"
                  size={20}
                  color="#E5E5E5"
                />
                <SimpleLineIcons
                  name="call-end"
                  style={{ transform: [{ scaleX: -1 }] }}
                  size={20}
                  color="red"
                />

                <MaterialCommunityIcons
                  name="camera-outline"
                  size={20}
                  color="#E5E5E5"
                />
              </HStack>
            </Pressable>
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

export default Footer;
