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
function NoticeMe() {
  const notify = useStore((state) => state.notify);
  const [info, setInfo] = useState(notify);
  const getNotify = useStore((state) => state.getNotify);
  return (
    <Box flex={1} bg="brand.100" p={2}>
      <Box>
        <CText text={"Notifications"} size="xl" style={{ opacity: 0.7 }} />
      </Box>
      <Box>
        <FlatList
          w="full"
          h="full"
          data={info}
          renderItem={({ item }) => (
            <Box bg="brand.700" zIndex={3} w="full" h="full">
              <HStack
                w="full"
                h="full"
                space={3}
                justifyContent="space-between"
              >
                <VStack w="full" h="full">
                  <CText text={"Hey"} size="xl" style={{ opacity: 0.7 }} />
                  <CText text={item.id} size="xl" />
                </VStack>
                <Spacer />
              </HStack>
            </Box>
          )}
          keyExtractor={(item) => item.id}
        />
      </Box>
    </Box>
  );
}

export default NoticeMe;
