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
import PostModals from "./PostModal";
import SearchModal from "../Modals/SearchModal";
import FunModal from "../Modals/F(x)Modal";
import { getUsers } from "../store/functions/getusers";
import { getAuth } from "firebase/auth";
import { Link } from "@react-navigation/native";
import UploadAlert from "../constants/UploadAlert";
import PostPage from "./Postpage";
import CText from "../constants/Text";
import moment from "moment";
import Header from "../pages/Header";
import IconPress from "../constants/IconPress";
import { getDatabase, ref, set, remove } from "firebase/database";

function HomePage({ navigation }) {
  const posts = useStore((state) => state.posts);
  const [showModal, setShowModal] = useState(false);
  const [getModal, setGetModal] = useState(false);
  const use = useStore((state) => state.user);
  const online = useStore((state) => state.online);
  const ids = posts.map((o) => o.id);
  const [post, setPost] = useState(
    posts.filter(({ id }, index) => !ids.includes(id, index + 1))
  );
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

  const convertPost = () => {
    const ids = posts.map((o) => o.id);
    const filtered = posts.filter(
      ({ id }, index) => !ids.includes(id, index + 1)
    );
    filtered.map((x) => {
      console.log("from filtered", x);
    });
    setPost(filtered);
  };

  let uniqueArray;

  useEffect(() => {
    // for (var i = 0; i < posts.length; i++) {
    //   console.log("fromhomepage", posts[i].info);
    // }

    // setCliques();
    setPost(posts);
    // uniqueArray = [...new Set(post)];
    // uniqueArray.map((x) => {
    //   console.log("from front unique", x.id);
    //   return x.id;
    // });

    setTimeout(() => {
      clearToast();
    }, 3000);
  }, [post]);

  const likePost = (postId, from) => {
    const db = getDatabase();
    console.log("likePost", postId, from);
    set(ref(db, `posts/` + postId + "/likes/" + from), {}).then(() =>
      setPost()
    );
  };

  const dellikePost = (postId, from) => {
    const db = getDatabase();
    console.log("likePost", postId, from);
    remove(ref(db, `posts/` + postId + "/likes/" + from)).then(() => setPost());
  };

  return (
    <View style={{ flex: 1, width: "100%", backgroundColor: " #151515" }}>
      <StatusBar barStyle="default" />
      <Box safeAreaTop />

      <UploadAlert />

      <PresenceTransition
        visible={true}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 250,
          },
        }}
      >
        <Box h="full">
          <Header />

          {/* <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
            <FlatList
              data={post}
              renderItem={({ item }) => {
                return (
                  <Box px={2} borderBottomWidth="1" borderColor="brand.400">
                    <Box p={1}>
                      <HStack
                        p="2"
                        space={2}
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <HStack space={2} alignItems="center">
                          <Avatar
                            size="sm"
                            source={{
                              uri: item.photo,
                            }}
                          />
                          <CText
                            text={item.by}
                            size="sm"
                            style={{ opacity: 0.9 }}
                          />
                        </HStack>

                        <CText
                          text={moment(item.info.time).fromNow()}
                          size="sm"
                          style={{ opacity: 0.6 }}
                        />
                      </HStack>

                      <VStack space={3}>
                        <Image
                          source={{
                            uri: item.info.photoURL,
                          }}
                          alt="Alternate Text"
                          style={{
                            aspectRatio: 3 / 4,

                            borderRadius: 10,
                          }}
                        />
                        <HStack space={5} alignItems="center">
                          {item.hasLike == true ? (
                            <IconPress
                              click={() => dellikePost(item.id, item.likeKey)}
                              children={
                                <FavouriteIcon size={30} color={"red.400"} />
                              }
                            />
                          ) : (
                            <IconPress
                              click={() =>
                                likePost(item.id, getAuth().currentUser.uid)
                              }
                              children={
                                <FavouriteIcon size={30} color={"brand.400"} />
                              }
                            />
                          )}

                          <IconPress
                            children={
                              <EvilIcons
                                name="comment"
                                size={35}
                                color={colors.textColor}
                              />
                            }
                          />
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
                        <CText
                          text={item.info.caption}
                          size="sm"
                          style={{ opacity: 0.7 }}
                        />
                      </VStack>
                    </Box>
                  </Box>
                );
              }}
              keyExtractor={(item) => item.id}
              //   ListEmptyComponent={
              //     <CText
              //       text={"No Posts Yet"}
              //       size="sm"
              //       style={{ opacity: 0.7 }}
              //     />
              //   }
            />
          </SafeAreaView> */}
        </Box>
      </PresenceTransition>
    </View>
  );
}

export default HomePage;
