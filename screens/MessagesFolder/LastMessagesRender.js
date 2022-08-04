import React, { useState, useEffect, useLayoutEffect } from "react";
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
  Dimensions,
  TouchableOpacity,
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
  onChildAdded,
  query,
  orderByChild,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import IconAction from "../../constants/IconAction";
import Loading from "../../screens/Loading";

import SearchUserMessage from "./SearchUserMessage";
import MessageHeader from "./MessgaeHeader";
import MessagesInput from "./MessagesInput";
import DirectMessageRender from "./DirectMessageRender";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

function LastMessages({ id }) {
  const [text, setText] = useState();

  useEffect(() => {
    const dbRef = getDatabase();
    const reff = ref(dbRef, `lastmessages/${getAuth().currentUser.uid}/${id}`); //retrieve posts
    const ordered = query(reff, orderByChild("time")); //orders by time
    onChildAdded(ordered, async (snapshot) => {
      try {
        //  ("snap from last message", snapshot);
        //need to check if the current user belongs to a clique
        // snapshot.forEach((key) => {

        setText(snapshot.val().message);
      } catch (e) {
        e;
      }
    });

    return () => {
      setText();
    };
  });

  return (
    <Box>
      <CText text={text} />
    </Box>
  );
}

export default LastMessages;
