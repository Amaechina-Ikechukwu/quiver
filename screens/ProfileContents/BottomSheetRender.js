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
import Pressing from "../../constants/Pressing";
import CommentsRender from "../../pages/CommentsFolder/CommentsRender";

function PhotoBottomSheet({ item, close, pushClose, comments }) {
  const postComment = useStore((state) => state.postComment);
  const [postcomments, setpostComments] = useState();
  const [isFreshing, setIsFreshing] = useState(false);
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["50%", "95%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    "handleSheetChanges", index;
  }, []);

  const setLike = useStore((state) => state.setLike);
  const setComment = useStore((state) => state.setComment);
  const likesCount = useStore((state) => state.likesCount);

  const CommentItems = ({ item, navigation }) => {
    return <CommentsRender item={item} navigation={navigation} />;
  };

  const onRefresh = () => {
    setIsFreshing(!isFreshing);
  };

  useEffect(() => {
    "likes count", likesCount.length;
    setpostComments(
      postComment.sort((x, y) => {
        return y.time - x.time;
      })
    );

    return () => {
      setpostComments();
    };
  });
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: colors.primary }}
      handleStyle={{ backgroundColor: colors.sec }}
      enablePanDownToClose={true}
      onClose={close || pushClose}
    >
      <Box bg="brand.100" flex={1}>
        <Box bg="brand.100">
          <VStack space={3}>
            <ImageBackground
              source={{ uri: item.info.photoURL }}
              resizeMode="cover"
              style={{
                aspectRatio: 3 / 3,
              }}
              imageStyle={{ borderRadius: 10 }}
            >
              <VStack flex={1} justifyContent={"flex-end"}>
                <Box backgroundColor={"rgba(0,0,0,0.5)"} p={2}>
                  <VStack space={3}>
                    <HStack space={2}>
                      <CText
                        text={"Likes"}
                        size="sm"
                        style={{ opacity: 0.5 }}
                      />
                      <VStack>
                        <CText
                          text={likesCount.length}
                          size="sm"
                          style={{ opacity: 0.8, fontWeight: "bold" }}
                        />
                      </VStack>
                    </HStack>

                    <HStack space={2}>
                      <CText
                        text={"Caption"}
                        size="sm"
                        style={{ opacity: 0.5 }}
                      />
                      <VStack>
                        <CText
                          text={item.info.caption}
                          size="sm"
                          style={{ opacity: 0.8, fontWeight: "bold" }}
                        />
                      </VStack>
                    </HStack>
                  </VStack>
                </Box>
              </VStack>
            </ImageBackground>
            <Box p={2}>
              <CText text={"Comments"} size="md" style={{ opacity: 0.5 }} />
              <FlatList
                data={postcomments}
                extradata={postcomments}
                // initialNumToRender={10}
                renderItem={CommentItems}
                onRefresh={onRefresh}
                refreshing={isFreshing}
                keyExtractor={(item) => item.id}
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
            </Box>
          </VStack>
        </Box>
      </Box>
    </BottomSheet>
  );
}

export default PhotoBottomSheet;
