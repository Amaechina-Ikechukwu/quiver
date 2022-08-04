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
import MessageHeader from "./MessgaeHeader";

function MessagesInput({ id }) {
  const [messages, setMessages] = useState("");
  const [rad, setRad] = useState(Math.random().toString(36).substring(2, 17));

  const setDirectMessage = useStore((state) => state.setDirectMessage);
  const change = (e) => {
    e;
    setMessages(e);
  };
  const submitToMessages = (rad) => {
    const auth = getAuth();
    const db = getDatabase();

    set(ref(db, `messages/${getAuth().currentUser.uid}/${id}/${rad}`), {
      message: messages,
      by: getAuth().currentUser.uid,
      time: serverTimestamp(),
    })
      .then(() => {
        // setDirectMessage(id);
        setMessages("");
        set(ref(db, `messages/${id}/${getAuth().currentUser.uid}/${rad}`), {
          message: messages,
          by: getAuth().currentUser.uid,
          time: serverTimestamp(),
        });
      })
      .catch((error) => {
        //  (error);
        // setErrorr("error, please re-enter the fields and try again");
      });
  };

  return (
    <Box>
      <HStack
        w="100%"
        bg={"brand.400"}
        alignItems="center"
        justifyContent={"space-around"}
      >
        <TextInput
          style={{
            height: 50,
            color: colors.textColor,
            width: "80%",

            borderRadius: 5,
            padding: 5,
            marginTop: 3,
          }}
          multiline
          value={messages}
          onChangeText={change}
          placeholder="Text"
          placeholderTextColor={"rgba(255,255,255,0.6)"}
        />

        <IconPress
          click={
            messages == ""
              ? null
              : () =>
                  submitToMessages(Math.random().toString(36).substring(2, 17))
          }
          children={
            <FontAwesome
              name="send"
              size={30}
              color={messages !== "" ? colors.brand : colors.disbrand}
            />
          }
        />
      </HStack>
    </Box>
  );
}

export default MessagesInput;
