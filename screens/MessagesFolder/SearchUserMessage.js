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
import Pressing from "../../constants/Pressing";
import RenderSearch from "./RenderSearchedUser";
import { useNavigation } from "@react-navigation/native";

function SearchUserMessage() {
  const [searchWords, setSearchWords] = useState("");
  const [searchResult, setsearchResult] = useState();
  const [found, setFound] = useState(true);
  const navigation = useNavigation();
  const inQuiver = useStore((state) => state.inQuiver);
  const inHasQuiver = useStore((state) => state.inHasQuiver);
  const change = (e) => {
    setSearchWords(e);
  };

  const SearchToRender = ({ item }) => {
    return <RenderSearch items={item} clearResult={() => clear()} />;
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
        inQuiver.forEach((x) => {
          // Keyboard.dismiss();
          try {
            if (
              x.name.includes(searchWords) &&
              x.id !== getAuth().currentUser.uid
            ) {
              results.push(x);
              "from search", x;
              setFound(true);
              setsearchResult(results);
            } else {
              setFound(false);
              setsearchResult();
            }
          } catch (e) {
            e;
          }
        });
        break;
    }
  };

  const clear = () => {
    setsearchResult();
    setSearchWords();
    setFound();
  };
  useEffect(() => {
    return () => {};
  });
  return (
    <Box position={"absolute"} zIndex={1} w="full">
      <Box>
        <HStack
          paddingX={4}
          paddingY={4}
          justifyContent="space-evenly"
          alignItems="center"
          backgroundColor={"transparent"}
        >
          <TextInput
            style={{
              height: 40,
              color: colors.textColor,
              width: "70%",
              backgroundColor: colors.sec,

              borderRadius: 5,
              padding: 5,
            }}
            value={searchWords}
            onChangeText={change}
            placeholder="Search Contacts"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />

          <Pressing text={"Search"} click={() => search()} />
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
                  w={"90%"}
                  alignItems="center"
                >
                  <CText
                    text={"No clique found, sure the person is in your clique?"}
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
  );
}

export default SearchUserMessage;
