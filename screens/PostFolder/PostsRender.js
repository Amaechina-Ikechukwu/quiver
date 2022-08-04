import React, { useState, useEffect, memo } from "react";
import {
  Avatar,
  Badge,
  Box,
  Button,
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
import {
  View,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
  ImageBackground,
} from "react-native";
import { ToastAndroid } from "react-native";

import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import useStore from "../../store/user";
import colors from "../../colors";
import CText from "../../constants/Text";
import moment from "moment";
import IconPress from "../../constants/IconPress";
import {
  getDatabase,
  ref,
  set,
  remove,
  update,
  serverTimestamp,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import IconAction from "../../constants/IconAction";
import { useNavigation } from "@react-navigation/native";
import UploadAlert from "../../constants/UploadAlert";
import Header from "../../pages/Header";
function PostRender({ item }, props) {
  const [size, reSize] = useState(false);
  const likePost = (postId, from) => {
    const db = getDatabase();
    const user = `${getAuth().currentUser.uid}`;
    "likePost", postId, from;
    set(ref(db, `likes/` + `${postId}/${user}`), { user: true }).then(() => {
      if (item.info.uid !== user) {
        set(
          ref(
            db,
            "notifications/" +
              item.info.uid +
              "/info/" +
              Math.random().toString(36).slice(2, 16)
          ),
          {
            type: `new like`,
            from: getAuth().currentUser.uid,
            time: serverTimestamp(),
            info: " liked your post.",
            postPhoto: item.info.photoURL,
          }
        );
      }
    });
  };

  const dellikePost = (postId, from) => {
    const db = getDatabase();
    const user = `${getAuth().currentUser.uid}`;
    "dislikePost", postId, from;
    set(ref(db, `likes/` + `${postId}/${user}`), { user: false });
  };

  const setComment = useStore((state) => state.setComment);
  const setOpenComment = useStore((state) => state.setOpenComment);
  const setItem = useStore((state) => state.setItem);
  const setInput = useStore((state) => state.setInput);
    const setWhoseCliques = useStore((state) => state.setWhoseCliques);
  const sethasCliques = useStore((state) => state.sethasCliques);
   const setSearchedUserData = useStore((state) => state.setSearchedUserData);
   const setSearchedUserPost = useStore((state) => state.setSearchedUserPost);

  const navigation = useNavigation();
  const openComment = (item) => {
    setItem(item);
    navigation.navigate("Comments", { props: item });

    setComment(item.id);
  };

  const navigate = (item) => {
    const auth = getAuth().currentUser.uid;
    setWhoseCliques(item);
    sethasCliques(item);
    setSearchedUserData(item);
    setSearchedUserPost(item);
    navigation.navigate(item == auth ? "ProfilePage" : "UserProfile", {
      itemID: item,
    });
  };

  useEffect(() => {
    return () => {};
  });

  return (
    <Box borderBottomWidth="1" borderColor="brand.400" flex={1}>
      <Box p={3}>
        <HStack
          p="2"
          space={2}
          alignItems="center"
          justifyContent="space-between"
        >
          <IconPress
            click={() => navigate(item.info.uid)}
            children={
              <HStack space={2} alignItems="center">
                <Avatar
                  size="sm"
                  source={{
                    uri: item.photo,
                  }}
                />
                <CText text={item.by} size="sm" style={{ opacity: 0.9 }} />
              </HStack>
            }
          />

          <CText
            text={moment(item.info.time).fromNow()}
            size="sm"
            style={{ opacity: 0.6 }}
          />
        </HStack>

        <VStack space={3}>
          <ImageBackground
            resizeMode={size == true ? "contain" : "cover"}
            source={{
              uri: item.info.photoURL,
            }}
            alt="Alternate Text"
            style={{
              aspectRatio: 1 / 1,

              borderRadius: 10,
              justifyContent: "flex-end",
            }}
            imageStyle={{ borderRadius: 10 }}
          >
            <IconPress
              style={{
                alignItems: "flex-end",
                paddingHorizontal: 5,
                paddingVertical: 2,
              }}
              click={() => reSize(!size)}
              children={
                <Box bg="rgba(0,0,0,0.4)" p={2} rounded="sm">
                  <MaterialIcons name="zoom-out-map" size={24} color="white" />
                </Box>
              }
            />
          </ImageBackground>

          <HStack space={5} alignItems="center">
            <IconAction
              postId={item.id}
              clickDislike={() =>
                dellikePost(item.id, getAuth().currentUser.uid)
              }
              clickLike={() => likePost(item.id, getAuth().currentUser.uid)}
            />
            <Pressable onPress={() => openComment(item)}>
              {({ isHovered, isFocused, isPressed }) => {
                return (
                  <Box
                    rounded="sm"
                    opacity={isPressed ? 0.5 : 1}
                    style={{
                      transform: [
                        {
                          scale: isPressed ? 0.96 : 1,
                        },
                      ],
                    }}
                  >
                    <EvilIcons
                      name="comment"
                      size={35}
                      color={colors.textColor}
                    />
                  </Box>
                );
              }}
            </Pressable>
            {/* 
            <IconPress
              click={() =>
                props.navigation.navigate("Comments", {
                  props: item,
                })
              }
              children={
                <EvilIcons name="comment" size={35} color={colors.textColor} />
              }
            /> */}
            <IconPress
              children={
                <Ionicons
                  name="share-outline"
                  size={30}
                  color={colors.textColor}
                />
              }
            />
          </HStack>
          <CText text={item.info.caption} size="sm" style={{ opacity: 0.7 }} />
        </VStack>
      </Box>
    </Box>
  );
}

export default memo(PostRender);
