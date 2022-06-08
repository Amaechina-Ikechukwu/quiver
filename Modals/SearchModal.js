import {
  Box,
  Flex,
  HStack,
  PresenceTransition,
  Text,
  useSafeArea,
  ZStack,
  Modal,
  Pressable,
  TextArea,
  Center,
  KeyboardAvoidingView,
  ScrollView,
  Spacer,
  VStack,
  Avatar,
  FlatList,
} from "native-base";
import React, { useState, useEffect } from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { useNavigate } from "react-router-native";
import { Platform, TextInput, Image, Keyboard } from "react-native";
import useStore from "../store/user";
import colors from "../colors";
import { Link } from "@react-navigation/native";
import { getAuth } from "firebase/auth";
import CText from "../constants/Text";
import { TramOutlined } from "@material-ui/icons";
function SearchModal(props, { navigation }) {
  const [showModal, setShowModal] = useState(false);
  const [searchWords, setSearchWords] = useState("");
  const [searchResult, setsearchResult] = useState();
  const [found, setFound] = useState();
  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 0,
  });
  const clearToast = useStore((state) => state.clearToast);
  const change = (e) => {
    setSearchWords(e);
  };
  const users = useStore((state) => state.users);
  const quiver = useStore((state) => state.quiver);
  const search = (e) => {
    Keyboard.dismiss();

    let list = [];

    users.forEach((element) => {
      list.push(element.info);
    });

    let results = [];
    switch (e) {
      case undefined:
        users.forEach((x) => {
          const name = x.info.displayName;
          try {
            if (x.info.displayName.includes(searchWords)) {
              if (x.id !== getAuth().currentUser.uid) {
                results.push(x);
                console.log(x);
                setFound(false);
                setsearchResult(results);
              }
            }
          } catch (e) {
            console.log(e);
          }
        });
        break;
    }
  };
  const closing = () => {
    setsearchResult({});
    setSearchWords("");
    setFound();
    props.close();
  };

  useEffect(() => {
    setTimeout(() => {
      clearToast();
    }, 2000);
  });
  return (
    <Modal
      w="full"
      p={5}
      borderRadius={10}
      isOpen={props.open}
      onClose={closing}
    >
      <Modal.Content
        borderRadius={5}
        bg="brand.400"
        w="full"
        h="3/5"
        {...styles["center"]}
        padding={2}
      >
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
              borderColor: colors.textColor,
              borderWidth: 1,
              borderRadius: 5,
              padding: 5,
            }}
            value={searchWords}
            onChangeText={change}
            placeholder="search"
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />
          <Pressable onPress={() => search()}>
            {({ isHovered, isFocused, isPressed }) => {
              return (
                <Box
                  bg="brand.700"
                  p={3}
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
                  <Text color="brand.800">Search</Text>
                </Box>
              );
            }}
          </Pressable>
        </HStack>

        <Box flex={1} alignItems="center">
          <Center w={"full"}>
            <Box
              mb={3}
              h="70%"
              w={"full"}
              color="brand.800"
              alignItems="center"
            >
              <Center w={"full"}>
                {found == true ? (
                  <Center w={"full"}>
                    <CText style={{ opacity: 0.4 }} text={"No Result"} />
                  </Center>
                ) : (
                  <FlatList
                    w={"full"}
                    h="full"
                    data={searchResult}
                    renderItem={({ item }) => (
                      <Box
                        borderBottomWidth="1"
                        _dark={{
                          borderColor: "brand.300",
                        }}
                        borderColor="brand.400"
                        py="2"
                        w={"full"}
                      >
                        <Link
                          to={{
                            screen: "UserProfile",
                            params: { itemID: item.id, item: item.info },
                          }}
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
                                uri: item.info.photoURL || quiver,
                              }}
                            />
                            <VStack>
                              <Text
                                _dark={{
                                  color: "warmGray.50",
                                }}
                                color="brand.800"
                              >
                                {item.info.displayName}
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
                        </Link>
                      </Box>
                    )}
                    keyExtractor={(item) => item.id}
                  />
                )}
              </Center>
            </Box>
          </Center>
        </Box>
      </Modal.Content>
    </Modal>
  );
}

const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0,
  },
  bottom: {
    marginBottom: 2,
    marginTop: "auto",
    backgroundColor: "brand.200",
    border: "none",
    borderRadius: 10,
  },
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
    backgroundColor: "brand.800",
  },
  center: {
    backgroundColor: "brand.400",
    color: "brand.800",
  },
  display: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  place: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default SearchModal;
