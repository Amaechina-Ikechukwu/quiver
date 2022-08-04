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
} from "@expo/vector-icons";
import colors from "../../colors";
import CText from "../../constants/Text";
import moment from "moment";
import IconPress from "../../constants/IconPress";
import { getDatabase, ref, set, remove, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import IconAction from "../../constants/IconAction";
import UploadAlert from "../../constants/UploadAlert";
import Header from "../../pages/Header";
import PostsRender from "./PostsRender";
import BottomComments from "../BottomComments";
import { useNavigation } from "@react-navigation/native";
import InputMe from "./InputMe";
import Loading from "../Loading";
import SuggestedFollowing from "./SuggestedFollowing";

const PostItems = ({ item, navigation }) => {
  return <PostsRender item={item} navigation={navigation} />;
};

function PostPage({ posting }) {
  const setPosts = useStore((state) => state.setPosts);
  const inQuiver = useStore((state) => state.inQuiver);
  const setAlert = useStore((state) => state.setAlert);
  const quiver = useStore((state) => state.quiver);
  const posts = useStore((state) => state.posts);
  const openComment = useStore((state) => state.openComment);
  const users = useStore((state) => state.users);
  const inHasQuiver = useStore((state) => state.inHasQuiver);
  const [isFetching, setIsFetching] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);
  const [post, setPost] = useState();
  const onRefresh = () => {
    // setIsFetching(true);
    setPosts();
  };
  const shouldSuggest = () => {
    if (post == undefined) {
      setShowSuggested(!showSuggested);
    }
  };
  const closeSuggestion = () => {
    if (inHasQuiver.length >= 1) {
      setShowSuggested(!showSuggested);
      setPosts();
      onRefresh();
    } else {
      setAlert("Please Follow A User");
    }
  };
  const navigation = useNavigation();
  useEffect(() => {
    try {
      let newPost = [];
      setPost(posts);
    } catch (e) {
      e;
    }
    posts;
    shouldSuggest();
    setTimeout(() => {
      shouldSuggest();
    }, 8000);

    return () => {};
  }, [openComment, posts, post, inQuiver]);

  try {
    if (showSuggested == true) {
      return (
        <Box flex={1} bg={"brand.200"}>
          <Box safeAreaTop />
          <UploadAlert />
          <Header />
          <VStack alignItems="center" justifyContent="center" flex={1}>
            <SuggestedFollowing />
            <Box w="full" p={3} bg="brand.200">
              <Pressable onPress={() => closeSuggestion()}>
                {({ isHovered, isFocused, isPressed }) => {
                  return (
                    <Box
                      alignItems={"center"}
                      bg="brand.400"
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
                      <CText text={"Done"} />
                    </Box>
                  );
                }}
              </Pressable>
            </Box>
          </VStack>
        </Box>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
        <StatusBar barStyle="default" />
        <Box safeAreaTop />

        <UploadAlert />
        <Box mb={10}>
          <Header />

          <FlatList
            data={post}
            initialNumToRender={5}
            renderItem={PostItems}
            onRefresh={onRefresh}
            refreshing={isFetching}
            keyExtractor={(item) => item.id}
            ListEmptyComponent={<Loading />}
          />
        </Box>

        <Box safeAreaBottom />
      </SafeAreaView>
    );
  } catch {
    <Box>
      <CText text={"Error"} size="sm" style={{ opacity: 0.7 }} />
    </Box>;
  }
}

export default PostPage;
