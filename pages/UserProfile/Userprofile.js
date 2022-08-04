import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  serverTimestamp,
  getDatabase,
  ref,
  set,
  onValue,
  onChildAdded,
} from "firebase/database";
import { Avatar, Box, HStack, Pressable, VStack, FlatList } from "native-base";
import React, { useState, useEffect, useLayoutEffect } from "react";
import CText from "../../constants/Text";
import useStore from "../../store/user";
import ProfilePost from "../../screens/ProfileContents/ProfilePosts";
import Loading from "../../screens/Loading";

function UserProfile({ route, navigation }) {
  const quiver = useStore((state) => state.quiver);
  const searchedUser = useStore((state) => state.searchedUser);
  const searchedUserPost = useStore((state) => state.searchedUserPost);
  const user = useStore((state) => state.user);
  const users = useStore((state) => state.users);
  const [load, setLoad] = useState(false);
  const [status, setStatus] = useState();
  const [userPost, setUserPost] = useState();
  const [inQuiver, setInQuiver] = useState();
  const [inhasQuiver, setInhasQuiver] = useState();
  const [SpecUser, setSpecUser] = useState();
  const [SpecPhoto, setSpecPhoto] = useState();
  const { itemID, itemS, post } = route.params;
  const clearToast = useStore((state) => state.clearToast);
  const showToast = () => {
    ToastAndroid.show(toastt, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    setTimeout(() => {
      clearToast();
    }, 2000);
  };
  const toastt = useStore((state) => state.toast);
  const toasted = useStore((state) => state.toasted);

  const whoseQuiver = useStore((state) => state.whoseQuiver);
  const hasQuiver = useStore((state) => state.hasQuiver);
  const inHasQuiver = useStore((state) => state.inHasQuiver);
  toastt !== "" ? showToast() : null;

  const PostRender = ({ item }) => {
    return <ProfilePost item={item} navigation={navigation} post={userPost} />;
  };

  const pushToFirestore = (val) => {
    followUser();
    const db = getDatabase();
    set(
      ref(
        db,
        "notifications/" +
          itemID +
          "/info/" +
          Math.random().toString(36).slice(2, 16)
      ),
      {
        type: `new following`,
        from: getAuth().currentUser.uid,
        time: serverTimestamp(),
        info: " follows you.",
        isRead: "false",
      }
    )
      .then(() => setStatus("Following"))
      .catch((e) => toasted("request failed"));
  };

  const followUser = () => {
    const db = getDatabase();
    set(ref(db, "inQuiver/" + Math.random().toString(36).slice(2, 16)), {
      type: `new following`,
      currentUser: itemID,
      followedBy: getAuth().currentUser.uid,
    })
      .then(() => setStatus("Following"))
      .catch((e) => {});
  };

  const checkStatus = () => {
    let inQuiver = [];
    inHasQuiver.map((has) => {
      inQuiver.push(has.id);
    });
    inQuiver;
    if (inQuiver.includes(itemID)) {
      setStatus("Following");
    } else {
      setStatus("Follow");
    }
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      // headerRight: () => (
      //   <Box p={2}>
      //     <Ionicons
      //       name="information-circle-outline"
      //       size={24}
      //       color={colors.textColor}
      //     />
      //   </Box>
      // ),

      headerTitle: () => <CText text={SpecUser} size={"md"} />,
    });
  }, [navigation]);

  useEffect(() => {
    setInQuiver(whoseQuiver);
    setInhasQuiver(hasQuiver);

    checkStatus();
    try {
      let Check = [];
      searchedUser.forEach((ele) => {
        setSpecUser(ele.name);
        setSpecPhoto(ele.photo);
      });
      setUserPost(
        searchedUserPost.sort((x, y) => {
          return x.info.time - y.info.time;
        })
      );
    } catch {}

    setTimeout(() => {
      setLoad(!load);
    }, 3000);
    navigation.setOptions({
      headerTitle: () => <CText text={SpecUser} size={"md"} />,
    });
    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
    });
    return () => {};
  }, [navigation, SpecUser]);
  try {
    if (load !== true) {
      return <Loading />;
    }
    return (
      <Box flex={1} bg="brand.100">
        <Box safeAreaTop />
        <VStack space={3}>
          <Box bg="brand.400" p={3}>
            <Box flexDirection={"row"}>
              <Box justifyContent="space-between">
                <HStack space="lg" w="full" justifyContent="space-between">
                  <HStack
                    w="full"
                    space="10"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Avatar
                      size="xl"
                      source={{
                        uri: SpecPhoto || quiver,
                      }}
                    />

                    <VStack p={1} justifyContent={"center"}>
                      <CText text={SpecUser} />
                      <HStack
                        alignItems="center"
                        space={3}
                        justifyContent={"space-evenly"}
                      >
                        <VStack alignItems="center">
                          {/* <CText
                            text={"has"}
                            size="sm"
                            style={{ opacity: 0.4 }}
                          /> */}
                          <CText
                            text={hasQuiver.length || 0}
                            size="lg"
                            style={{ opacity: 0.9, fontWeight: "bold" }}
                          />
                          <CText
                            text={"followers"}
                            size="sm"
                            style={{ opacity: 0.4 }}
                          />
                        </VStack>
                        <VStack alignItems="center">
                          {/* <CText
                            text={"in"}
                            size="sm"
                            style={{ opacity: 0.4 }}
                          /> */}
                          <CText
                            text={whoseQuiver.length || 0}
                            size="lg"
                            style={{ opacity: 0.9, fontWeight: "bold" }}
                          />
                          <CText
                            text={"following"}
                            size="sm"
                            style={{ opacity: 0.4 }}
                          />
                        </VStack>
                      </HStack>
                      <VStack alignItems="center" mt={3}>
                        {/* {status === "Following" ? (
                          <Box bg="gray.900" p={2} rounded="sm">
                            <CText text={status} />
                          </Box>
                        ) : null} */}
                        {status == "Follow" ? (
                          <Pressable onPress={() => pushToFirestore()}>
                            {({ isHovered, isFocused, isPressed }) => {
                              return (
                                <Box
                                  bg={"brand.700"}
                                  p={2}
                                  rounded="sm"
                                  opacity={isFocused ? 0.5 : 1}
                                  style={{
                                    transform: [
                                      {
                                        scale: isPressed ? 0.96 : 1,
                                      },
                                    ],
                                  }}
                                >
                                  <CText text={status} />
                                </Box>
                              );
                            }}
                          </Pressable>
                        ) : (
                          <Box bg="gray.900" p={2} rounded="sm">
                            <CText text={status} />
                          </Box>
                        )}
                      </VStack>
                    </VStack>
                  </HStack>
                  {/* <HStack space="5" alignItems="center"></HStack> */}
                </HStack>
              </Box>
              {/* <Box>
                <CText text={"Edit"} size="sm" />
              </Box> */}
            </Box>
          </Box>

          <Box bg="brand.400" h="auto" p={2}>
            <CText style={{ opacity: 0.4 }} text={"Post"} size="sm" />
            <Box w="full" alignItems={"center"} p={2}>
              <FlatList
                data={userPost}
                initialNumToRender={6}
                numColumns={3}
                renderItem={PostRender}
                // onRefresh={onRefresh}
                // refreshing={isFetching}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={
                  userPost == undefined ? null : (
                    <Box flex={1} alignItems="center">
                      <CText
                        text={"No Posts"}
                        size="xl"
                        style={{ opacity: 0.3 }}
                      />
                    </Box>
                  )
                }
                // onTouchStart={() =>  ("tapped", item)}
              />
            </Box>
          </Box>
        </VStack>
      </Box>
    );
  } catch (e) {
    e;
    return (
      <Box flex={1} bg="brand.100">
        <Box flex={1} justifyContent="center" alignItems={"center"} p={3}>
          <Box flex={1}>
            {load ? (
              <Loading />
            ) : (
              <CText style={{ opacity: 0.4 }} text={"Not Found"} size="lg" />
            )}
          </Box>
        </Box>
      </Box>
    );
  }
}

export default UserProfile;
