import React, { useState, useEffect } from "react";
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
import { useNavigation } from "@react-navigation/native";

import SearchUserMessage from "./SearchUserMessage";
import LastMessages from "./LastMessagesRender";
import SingleUserCount from "./SingleUserCount";
import UserConnection from "../../constants/UserConnection";

function MessageList() {
  const chatList = useStore((state) => state.chatList);
  const navigation = useNavigation();
  const [list, setList] = useState(
    chatList.sort((x, y) => {
      return x.time - y.time;
    })
  );

  const quiver = useStore((state) => state.quiver);
  const setLastMessages = useStore((state) => state.setLastMessages);
  useEffect(() => {
    // for (var i = 0; i < chatList.length; i++) {
    //    ("fromchatList", chatList[i]);
    // }
    // const unsubscribe = navigation.addListener("focus", () => {
    //   setTimeout(() => {
    //     setList();
    //   }, 0);
    // });
    // return unsubscribe;
  }, [list]);
  const setDirectMessage = useStore((state) => state.setDirectMessage);
  const openDirectMessage = (item) => {
    navigation.navigate("DirectMessage", {
      id: item.id,
      name: item.by,
      photo: item.photo,
    });

    setDirectMessage(item.id);
  };

  return (
    <Box bg="brand.100" flex={1}>
      <SearchUserMessage />
      <Box mt={70}>
        <FlatList
          // ListHeaderComponent={}
          keyExtractor={(item) =>
            item.id + Math.random().toString(36).substring(2, 17)
          }
          data={list}
          renderItem={({ item }) => {
            return (
              <Box flex={1}>
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
                      px="2"
                      py={5}
                      w={"100%"}
                    >
                      <VStack>
                        <HStack
                          flex={1}
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
                          <VStack space={2} w="100%">
                            <HStack space={5} alignItems={"center"}>
                              <CText text={item.by} size="md" />
                              <UserConnection id={item.id} />
                              <SingleUserCount id={item.id} />
                            </HStack>

                            <HStack
                              alignItems="center"
                              w={"80%"}
                              justifyContent="space-between"
                            >
                              <LastMessages id={item.id} />

                              <CText
                                text={moment(item.time).calendar()}
                                size="xs"
                                style={{ paddingHorizontal: 3, opacity: 0.3 }}
                              />
                            </HStack>
                          </VStack>
                          <Spacer />
                        </HStack>
                      </VStack>
                    </Box>
                  }
                />
              </Box>
            );
          }}
        />
      </Box>
    </Box>
  );
}

export default MessageList;
