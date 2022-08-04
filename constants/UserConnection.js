import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
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
import { getAuth, onAuthStateChanged } from "firebase/auth";

import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";
import { app } from "../Firebase";
import CText from "./Text";

function UserConnection({ id, pid }) {
  const [text, setText] = useState();
  const [count, setCount] = useState("offline");

  useEffect(() => {
    let data;
    let check = [];
    const dbRef = getDatabase();
    const reff = ref(dbRef, `userConnection/${id}`); //retrieve posts
    const ordered = query(reff); //orders by time
    onChildAdded(ordered, async (snapshot) => {
      if (snapshot.val() == true) {
        setCount("online");
      }

      // console.log(snapshot.val(), "clique val");
    });

    return () => {
      setCount();
    };
  }, [id]);

  return (
    <Box>
      <CText text={count} size="sm" style={{ opacity: 0.5 }} />
    </Box>
  );
}

export default UserConnection;
