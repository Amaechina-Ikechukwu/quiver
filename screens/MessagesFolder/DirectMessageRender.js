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
  KeyboardAvoidingView,
} from "native-base";
import {
  View,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
} from "react-native";
import { ToastAndroid } from "react-native";
import useStore from "../../store/user";
import useNewStore from "../../store/post";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
  FontAwesome,
} from "@expo/vector-icons";
import colors from "../../colors";
import CText from "../../constants/Text";
import UploadAlert from "../../constants/UploadAlert";
import moment from "moment";
import IconPress from "../../constants/IconPress";
import {
  getDatabase,
  ref,
  set,
  remove,
  update,
  serverTimestamp,
  onValue,
  push,
  onDisconnect,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import IconAction from "../../constants/IconAction";
import Loading from "../../screens/Loading";

import SearchUserMessage from "./SearchUserMessage";
import MessageHeader from "./MessgaeHeader";
import MessagesInput from "./MessagesInput";
import { useNavigation } from "@react-navigation/native";
import MarkAsRead from "./MarkAsRead";

function DirectMessageRender({ item, id }) {
  item;
  const navigation = useNavigation();
  const markAsRead = (rad) => {
    const auth = getAuth();
    const db = getDatabase();

    update(ref(db, `messages/${id}/${getAuth().currentUser.uid}/${item.id}`), {
      isRead: item.from == id ? true : false,
    })
      .then(() => {
        // setDirectMessage(id);
        // update(
        //   ref(db, `messages/${id}/${getAuth().currentUser.uid}/${item.id}`),
        //   {
        //     isRead: true,
        //   }
        // );
      })
      .catch((error) => {
        //  (error);
        // setErrorr("error, please re-enter the fields and try again");
      });
  };
  useEffect(() => {
    navigation.addListener("focus", () => {
      setDm(
        directMessages.sort((x, y) => {
          return y.time - x.time;
        })
      );
    });
    markAsRead();
    return () => {};
  }, [item, id]);

  return (
    <Box
      alignItems={
        item.from == getAuth().currentUser.uid ? "flex-end" : "flex-start"
      }
    >
      <HStack
        maxWidth={"65%"}
        bg={item.from == getAuth().currentUser.uid ? "brand.400" : "brand.700"}
        my={2}
        py={2}
        px={2}
        rounded="md"
      >
        <CText text={item.message} size="sm" style={{ paddingHorizontal: 3 }} />
        {item.from == getAuth().currentUser.uid ? (
          <MarkAsRead uid={id} pid={item.id} />
        ) : null}
      </HStack>
      <Box alignItem="flex-end">
        <CText
          text={moment(item.time).calendar()}
          size="10"
          style={{ paddingHorizontal: 3, opacity: 0.3 }}
        />
      </Box>
    </Box>
  );
}

export default memo(DirectMessageRender);
