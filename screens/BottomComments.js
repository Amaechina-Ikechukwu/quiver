import React, {
  useState,
  useEffect,
  memo,
  useRef,
  useMemo,
  useCallback,
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
  useBreakpointValue,
} from "native-base";
import {
  KeyboardAvoidingView,
  View,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  Platform,
} from "react-native";
import { ToastAndroid } from "react-native";
import useStore from "../store/user";
import useNewStore from "../store/post";
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
import colors from "../colors";
import CText from "../constants/Text";
import UploadAlert from "../constants/UploadAlert";
import moment from "moment";
import IconPress from "../constants/IconPress";
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
import IconAction from "../constants/IconAction";
import Loading from "../screens/Loading";
import BottomSheet from "@gorhom/bottom-sheet";
import Pressing from "../constants/Pressing";
import CommentsRender from "../pages/CommentsFolder/CommentsRender";

function BottomComments() {
  const postComment = useStore((state) => state.postComment);
  const [postcomments, setpostComments] = useState();
  const [isFreshing, setIsFreshing] = useState(false);
  const [comments, setComments] = useState("");
  const [postItem, setPostItem] = useState(item);
  const bottomSheetRef = useRef(null);
  const [keyboardStatus, setKeyboardStatus] = useState();

  // variables
  const snapPoints = useMemo(() => ["65%", "95%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    "handleSheetChanges", index;
  }, []);

  const setLike = useStore((state) => state.setLike);
  const setComment = useStore((state) => state.setComment);
  const likesCount = useStore((state) => state.likesCount);
  const item = useStore((state) => state.item);
  const setOpenComment = useStore((state) => state.setOpenComment);
  const createAlert = useStore((state) => state.setAlert);

  const setInput = useStore((state) => state.setInput);

  const CommentItems = ({ item, navigation }) => {
    return <CommentsRender item={item} navigation={navigation} />;
  };

  const change = (e) => {
    e;
    setComments(e);
  };

  const onRefresh = () => {
    setIsFreshing(!isFreshing);
  };

  const submitToComments = () => {
    const auth = getAuth();
    const db = getDatabase();
    set(
      ref(
        db,
        `comments/${postItem.id}/${Math.random().toString(36).substring(2, 17)}`
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
        }, 600);
      })
      .catch((error) => {
        //  (error);
        // setErrorr("error, please re-enter the fields and try again");
      });
  };
  const isLargeScreen = useBreakpointValue({
    base: false,
    sm: false,
    md: false,
    lg: true,
  });

  const handleClose = () => {
    setOpenComment(false);
    setInput(false);
    Keyboard.dismiss();
  };

  useEffect(() => {
    "likes count", likesCount.length;
    setPostItem(item);
    setpostComments(
      postComment.sort((x, y) => {
        return y.time - x.time;
      })
    );

    const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardStatus(true);
    });
    const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardStatus(false);
    });

    return () => {
      showSubscription.remove();
      hideSubscription.remove();
      setpostComments();
      setPostItem();
    };
  }, [postComment]);
  if (item == undefined || postItem == undefined) {
    return <Loading />;
  } else {
    return (
      <BottomSheet
        ref={bottomSheetRef}
        index={keyboardStatus == true ? 0 : 1}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        backgroundStyle={{ backgroundColor: colors.primary }}
        handleIndicatorStyle={{ backgroundColor: colors.textColor }}
        enablePanDownToClose={true}
        onClose={() => handleClose()}
      >
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={{ flex: 1, justifyContent: "space-between" }}
        >
          <FlatList
            contentContainerStyle={{
              flex: 1,

              padding: 2,
            }}
            data={postcomments}
            extradata={postcomments}
            // initialNumToRender={10}
            renderItem={CommentItems}
            onRefresh={onRefresh}
            refreshing={isFreshing}
            keyExtractor={(item) =>
              item.id + Math.random().toString(36).substring(2, 17)
            }
            ListHeaderComponentStyle={{ paddingHorizontal: 10 }}
            ListHeaderComponent={
              <CText text={"Comments"} size="md" style={{ opacity: 0.5 }} />
            }
            // ListFooterComponentStyle={{
            //   backgroundColor: "blue",
            //   padding: 2,
            // }}
            // ListFooterComponent={

            // }
            ListEmptyComponent={
              postcomments == undefined ? null : (
                <Box alignItems="center">
                  <CText
                    text={"No Comments"}
                    size="xl"
                    style={{ opacity: 0.3 }}
                  />
                </Box>
              )
            }
          />
          <Box>
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
                placeholder="Add caption"
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
        </KeyboardAvoidingView>
      </BottomSheet>
    );
  }
}

export default BottomComments;
