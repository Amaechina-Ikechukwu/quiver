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
  const setHasQuiver = useStore((state) => state.setHasQuiver);
  const inHasQuiver = useStore((state) => state.inHasQuiver);
  const [isFetching, setIsFetching] = useState(false);
  const [showSuggested, setShowSuggested] = useState(false);

  const [post, setPost] = useState();
  const onRefresh = () => {
    // setIsFetching(true);
    setPosts();
  };
  const shouldSuggest = () => {
    if (inHasQuiver == []) {
      setShowSuggested(true);
    } else {
      setShowSuggested(false);
    }
  };
  console.log(inHasQuiver.length);
  const closeSuggestion = () => {
    if (inHasQuiver.length >= 1) {
      setShowSuggested(false);
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
    } catch (e) {}
    setTimeout(() => {
      shouldSuggest();
    }, 15000);

    return () => {};
  }, [openComment, posts, post, inHasQuiver]);

  try {
    if (showSuggested == true) {
      return (
        <Box flex={1} bg="brand.100">
          <SuggestedFollowing />
          <IconPress
            click={() => closeSuggestion()}
            children={
              <Box
                bg="brand.400"
                p={2}
                alignItems="center"
                w="full"
                rounded="sm"
              >
                <CText text={"Done"} />
              </Box>
            }
          />
        </Box>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: colors.primary }}>
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
