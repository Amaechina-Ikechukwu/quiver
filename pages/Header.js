import React, { useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Center,
  FlatList,
  HStack,
  Popover,
  PresenceTransition,
  Pressable,
  Spacer,
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

import SearchModal from "../Modals/SearchModal";
import FunModal from "../Modals/F(x)Modal";
import { getUsers } from "../store/functions/getusers";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Link } from "@react-navigation/native";
import UploadAlert from "../constants/UploadAlert";

import CText from "../constants/Text";
import moment from "moment";
import { app } from "../Firebase";
function Header() {
  const posts = useStore((state) => state.posts);
  const [showModal, setShowModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const quiver = useStore((state) => state.quiver);
  const [User, setUserName] = useState();
  const [Photo, setUserPhoto] = useState();
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
  const setPosts = useStore((state) => state.setPosts);
  const setCliques = useStore((state) => state.setCliques);
  const getNC = useStore((state) => state.getNC);

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
    onAuthStateChanged(getAuth(app), (user) => {
      setUserName(user.displayName);
      setUserPhoto(user.photoURL);
    });
    return () => {};
  });

  return (
    <Box>
      {getAuth().currentUser !== undefined || getAuth().currentUser !== null ? (
        <HStack
          px="3"
          py="1"
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
              {Photo == "" || Photo == undefined || Photo == null ? (
                <Box />
              ) : (
                <Avatar
                  size={"sm"}
                  bg="brand.400"
                  source={{
                    uri: Photo,
                  }}
                >
                  Q
                </Avatar>
              )}
            </VStack>

            <Text fontFamily="body" color="white" fontSize="md">
              {User !== undefined ? User.split(" ")[0] : null}
            </Text>
          </HStack>

          <Popover
            placement="top right"
            trigger={(triggerProps) => {
              return (
                <Pressable
                  w="100%"
                  p={2}
                  bg="brand.400"
                  rounded="md"
                  {...triggerProps}
                >
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
                  <Box
                    borderBottomWidth={1}
                    borderColor={"brand.800"}
                    w="100%"
                    py={3}
                    px={2}
                  >
                    <Link style={{ padding: 5 }} to={{ screen: "Postpage" }}>
                      <Text color="brand.800" fontSize="sm">
                        Post
                      </Text>
                    </Link>
                  </Box>

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
      ) : null}
      <SearchModal open={showModal} close={() => closeShowModal()} />
    </Box>
  );
}

export default Header;
