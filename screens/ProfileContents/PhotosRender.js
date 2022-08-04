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
import BottomSheet from "@gorhom/bottom-sheet";
import PhotoBottomSheet from "./BottomSheetRender";
import { useNavigation } from "@react-navigation/native";
function PhotosRender({ route }) {
  const { post, pushItem, showSheet, closeSheet } = route.params;

  const [item, setItem] = useState();
  const [close, setClose] = useState(true);
  const [closesheet, setCloseSheet] = useState(showSheet);

  const bottomSheetRef = useRef(null);
  const navigation = useNavigation();
  // variables
  const snapPoints = useMemo(() => ["50%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    "handleSheetChanges", index;
  }, []);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };
  const postComment = useStore((state) => state.postComment);

  const setLike = useStore((state) => state.setLike);
  const setComment = useStore((state) => state.setComment);

  const navigateToShowPost = (item) => {
    setComment(item.id);
    setLike(item.id);
    setItem(item);
    // setClose(!close);
    // setCloseSheet(!showSheet);
    navigation.navigate("PhotoComments", { props: item });
  };

  useEffect(() => {
    // for (var i = 0; i < postComment.length; i++) {
    //    ("from  BottomComment", postComment[i]);
    // }
    return () => {};
  });

  return (
    <Box flex={1} py={5} bg="brand.100" alignItems={"center"}>
      <FlatList
        data={post}
        extradata={post}
        // initialNumToRender={10}
        numColumns={2}
        renderItem={({ item }) => {
          return (
            <GestureRecognizer
              onSwipeDown={() => navigation.goBack()}
              config={config}
              style={{ backgroundColor: colors.primary }}
            >
              <IconPress
                click={() => navigateToShowPost(item)}
                children={
                  <Image
                    source={{
                      uri: item.info.photoURL,
                    }}
                    alt={item.info.caption}
                    style={{
                      width: 200,
                      height: 200,

                      marginHorizontal: 1,
                      borderRadius: 10,
                      marginVertical: 2,
                    }}
                  />
                }
              />
            </GestureRecognizer>
          );
        }}
        // onRefresh={onRefresh}
        // refreshing={isFetching}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={post == "" ? null : <Loading />}
      />
    </Box>
  );
}

export default memo(PhotosRender);
