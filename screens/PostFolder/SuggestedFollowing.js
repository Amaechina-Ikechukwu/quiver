import React, {
  useState,
  useEffect,
  useCallback,
  useLayoutEffect,
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
} from "native-base";
import {
  View,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import { ToastAndroid } from "react-native";
import useStore from "../../store/user";

import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
  Feather,
} from "@expo/vector-icons";
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
import UploadAlert from "../../constants/UploadAlert";
import Header from "../../pages/Header";
import PostsRender from "./PostsRender";
import BottomComments from "../BottomComments";
import { useNavigation } from "@react-navigation/native";
import InputMe from "./InputMe";
import Loading from "../Loading";

function SuggestedFollowing({ open, onClose }) {
  const users = useStore((state) => state.users);
  const setAlert = useStore((state) => state.setAlert);
  const quiver = useStore((state) => state.quiver);
  const posts = useStore((state) => state.posts);
  const inHasQuiver = useStore((state) => state.inHasQuiver);
  const [followed, setFollowed] = useState([]);
  const setPosts = useStore((state) => state.setPosts);
  const setHasQuiver = useStore((state) => state.setHasQuiver);
  const [showSuggested, setShowSuggested] = useState(false);
  const [count, setCount] = useState(inHasQuiver.length);
  const [suggestedUsers, setSuggestedUsers] = useState(
    users.sort((x, y) => {
      return y.followers - x.followers;
    })
  );

  useLayoutEffect(() => {
    setHasQuiver();
  }, []);

  useEffect(() => {
    let getFollowid = [];
    for (var key in inHasQuiver) {
      getFollowid.push(inHasQuiver[key].id);
    }
    // setTimeout(() => {

    // }, 5000);
    setCount(inHasQuiver.length);
    // setTimeout(() => {
    if (count >= 1) {
      setShowSuggested(false);
    } else if (count == 0) {
      setShowSuggested(true);
    }
    // }, 15000);

    setFollowed(getFollowid);
  }, [inHasQuiver]);

  const closeSuggestion = () => {
    if (inHasQuiver.length >= 1) {
      setShowSuggested(false);
      setPosts();
      onClose();
    } else {
      setAlert("Please Follow A User");
    }
  };

  const pushToFirestore = (itemID) => {
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
      .catch((e) => {});
  };

  const followUser = (itemID) => {
    const db = getDatabase();
    set(ref(db, "inQuiver/" + Math.random().toString(36).slice(2, 16)), {
      type: `new following`,
      currentUser: itemID,
      followedBy: getAuth().currentUser.uid,
    })
      .then(
        () => setStatus("Following"),

        setHasQuiver(),
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
      )
      .catch((e) => {});
  };

  const navigation = useNavigation();
  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={open}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box flex={1} bg="brand.100" p={3}>
        <UploadAlert />
        <Box safeAreaTop />
        <CText text={"Hey there,"} size="2xl" />
        <HStack alignItems="center" justifyContent={"space-between"} space={5}>
          <CText text={" Follow top users to enjoy"} size="lg" />

          <IconPress
            click={() => navigation.navigate("Postpage")}
            children={
              <Box bg="brand.400" p={2} rounded="sm">
                <CText text={"Make A Post"} />
              </Box>
            }
          />
        </HStack>

        <FlatList
          data={suggestedUsers}
          renderItem={({ item }) => {
            if (item.id !== getAuth().currentUser.uid) {
              return (
                <Box w="100%" p={5}>
                  <HStack
                    w="100%"
                    px={3}
                    alignItems="center"
                    justifyContent={"space-between"}
                  >
                    <Box>
                      <Avatar
                        size="48px"
                        source={{
                          uri: item.info.photoURL || quiver,
                        }}
                      />
                    </Box>
                    <Box>
                      <CText text={item.info.displayName} size="md" />
                    </Box>
                    <Box>
                      {followed.includes(item.id) ? (
                        <Box bg="brand.400" p={2} rounded="sm">
                          <CText text={"Following"} />
                        </Box>
                      ) : (
                        <IconPress
                          click={() => followUser(item.id)}
                          children={
                            <Box bg="brand.700" p={2} rounded="sm">
                              <CText text={"Follow"} />
                            </Box>
                          }
                        />
                      )}
                    </Box>
                  </HStack>
                </Box>
              );
            }
          }}
          ListEmptyComponent={<Loading />}
        />
        <IconPress
          click={() => closeSuggestion()}
          children={
            <Box bg="brand.400" p={2} alignItems="center" w="full" rounded="sm">
              <CText text={"Done"} />
            </Box>
          }
        />
      </Box>
    </Modal>
  );
}

export default SuggestedFollowing;
