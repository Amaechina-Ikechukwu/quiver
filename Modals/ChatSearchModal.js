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
  Modal,
  TextInput,
} from "react-native";
import { ToastAndroid } from "react-native";
import useStore from "../store/user";

import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
  Feather,
} from "@expo/vector-icons";
import colors from "../colors";
import CText from "../constants/Text";
import moment from "moment";
import IconPress from "../constants/IconPress";
import {
  getDatabase,
  ref,
  set,
  remove,
  update,
  serverTimestamp,
} from "firebase/database";
import { getAuth } from "firebase/auth";

import { useNavigation } from "@react-navigation/native";

import RenderSearchedUser from "../screens/MessagesFolder/RenderSearchedUser";
import Pressing from "../constants/Pressing";

function ChatSearchModal({ open, onClose }) {
  const [searchWords, setSearchWords] = useState("");
  const [searchResult, setsearchResult] = useState();
  const [found, setFound] = useState(true);

  const inQuiver = useStore((state) => state.inQuiver);
  const inHasQuiver = useStore((state) => state.inHasQuiver);
  const change = (e) => {
    setSearchWords(e);
  };

  const SearchToRender = ({ item }) => {
    return (
      <RenderSearchedUser items={item} clearResult={() => clear()} onClose />
    );
  };
  const search = (e) => {
    // isUsers();

    let list = [];

    // inQuiver.forEach((element) => {
    //    (element);
    // });

    let results = [];
    switch (e) {
      case undefined:
        for (var key in inHasQuiver) {
          try {
            if (
              inHasQuiver[key].name
                .toLowerCase()
                .includes(searchWords.toLowerCase())
            ) {
              results.push(inHasQuiver[key]);

              setFound(true);
            } else {
              setFound(false);
              setsearchResult();
            }
            setsearchResult(results);
          } catch (e) {}
        }
        // inHasQuiver.forEach((x) => {
        //   // Keyboard.dismiss();
        //   try {
        //     if (
        //       x.name.includes(searchWords) &&
        //       x.id !== getAuth().currentUser.uid
        //     ) {
        //       results.push(x);
        //       "from search", x;
        //       setFound(true);
        //       setsearchResult(results);
        //     } else {
        //       setFound(false);
        //       setsearchResult();
        //     }
        //   } catch (e) {
        //     e;
        //   }
        // });
        break;
    }
  };

  const clear = () => {
    setsearchResult();
    setSearchWords();
    setFound();
    onClose();
  };
  useEffect(() => {
    return () => {};
  });

  const navigation = useNavigation();
  return (
    <Modal
      animationType={"fade"}
      transparent={true}
      visible={open}
      style={{
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        w="full"
        bg={"brand.100"}
        alignItems="center"
        justifyContent="center"
      >
        <Box>
          <HStack
            paddingX={4}
            paddingY={4}
            justifyContent="space-between"
            alignItems="center"
            backgroundColor={"transparent"}
          >
            <TextInput
              style={{
                height: 45,
                color: colors.textColor,
                width: "65%",
                backgroundColor: colors.sec,

                borderRadius: 5,
                padding: 5,
              }}
              autoFocus
              value={searchWords}
              onChangeText={change}
              placeholder="Search Contacts"
              placeholderTextColor={"rgba(255,255,255,0.6)"}
            />
            <HStack space={3} justifyContent="space-evenly" alignItems="center">
              <Pressing text={"Search"} click={() => search()} />
              <IconPress
                click={() => clear()}
                children={
                  <CText text={"Close"} size="lg" style={{ opacity: 0.4 }} />
                }
              />
            </HStack>
          </HStack>
        </Box>
        <FlatList
          data={searchResult}
          renderItem={SearchToRender}
          ListEmptyComponent={
            found == false ? (
              <IconPress
                click={() => clear()}
                children={
                  <Box
                    bg="brand.200"
                    borderBottomWidth="1"
                    _dark={{
                      borderColor: "brand.300",
                    }}
                    borderColor="brand.400"
                    p="2"
                    alignItems="center"
                  >
                    <CText
                      text={"Not found, sure you follow the user?"}
                      size="md"
                      style={{ opacity: 0.9 }}
                    />
                    <CText
                      text={"Click to remove"}
                      size="xs"
                      style={{ opacity: 0.4 }}
                    />
                  </Box>
                }
              />
            ) : null
          }
          keyExtractor={(item) => item.id}
        />
      </Box>
    </Modal>
  );
}

export default ChatSearchModal;
