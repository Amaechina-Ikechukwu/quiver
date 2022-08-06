import React, { useState, useEffect } from "react";
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
import useStore from "../store/user";
import CText from "../constants/Text";
import Pressing from "../constants/Pressing";
import {
  serverTimestamp,
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
} from "firebase/database";
import moment from "moment";
import Accept from "../Modals/AcceptModal";
import RequestView from "./Notifications/RequestView";
import { SectionList } from "react-native";

function Notify({ navigation }) {
  const notify = useStore((state) => state.notify);
  const [notification, setNotification] = useState();
  const getNotify = useStore((state) => state.getNotify);
  const quiver = useStore((state) => state.quiver);

  useEffect(() => {
    setNotification(
      notify.sort((x, y) => {
        return y.time - x.time;
      })
    );
    navigation.addListener("focus", () => {
      setNotification(
        notify.sort((x, y) => {
          return y.time - x.time;
        })
      );
    });
    return () => {};
  }, [notify, notification]);

  try {
    return (
      <Box flex={1} bg="brand.100" p={2}>
        <Box safeAreaTop />
        <Box>
          <CText text={"Notifications"} size="xl" style={{ opacity: 0.7 }} />
        </Box>
        <Box>
          <FlatList
            data={notification}
            renderItem={({ item }) => (
              <Box>
                <VStack
                  w="full"
                  borderBottomColor={"brand.400"}
                  borderBottomWidth={1}
                  p={3}
                  bg={item.isRead === false ? "gray.800" : "transparent"}
                  rounded="sm"
                >
                  {/* <HStack w="full" justifyContent="space-between">
                   
                    <Box>
                      <CText
                        text={moment(item.info.time).fromNow()}
                        size="sm"
                        style={{
                          opacity: 0.7,
                        }}
                      />
                    </Box>
                  </HStack> */}

                  <RequestView item={item} itemid={item.id} />

                  <Spacer />
                </VStack>
              </Box>
            )}
            keyExtractor={(item) => item.id + item.time}
          />
        </Box>
      </Box>
    );
  } catch {
    return (
      <Box flex={1} bg="brand.100">
        <Box
          h="full"
          bg="brand.400"
          justifyContent="center"
          alignItems={"center"}
          p={3}
        >
          <Box h="full">
            {" "}
            <CText
              style={{ opacity: 0.4 }}
              text={"Didn't retrieve notification"}
              size="lg"
            />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default Notify;
