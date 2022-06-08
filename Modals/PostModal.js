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
} from "native-base";
import React, { useState, useEffect } from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Link, useNavigate } from "react-router-native";
import { Platform } from "react-native";
function PostModals(props) {
  const [showModal, setShowModal] = useState(false);
  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 0,
  });

  return (
    <KeyboardAvoidingView h="full">
      <Modal
        w="full"
        p={5}
        borderRadius={10}
        isOpen={props.open}
        onClose={props.close}
      >
        <Modal.Content
          borderRadius={5}
          bg="brand.400"
          w="full"
          h="3/5"
          {...styles["center"]}
          padding={2}
        >
          {/* <Pressable w="full" onPress={props.close}>
          <HStack
            paddingX={4}
            paddingY={4}
            justifyContent="space-between"
            alignItems="center"
            backgroundColor={"transparent"}
          ></HStack>
        </Pressable> */}

          <Box flex={1} justifyContent="space-around" alignItems="center">
            <ScrollView
              h="100%"
              _contentContainerStyle={{
                px: "20px",
                mb: "4",
                minW: "72",
                h: "full",
              }}
            >
              <Center w={"full"}>
                <Box
                  mb={3}
                  borderWidth={1}
                  h="70%"
                  w={"full"}
                  color="brand.800"
                  justifyContent="center"
                  alignItems="center"
                >
                  <Center w={"full"}>
                    <Text color="brand.800">Photo</Text>
                  </Center>
                </Box>
                <TextArea
                  h={10}
                  color="brand.800"
                  placeholder="What's happening"
                  w="100%"
                  maxW="300"
                />
              </Center>
              <Center w="full">
                <Pressable bg="brand.700" w="50%" p={3} rounded="sm">
                  <Center>
                    <Text color="brand.800">Gist</Text>
                  </Center>
                </Pressable>
              </Center>
            </ScrollView>
          </Box>
        </Modal.Content>
      </Modal>
    </KeyboardAvoidingView>
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

export default PostModals;
