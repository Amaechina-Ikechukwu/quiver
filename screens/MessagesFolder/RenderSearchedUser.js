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
import { useNavigation } from "@react-navigation/native";

function RenderSearch({ items, clearResult }) {
  const [item, setItem] = useState(items);
  const quiver = useStore((state) => state.quiver);
  const setDirectMessage = useStore((state) => state.setDirectMessage);
  const navigation = useNavigation();
  const openDirectMessage = (item) => {
    navigation.navigate("DirectMessage", {
      id: item.id,
      name: item.name,
      photo: item.photo,
    });

    setDirectMessage(item.id);
    clearResult();
  };

  useEffect(() => {
    setItem(items);
    return () => {
      setItem();
    };
  });

  return item !== [] || item !== null || item !== undefined ? (
    <Box>
      <IconPress
        click={() => openDirectMessage(item)}
        children={
          <Box
            bg="brand.200"
            borderBottomWidth="1"
            _dark={{
              borderColor: "brand.300",
            }}
            borderColor="brand.400"
            p="2"
            w={"90%"}
          >
            <HStack
              w={"full"}
              space={3}
              alignItems="center"
              justifyContent="space-between"
            >
              <Avatar
                size="48px"
                source={{
                  uri: item.photo || quiver,
                }}
              />
              <VStack>
                <Text
                  _dark={{
                    color: "warmGray.50",
                  }}
                  color="brand.800"
                >
                  {item.name}
                </Text>
              </VStack>
              <Spacer />
              {/* <Text
                          fontSize="xs"
                          _dark={{
                            color: "warmGray.50",
                          }}
                          color="brand.800"
                          alignSelf="flex-start"
                        >
                          {"yes"}
                        </Text> */}
            </HStack>
          </Box>
        }
      />
    </Box>
  ) : (
    <Box
      h="40%"
      bg="brand.200"
      borderBottomWidth="1"
      _dark={{
        borderColor: "brand.300",
      }}
      borderColor="brand.400"
      p="2"
      w={"90%"}
    >
      <CText text={"No clique found"} size="sm" style={{ opacity: 0.7 }} />
    </Box>
  );
}

export default memo(RenderSearch);
