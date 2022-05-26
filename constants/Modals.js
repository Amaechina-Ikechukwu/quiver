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
} from "native-base";
import React, { useState, useEffect } from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Link, useNavigate } from "react-router-native";
function Modals(props) {
  const [showModal, setShowModal] = useState(false);
  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 0,
  });

  return (
    <Modal
      w="full"
      p={5}
      borderRadius={10}
      isOpen={props.open}
      onClose={props.close}
    >
      {/* ///////////////////live captions////////////////// */}
      {props.type === "livecaption" ? (
        <Modal.Content
          borderRadius={5}
          backgroundColor={"transparent"}
          w="full"
          h="3/5"
          {...styles["center"]}
          padding={2}
        >
          <Pressable w="full" onPress={props.close}>
            <HStack
              paddingX={4}
              paddingY={4}
              justifyContent="space-between"
              alignItems="center"
              w="100%"
              backgroundColor={"transparent"}
            ></HStack>
          </Pressable>
          <Text fontFamily="body" color="brand.400" fontSize="20">
            Live Captions
          </Text>
        </Modal.Content>
      ) : null}

      {/* ///////////////////chats////////////////// */}
      {props.type === "chats" ? (
        <Modal.Content
          borderRadius={5}
          backgroundColor={"transparent"}
          w="full"
          h="3/5"
          padding={2}
          {...styles["right"]}
        >
          <Pressable w="full" onPress={props.close}>
            <HStack
              paddingX={4}
              paddingY={4}
              alignItems="center"
              w="100%"
              backgroundColor={"transparent"}
            ></HStack>
          </Pressable>
          <Text fontFamily="body" color="brand.400" fontSize="20">
            chat room
          </Text>
        </Modal.Content>
      ) : null}

      {/* ///////////////////idea pad////////////////// */}
      {props.type === "ideapad" ? (
        <Modal.Content
          borderRadius={5}
          backgroundColor={"transparent"}
          w="full"
          h="3/5"
          {...styles["center"]}
          padding={2}
        >
          <Pressable w="full" onPress={props.close}>
            <HStack
              paddingX={4}
              paddingY={4}
              justifyContent="space-between"
              alignItems="center"
              w="100%"
              backgroundColor={"transparent"}
            ></HStack>
          </Pressable>
          <Text fontFamily="body" color="brand.400" fontSize="20">
            idea pad
          </Text>
        </Modal.Content>
      ) : null}
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
    backgroundColor: "brand.800",
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

export default Modals;
