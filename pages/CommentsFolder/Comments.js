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
import CommentsRender from "./CommentsRender";

const CommentItems = ({ item, navigation }) => {
  return <CommentsRender item={item} navigation={navigation} />;
};

function CommentPage({ route, navigation }) {
  const { props } = route.params;
  "props", props;
  const getConnection = useStore((state) => state.getConnection);
  const createAlert = useStore((state) => state.setAlert);
  const postComment = useStore((state) => state.postComment);
  const setComment = useStore((state) => state.setComment);
  const [comments, setComments] = useState("");
  const [postcomments, setpostComments] = useState();
  const [userActive, setUserActive] = useState();

  const connect = async (uid) => {
    const db = getDatabase();
    var myConnectionsRef = await ref(db, `connection/${uid}`);
    let on;
    // stores the timestamp of my last disconnect (the last time I was seen online)
    var lastOnlineRef = await ref(db, `connection/${uid}/lastOnline`);

    var connectedRef = await ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        const con = push(myConnectionsRef);

        // When I disconnect, remove this device
        onDisconnect(con).remove();

        // Add this device to my connections list
        // this value could contain info about the device or a timestamp too
        set(con, true);

        // When I disconnect, update the last time I was seen online
        onDisconnect(lastOnlineRef).set(serverTimestamp());

        setUserActive(true);
      } else {
        setUserActive(false);
      }
    });
  };

  try {
    useEffect(() => {
      connect(props.info.uid);
      setpostComments(
        postComment.sort((x, y) => {
          return y.time - x.time;
        })
      );
    }, [postComment]);
  } catch (e) {
    "useefect", e;
  }

  const change = (e) => {
    e;
    setComments(e);
  };

  const UploadToProfile = (downloadURL) => {
    const auth = getAuth();
    const db = getDatabase();
    set(
      ref(
        db,
        "users/" +
          props.info.uid +
          `/posts/${props.id}/comments/${Math.random()
            .toString(36)
            .substring(2, 17)}`
      ),
      {
        comment: comments,
        by: getAuth().currentUser.uid,
        time: serverTimestamp(),
      }
    )
      .then(() => {
        // Profile updated!
        Keyboard.dismiss();
        setComments("");
        setTimeout(() => {
          createAlert("commented");
        }, 2000);
      })
      .catch((error) => {
        //  (error);
        createAlert("An error occured");
        // setErrorr("error, please re-enter the fields and try again");
      });
  };

  const submitToComments = () => {
    const auth = getAuth();
    const db = getDatabase();
    set(
      ref(
        db,
        `comments/${props.id}/${Math.random().toString(36).substring(2, 17)}`
      ),
      {
        comment: comments,
        by: getAuth().currentUser.uid,
        time: serverTimestamp(),
      }
    )
      .then(() => {
        Keyboard.dismiss();
        setComments("");
        setTimeout(() => {
          createAlert("commented");
        }, 500);
      })
      .catch((error) => {
        //  (error);
        // setErrorr("error, please re-enter the fields and try again");
      });
  };

  try {
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    return (
      <Box flex={1} bg="brand.100">
        <UploadAlert />

        <Box flex={1}>
          <VStack flex={1} justifyContent={"space-between"}>
            <Box h="93%">
              <FlatList
                ListHeaderComponent={
                  <HStack flexDirection="column">
                    <GestureRecognizer
                      config={config}
                      style={{ flex: 1 }}
                      onSwipeDown={() => navigation.goBack()}
                    >
                      <ImageBackground
                        source={{ uri: props.info.photoURL }}
                        resizeMode="cover"
                        style={{
                          aspectRatio: 1 / 1,
                          width: "100%",
                        }}
                        imageStyle={{ borderRadius: 10 }}
                      >
                        <VStack flex={1} justifyContent={"flex-end"}>
                          <Box backgroundColor={"rgba(0,0,0,0.5)"} p={2}>
                            <HStack space={3} alignItems="center">
                              <VStack flexDirection={"column-reverse"}>
                                <Box // bg="red.400"
                                  bg={
                                    userActive == true
                                      ? "brand.700"
                                      : "gray.200"
                                  }
                                  rounded="full"
                                  position="absolute"
                                  variant="solid"
                                  zIndex={1}
                                  alignSelf="flex-end"
                                  w={2}
                                  h={2}
                                />
                                <Avatar
                                  size={"sm"}
                                  bg="brand.400"
                                  source={{
                                    uri: props.photo,
                                  }}
                                >
                                  Q
                                </Avatar>
                              </VStack>
                              <VStack>
                                <CText
                                  text={props.by}
                                  size="sm"
                                  style={{ opacity: 0.8 }}
                                />
                                <CText
                                  text={moment(props.info.time).fromNow()}
                                  size="sm"
                                  style={{ opacity: 0.6 }}
                                />
                              </VStack>
                            </HStack>
                          </Box>
                        </VStack>
                      </ImageBackground>
                    </GestureRecognizer>
                    <Box px={3}>
                      <CText
                        text={"Comments"}
                        size="md"
                        style={{ opacity: 0.5 }}
                      />
                    </Box>
                  </HStack>
                }
                data={postcomments}
                extradata={postComment}
                // initialNumToRender={10}
                renderItem={CommentItems}
                // onRefresh={onRefresh}
                // refreshing={isFetching}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={postcomments == "" ? null : <Loading />}
              />
            </Box>
            <Box bg={"blue.300"}>
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
                  value={comments}
                  onChangeText={change}
                  placeholder="Add comment"
                  placeholderTextColor={"rgba(255,255,255,0.6)"}
                />
                <IconPress
                  click={() => submitToComments()}
                  children={
                    <FontAwesome name="send" size={30} color={colors.brand} />
                  }
                />
              </HStack>
            </Box>
          </VStack>
        </Box>
      </Box>
    );
  } catch (e) {
    e;
    return (
      <Box bg={"brand.100"} flex={1}>
        <CText text={"Error"} size="sm" style={{ opacity: 0.7 }} />
      </Box>
    );
  }
}

export default CommentPage;
