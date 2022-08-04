import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";

function MessageHeader({ name }) {
  const navigation = useNavigation();

  return (
    <Box flexDirection={"row"} justifyContent={"space-between"} px={1} py={3}>
      <IconPress
        click={() => navigation.goBack()}
        children={
          <Ionicons
            name="arrow-back-outline"
            size={24}
            color={colors.textColor}
          />
        }
      />

      <CText text={name} size="md" />

      <IconPress
        click={() => navigation.goBack()}
        children={
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.textColor}
          />
        }
      />
    </Box>
  );
}

export default MessageHeader;
