import React, { useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Center,
  HStack,
  Popover,
  PresenceTransition,
  Pressable,
  Text,
  VStack,
} from "native-base";
import { View, StatusBar } from "react-native";
import { ToastAndroid } from "react-native";
import useStore from "../store/user";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";
import colors from "../colors";
import PostModals from "../Modals/PostModal";
import SearchModal from "../Modals/SearchModal";
import FunModal from "../Modals/F(x)Modal";
import { getUsers } from "../store/functions/getusers";

function HomePage() {
  const [showModal, setShowModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const use = useStore((state) => state.user);
  const online = useStore((state) => state.online);
  const clearToast = useStore((state) => state.clearToast);
  const showToast = () => {
    ToastAndroid.show(toastt, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    setTimeout(() => {
      clearToast();
    }, 2000);
  };
  const toastt = useStore((state) => state.toast);
  const isUsers = useStore((state) => state.isUsers);
  toastt !== "" ? showToast() : null;
  const getNotify = useStore((state) => state.getNotify);
  const closeModal = () => {
    setGetModal(!getModal);
  };
  const closeShowModal = () => {
    setShowModal(!showModal);
  };
  const openSearchModal = () => {
    isUsers();
    setShowModal(!showModal);
  };

  useEffect(() => {
    isUsers();
    setTimeout(() => {
      clearToast();
    }, 3000);
  });

  return (
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
        <HStack
          px="3"
          py="3"
          justifyContent="space-between"
          alignItems="center"
          w="full"
        >
          <HStack space={3} alignItems="center">
            <VStack flexDirection={"column-reverse"}>
              <Box // bg="red.400"
                bg={online ? "brand.700" : "gray.200"}
                rounded="full"
                position="absolute"
                variant="solid"
                zIndex={1}
                alignSelf="flex-end"
                w={2}
                h={2}
              />
              <Avatar
                size={"sm"}
                bg="brand.400"
                source={{
                  uri: use !== null ? use.photoURL : null,
                }}
              >
                Q
              </Avatar>
            </VStack>

            <Text fontFamily="body" color="white" fontSize="md">
              {use !== null ? use.displayName : "user"}
            </Text>
          </HStack>

          <Popover
            placement="top right"
            trigger={(triggerProps) => {
              return (
                <Pressable w="100%" p={2} {...triggerProps}>
                  <AntDesign
                    name="ellipsis1"
                    size={24}
                    color={colors.textColor}
                  />
                </Pressable>
              );
            }}
          >
            <Popover.Content
              accessibilityLabel="Delete Customerd"
              w="40"
              h="auto"
              borderWidth={0}
            >
              <Popover.Body padding={0} bg="brand.400">
                <Box h="full" justifyContent={"center"}>
                  <Pressable
                    borderBottomWidth={1}
                    borderColor={"brand.800"}
                    w="100%"
                    py={3}
                    px={2}
                    onPress={() => setGetModal(!getModal)}
                  >
                    <Text color="brand.800" fontSize="sm">
                      Post
                    </Text>
                  </Pressable>
                  <Pressable
                    onPress={() => openSearchModal()}
                    borderColor={"brand.800"}
                    w="full"
                    py={3}
                    px={2}
                  >
                    <Text color="brand.800" fontSize="sm">
                      Search
                    </Text>
                  </Pressable>
                </Box>
              </Popover.Body>
            </Popover.Content>
          </Popover>
        </HStack>
        <Box h="full" display={"flex"} align="center" justify="center">
          <Center>
            <Text color="brand.800" opacity="0.5" fontSize="sm">
              Add people to your quiver
            </Text>

            <Pressable
              p="2"
              rounded="sm"
              bg="brand.700"
              borderWidth="1"
              onPress={() => {
                console.log("hello");
              }}
            >
              <Text color="white">Talks</Text>
            </Pressable>
          </Center>
        </Box>
      </PresenceTransition>
      <PostModals open={getModal} close={() => closeModal()} />
      <SearchModal open={showModal} close={() => closeShowModal()} />
    </View>
  );
}

export default HomePage;
