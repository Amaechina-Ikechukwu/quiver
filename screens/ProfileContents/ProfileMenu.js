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
import { getAuth, signOut } from "firebase/auth";
import IconAction from "../../constants/IconAction";
import Loading from "../../screens/Loading";
import { useNavigation } from "@react-navigation/native";
import SinglePost from "./SinglePost";
import PhotoBottomSheet from "./BottomSheetRender";
import BottomSheet from "@gorhom/bottom-sheet";

function ProfileMenu() {
  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["5%", "25%", "45%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    "handleSheetChanges", index;
  }, []);

  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };

  const googlesignout = () => {
    var auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };
  const navigation = useNavigation();
  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={1}
      snapPoints={snapPoints}
      onChange={handleSheetChanges}
      backgroundStyle={{ backgroundColor: colors.primary }}
      handleStyle={{ backgroundColor: "transparent" }}
      handleIndicatorStyle={{ backgroundColor: colors.textColor }}
    >
      <Box bg="brand.100" flex={1}>
        <VStack>
          <IconPress
            click={() => navigation.navigate("EditProfile")}
            children={
              <Box w="full" p={5} bg="brand.200">
                <CText
                  color="white"
                  text={"Edit Profile"}
                  size="lg"
                  style={{
                    opacity: 0.7,
                    fontWeight: "bold",
                    color: "white",
                  }}
                />
              </Box>
            }
          />

          <Box bg="brand.800" h={0.3} opacity={0.5} />
          <IconPress
            // click={() => navigateToShowPost()}
            children={
              <Box w="full" p={5} bg="brand.200">
                <CText
                  color="white"
                  text={"Settings"}
                  size="lg"
                  style={{ opacity: 0.7, fontWeight: "bold" }}
                />
              </Box>
            }
          />
          <Box bg="brand.800" h={0.6} opacity={0.5} />
          <IconPress
            // click={() => navigateToShowPost()}
            children={
              <Box w="full" p={3} bg="brand.200">
                <Pressable onPress={() => googlesignout()}>
                  {({ isHovered, isFocused, isPressed }) => {
                    return (
                      <Box
                        alignItems={"center"}
                        bg="red.400"
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
                        <CText text={"Log Out"} />
                      </Box>
                    );
                  }}
                </Pressable>
              </Box>
            }
          />
        </VStack>
      </Box>
    </BottomSheet>
  );
}

export default ProfileMenu;
