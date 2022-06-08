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

function Notifications() {
  const notify = useStore((state) => state.notify);
  const [info, setInfo] = useState(notify);
  const doit = () => {
    console.log(notify, "here");
  };
  useEffect(() => {
    doit();
  });

  return (
    <Box flex={1} bg="brand.100" p={2}>
      <Box>
        <CText text={"Notifications"} size="xl" style={{ opacity: 0.7 }} />
      </Box>
      <Box h="full">
        <FlatList
          w={"full"}
          h="full"
          data={notify}
          renderItem={(item) => (
            <Box h="full">
              <CText text={item.info.type} size="lg" />
            </Box>
          )}
          keyExtractor={(item) => item.id + item.info.time + item.info.type}
        />
      </Box>
    </Box>
  );
}

export default Notifications;
