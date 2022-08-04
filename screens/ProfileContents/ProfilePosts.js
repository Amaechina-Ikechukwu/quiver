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
import { useNavigation } from "@react-navigation/native";
import SinglePost from "./SinglePost";
import PhotoBottomSheet from "./BottomSheetRender";

function ProfilePost({ item, post }) {
  const [showModal, setShowModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const setComment = useStore((state) => state.setComment);
  const setLike = useStore((state) => state.setLike);

  const [close, setClose] = useState(false);

  const navigation = useNavigation();
  const navigateToShowPost = () => {
    navigation.navigate("PhotosRender", {
      post: post,
      showSheet: false,
      pushItem: item,
      closeSheet: true,
    });
    setComment(item.id);
    setLike(item.id);
  };

  const closeShowModal = () => {
    setShowModal(!showModal);
  };
  const openSearchModal = () => {
    setShowModal(!showModal);
  };

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  useEffect(() => {
    return () => {};
  });

  return (
    <Box bg="brand.200" alignItems={"center"}>
      <GestureRecognizer
        onSwipeDown={() => navigation.goBack()}
        onSwipeUp={() =>
          navigation.navigate("PhotosRender", {
            post: post,
          })
        }
        config={config}
        style={{ backgroundColor: colors.primary }}
      >
        <IconPress
          bg="brand.400"
          click={() => navigateToShowPost()}
          children={
            <Image
              resizeMode="cover"
              source={{
                uri: item.info.photoURL,
              }}
              alt={item.info.caption}
              style={{
                width: 130,
                height: 130,

                marginHorizontal: 1,
                borderRadius: 5,
                marginVertical: 2,
              }}
            />
          }
        />
      </GestureRecognizer>
    </Box>
  );
}

export default memo(ProfilePost);
