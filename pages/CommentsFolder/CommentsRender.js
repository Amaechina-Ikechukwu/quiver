import React, { useState, useEffect, memo } from "react";
import {
  Avatar,
  Badge,
  Box,
  Center,
  FavouriteIcon,
  HStack,
  Popover,
  PresenceTransition,
  Pressable,
  Spacer,
  Text,
  VStack,
} from "native-base";
import { View, StatusBar, FlatList, Image, SafeAreaView } from "react-native";
import { ToastAndroid } from "react-native";

import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
} from "@expo/vector-icons";
import colors from "../../colors";
import CText from "../../constants/Text";
import moment from "moment";
import useStore from "../../store/user";
import IconPress from "../../constants/IconPress";
import {
  getDatabase,
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
  get,
  child,
  orderByChild,
  query,
  orderByValue,
  onChildAdded,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import IconAction from "../../constants/IconAction";
import { useNavigation } from "@react-navigation/native";
import UploadAlert from "../../constants/UploadAlert";
import Header from "../../pages/Header";
function CommentsRender({ item }, props) {
  const likePost = (postId, from) => {
    const db = getDatabase();
    const user = `${getAuth().currentUser.uid}`;
    "likePost", postId, from;
    set(ref(db, `likes/` + `${postId}/${user}`), { user: true });
  };

  const dellikePost = (postId, from) => {
    const db = getDatabase();
    const user = `${getAuth().currentUser.uid}`;
    "dislikePost", postId, from;
    set(ref(db, `likes/` + `${postId}/${user}`), { user: false });
  };

  const connected = useStore((state) => state.connected);

  useEffect(() => {
    return () => {};
  });
  const navigation = useNavigation();
  return (
    <Box px={1} borderBottomWidth="1" borderColor="brand.400">
      <Box p={1}>
        <VStack p="1" space={2} justifyContent="space-between">
          <HStack space={3} alignItems="center">
            <VStack flexDirection={"column-reverse"}>
              {/* <Box // bg="red.400"
                bg={userActive == true ? "brand.700" : "gray.200"}
                rounded="full"
                position="absolute"
                variant="solid"
                zIndex={1}
                alignSelf="flex-end"
                w={2}
                h={2}
              /> */}
              <Avatar
                size={"sm"}
                bg="brand.400"
                source={{
                  uri: item.photo,
                }}
              >
                Q
              </Avatar>
            </VStack>
            <HStack flex={1} justifyContent="space-between">
              <CText text={item.by} size="sm" style={{ opacity: 0.8 }} />
              <CText
                text={moment(item.time).fromNow()}
                size="sm"
                style={{ opacity: 0.5 }}
              />
            </HStack>
          </HStack>
          <Box ml={9} px={2}>
            <CText text={item.comment} size="sm" style={{ opacity: 0.9 }} />
          </Box>
        </VStack>
      </Box>
    </Box>
  );
}

export default memo(CommentsRender);
