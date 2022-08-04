import React, { useState, useEffect } from "react";
import {
  Avatar,
  Badge,
  Box,
  Center,
  HStack,
  Popover,
  PresenceTransition,
  Pressable,
  Spacer,
  Text,
  VStack,
  FavouriteIcon,
  FlatList,
} from "native-base";
import { View, StatusBar, Image, SafeAreaView } from "react-native";
import { ToastAndroid } from "react-native";
import useStore from "../store/user";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
} from "@expo/vector-icons";
import colors from "../colors";
import PostModals from "./PostFolder/PostModal";
import SearchModal from "../Modals/SearchModal";
import FunModal from "../Modals/F(x)Modal";
import { getUsers } from "../store/functions/getusers";
import { getAuth } from "firebase/auth";
import { Link } from "@react-navigation/native";
import UploadAlert from "../constants/UploadAlert";

import CText from "../constants/Text";
import moment from "moment";
import Header from "../pages/Header";
import IconPress from "../constants/IconPress";
import { getDatabase, ref, set, remove } from "firebase/database";
import PostPage from "./PostFolder/Postpage";

function HomePage({ navigation }) {
  const posts = useStore((state) => state.posts);

  const clearToast = useStore((state) => state.clearToast);
  //   const showToast = () => {
  //     ToastAndroid.show(toastt, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
  //     setTimeout(() => {
  //       clearToast();
  //     }, 2000);
  //   };
  //   const toastt = useStore((state) => state.toast);

  //   toastt !== "" ? showToast() : null;
  const setPosts = useStore((state) => state.setPosts);
  //   const inQuiver = useStore((state) => state.inQuiver);
  //   const likes = useStore((state) => state.likes);
  //   setPosts();
  useEffect(() => {});

  //   const likePost = (postId, from) => {
  //     const db = getDatabase();
  //      ("likePost", postId, from);
  //     set(ref(db, `posts/` + postId + "/likes/" + from), {}).then(() =>
  //       setPost()
  //     );
  //   };

  //   const dellikePost = (postId, from) => {
  //     const db = getDatabase();
  //      ("likePost", postId, from);
  //     remove(ref(db, `posts/` + postId + "/likes/" + from)).then(() => setPost());
  //   };

  return <PostPage posting={posts} />;
}

export default HomePage;
