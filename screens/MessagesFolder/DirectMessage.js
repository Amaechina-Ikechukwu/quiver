import React, {
  useState,
  useEffect,
  useLayoutEffect,
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
  Dimensions,
  TouchableOpacity,
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

import SearchUserMessage from "./SearchUserMessage";
import MessageHeader from "./MessgaeHeader";
import MessagesInput from "./MessagesInput";
import DirectMessageRender from "./DirectMessageRender";
import { useNavigation } from "@react-navigation/native";
import { KeyboardAwareFlatList } from "react-native-keyboard-aware-scroll-view";

function DirectMessage({ route }) {
  const { name, id } = route.params;
  const directMessages = useStore((state) => state.directMessages);

  const [dm, setDm] = useState(
    directMessages.sort((x, y) => {
      return y.time - x.time;
    })
  );
  // directMessages.sort((x, y) => {
  //   return y.time - x.time;
  // })
  const [messages, setMessages] = useState("");
  const [rad, setRad] = useState(Math.random().toString(36).substring(2, 17));
  const [keyboardStatus, setKeyboardStatus] = useState();
  const setChatList = useStore((state) => state.setChatList);
  const setDirectMessage = useStore((state) => state.setDirectMessage);

  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;

  const change = (e) => {
    setMessages(e);
  };
  const submitToMessages = (rad, mm) => {
    setMessages("");
    const auth = getAuth();
    const db = getDatabase();

    set(ref(db, `messages/${getAuth().currentUser.uid}/${id}/${rad}`), {
      message: mm,
      by: getAuth().currentUser.uid,
      time: serverTimestamp(),
      isRead: false,
    }),
      set(ref(db, `messages/${id}/${getAuth().currentUser.uid}/${rad}`), {
        message: mm,
        by: getAuth().currentUser.uid,
        time: serverTimestamp(),
        isRead: false,
      }).then(() => {
        setLastItem(rad, mm);
      });
  };

  const setLastItem = (rad, mm) => {
    const auth = getAuth();
    const db = getDatabase();

    set(ref(db, `lastmessages/${getAuth().currentUser.uid}/${id}/${rad}`), {
      message: mm,
      by: getAuth().currentUser.uid,
      time: serverTimestamp(),
      isRead: false,
    }),
      set(ref(db, `lastmessages/${id}/${getAuth().currentUser.uid}/${rad}`), {
        message: mm,
        by: getAuth().currentUser.uid,
        time: serverTimestamp(),
        isRead: false,
      })
        .then(() => {
          setChatList();
        })
        .catch((error) => {
          // or);
          // setErrorr("error, please re-enter the fields and try again");
        });
  };
  const showSubscription = Keyboard.addListener("keyboardDidShow", () => {
    setKeyboardStatus(true);
  });
  const hideSubscription = Keyboard.addListener("keyboardDidHide", () => {
    setKeyboardStatus(false);
  });
  const navigation = useNavigation();

  const Message = ({ item }) => {
    return <DirectMessageRender item={item} id={id} />;
  };
  // const navigation = useNavigation();
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Box p={2}>
          <Ionicons
            name="information-circle-outline"
            size={24}
            color={colors.textColor}
          />
        </Box>
      ),

      headerTitle: () => <CText text={name} size={"md"} />,
    });
  }, [navigation]);

  useEffect(() => {
    setDm(
      directMessages.sort((x, y) => {
        return y.time - x.time;
      })
    );
    // navigation.addListener("focus", () => {
    //   setDm(
    //     directMessages.sort((x, y) => {
    //       return y.time - x.time;
    //     })
    //   );
    // });

    return () => {
      setDm();
    };
  });

  return (
    <Box flex={1} bg="brand.100" p={2} justifyContent={"space-between"}>
      <Box safeAreaTop />

      <FlatList
        inverted
        data={dm}
        renderItem={Message}
        initialNumToRender={12}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={
          dm == undefined ? null : (
            <Box alignItems="center">
              <CText
                text={"Initaite the convo"}
                size="lg"
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
            multiline
            value={messages}
            onChangeText={change}
            placeholder="Text"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />

          <IconPress
            click={
              messages == ""
                ? null
                : () =>
                    submitToMessages(
                      Math.random().toString(36).substring(2, 17),
                      messages
                    )
            }
            children={
              <FontAwesome
                name="send"
                size={30}
                color={messages !== "" ? colors.brand : colors.disbrand}
              />
            }
          />
        </HStack>
      </Box>
    </Box>
  );
}

export default DirectMessage;
