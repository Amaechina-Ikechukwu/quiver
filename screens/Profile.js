import {
  Avatar,
  Box,
  HStack,
  Pressable,
  VStack,
  FlatList,
  Center,
  ZStack,
} from "native-base";
import React, {
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import CText from "../constants/Text";
import useStore from "../store/user";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import {
  View,
  StatusBar,
  Image,
  SafeAreaView,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  Text,
  Dimensions,
} from "react-native";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithCredential,
  signOut,
} from "firebase/auth";
import ProfilePost from "./ProfileContents/ProfilePosts";
import Loading from "./Loading";
import { useNavigation } from "@react-navigation/native";
import colors from "../colors";
import BottomSheet from "@gorhom/bottom-sheet";
import IconPress from "../constants/IconPress";
import PhotoBottomSheet from "./ProfileContents/BottomSheetRender";
import ProfileMenu from "./ProfileContents/ProfileMenu";

function ProfilePage({ route }) {
  const userData = useStore((state) => state.userData);
  const quiver = useStore((state) => state.quiver);
  const inQuiver = useStore((state) => state.inQuiver);
  const inHasQuiver = useStore((state) => state.inHasQuiver);
  const user = useStore((state) => state.user);

  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");

  const posts = useStore((state) => state.posts);

  const [item, setItem] = useState();
  const [close, setClose] = useState(true);
  const [meUser, setmeUser] = useState(true);

  const [post, setPost] = useState(
    userData.sort((x, y) => {
      return y.info.time - x.info.time;
    })
  );

  const PostRender = ({ item }) => {
    return <ProfilePost item={item} navigation={navigation} post={post} />;
  };

  const navigateToShowPost = (item) => {
    handleSheetChanges(2);
    setComment(item.id);
    setLike(item.id);
    setItem(item);
    setClose(!close);
  };
  const auth = getAuth().currentUser;
  useEffect(() => {
    // let newPost = [];
    // for (var i = 0; i < userData.length; i++) {
    //   console.log(userData[i]);
    // }
    setmeUser(auth);
    setPost(
      userData.sort((x, y) => {
        return y.info.time - x.info.time;
      })
    );
    return () => {};
  });

  const navigation = useNavigation();

  try {
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
                        uri: meUser.photoURL || quiver,
                      }}
                    />
                    <VStack p={1} justifyContent={"center"}>
                      <CText text={meUser.displayName} />
                      <HStack
                        alignItems="center"
                        justifyContent={"space-evenly"}
                      >
                        <VStack alignItems="center">
                          <CText
                            text={"has"}
                            size="sm"
                            style={{ opacity: 0.4 }}
                          />
                          <CText
                            text={inHasQuiver.length || 0}
                            size="lg"
                            style={{ opacity: 0.9, fontWeight: "bold" }}
                          />
                          <CText
                            text={"cliques"}
                            size="sm"
                            style={{ opacity: 0.4 }}
                          />
                        </VStack>
                        <VStack alignItems="center">
                          <CText
                            text={"in"}
                            size="sm"
                            style={{ opacity: 0.4 }}
                          />
                          <CText
                            text={inQuiver.length || 0}
                            size="lg"
                            style={{ opacity: 0.9, fontWeight: "bold" }}
                          />
                          <CText
                            text={"quivers"}
                            size="sm"
                            style={{ opacity: 0.4 }}
                          />
                        </VStack>
                      </HStack>
                    </VStack>
                  </HStack>
                </HStack>
              </Box>
              {/* <Box>
                <CText text={"Edit"} size="sm" />
              </Box> */}
            </Box>
          </Box>
          <Box bg="brand.400" p={2}>
            <CText style={{ opacity: 0.4 }} text={"Moments"} size="sm" />
            <Box p={2}>
              <FlatList
                data={post}
                extradata={userData}
                horizontal
                renderItem={PostRender}
                // onRefresh={onRefresh}
                // refreshing={isFetching}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={post == "" ? null : <Loading />}
              />
            </Box>
          </Box>
          <Box bg="brand.400" h="auto" p={2}>
            <CText style={{ opacity: 0.4 }} text={"Post"} size="sm" />
            <Box w="full" alignItems={"center"} p={2}>
              <FlatList
                data={post}
                extradata={userData}
                initialNumToRender={6}
                numColumns={3}
                renderItem={PostRender}
                // onRefresh={onRefresh}
                // refreshing={isFetching}
                keyExtractor={(item) => item.id}
                ListEmptyComponent={post == "" ? null : <Loading />}
                // onTouchStart={() => console.log("tapped", item)}
              />
            </Box>
          </Box>
        </VStack>
        <ProfileMenu />
        {close == false ? (
          <PhotoBottomSheet item={item} close={() => setClose(!close)} />
        ) : null}
      </Box>
    );
  } catch (e) {
    console.log(e);
    return (
      <Box>
        <CText text={"Error"} size="sm" style={{ opacity: 0.7 }} />
      </Box>
    );
  }
}

export default ProfilePage;
