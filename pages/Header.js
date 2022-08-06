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
import Pressing from "../constants/Pressing";
import CText from "../constants/Text";
import moment from "moment";
import { app } from "../Firebase";
import SuggestedFollowing from "../screens/PostFolder/SuggestedFollowing";
function Header() {
  const posts = useStore((state) => state.posts);
  const [showModal, setShowModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [displayOption, setdisplayOption] = useState(false);
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
  const inHasQuiver = useStore((state) => state.inHasQuiver);

  const shouldSuggest = () => {
    setTimeout(() => {
      if (inHasQuiver.length !== 0) {
        setShowSuggested(false);
      } else {
        setShowSuggested(true);
      }
    }, 5000);
  };

  const closeSuggestion = () => {
    if (inHasQuiver.length >= 1) {
      setShowSuggested(false);
      setPosts();
    } else {
      setAlert("Please Follow A User");
    }
  };
  const closeModal = () => {
    setdisplayOption(false);
    setPosts();
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

    setTimeout(() => {
      inHasQuiver.length == 0 ? setdisplayOption(true) : closeModal();
    }, 15000);
    return () => {};
  }, [inHasQuiver]);

  return (
    <Box>
      {getAuth().currentUser !== undefined || getAuth().currentUser !== null ? (
        <HStack
          px="3"
          py="2"
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
          {displayOption == true ? (
            <Pressing
              click={() => setShowSuggested(true)}
              text={"Follow Top Users"}
              bg="brand.400"
              textStyle={{ opacity: 0.6 }}
            />
          ) : null}
          <Popover
            placement="top right"
            trigger={(triggerProps) => {
              return (
                <Pressable w="100%" p={2} rounded="md" {...triggerProps}>
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
      <SuggestedFollowing
        open={showSuggested}
        onClose={() => closeSuggestion()}
      />
    </Box>
  );
}

export default Header;
