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
function Personal() {
  const [showModal, setShowModal] = useState(false);
  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 0,
  });

  let navigate = useNavigate();

  return (
    <Box flex={1} w="full" h="100%" {...safeAreaProps}>
      <PresenceTransition
        visible={true}
        initial={{
          opacity: 0,
        }}
        animate={{
          opacity: 1,
          transition: {
            duration: 250,
          },
        }}
      >
        <Pressable
          onPress={() => setShowModal(true)}
          display={"flex"}
          justifyContent="space-between"
          h="100%"
        >
          <Box bg="brand.700" h="100%" color="brand.800">
            <Text color="brand.800" fontSize="4xl">
              Reciever
            </Text>
          </Box>
          <Box
            position={"absolute"}
            alignItems="flex-end"
            justifyContent="flex-end"
            h="100%"
            w="full"
            p={3}
          >
            <Box bg="brand.400" rounded="md" w="2/5" h="2/5" color="brand.800">
              <Text color="brand.800" fontSize="4xl">
                caller
              </Text>
            </Box>
          </Box>
        </Pressable>
      </PresenceTransition>
      <Modal w="full" isOpen={showModal} onClose={() => setShowModal(false)}>
        <Modal.Content
          borderRadius={0}
          backgroundColor={"transparent"}
          w="full"
          {...styles["top"]}
        >
          <Pressable w="full" onPress={() => navigate("/frontpage")}>
            <HStack
              paddingX={4}
              paddingY={4}
              justifyContent="space-between"
              alignItems="center"
              w="100%"
              backgroundColor={"rgba(0,0,0,0.9)"}
            >
              <HStack space={3} alignItems="center" w="full">
                <Ionicons name="chevron-back-sharp" size={20} color="#E5E5E5" />
                <Text fontFamily="body" color="white" fontSize="20">
                  Home
                </Text>
              </HStack>
            </HStack>
          </Pressable>
        </Modal.Content>
        <Modal.Content
          borderRadius={0}
          backgroundColor={"rgba(0,0,0,0.2)"}
          w="2/5"
          {...styles["bottom"]}
        >
          <HStack
            paddingX={4}
            paddingY={4}
            justifyContent="center"
            alignItems="center"
            w="100%"
            backgroundColor={"rgba(0,0,0,0.2)"}
          >
            <Pressable w="full" onPress={() => navigate("/")}>
              <HStack
                space={3}
                alignItems="center"
                justifyContent="center"
                w="full"
              >
                <SimpleLineIcons
                  name="call-end"
                  style={{ transform: [{ scaleX: -1 }] }}
                  size={24}
                  color="red"
                />
              </HStack>
            </Pressable>
          </HStack>
        </Modal.Content>
      </Modal>
      {/* <Modal
        w="full"
        isOpen={showModal}
        onClose={() => setShowModal(!showModal)}
      >
        <Modal.Content
          borderRadius={0}
          backgroundColor={"rgba(0,0,0,0.2)"}
          w="2/5"
          {...styles["bottom"]}
        >
          <HStack
            paddingX={4}
            paddingY={4}
            justifyContent="center"
            alignItems="center"
            w="100%"
            backgroundColor={"rgba(0,0,0,0.2)"}
          >
            <Pressable w='full' onPress={() => navigate("/")}>
              <HStack space={3} alignItems="center" w="full">
                <SimpleLineIcons
                  name="call-end"
                  style={{ transform: [{ scaleX: -1 }] }}
                  size={24}
                  color="red"
                />
              </HStack>
            </Pressable>
          </HStack>
        </Modal.Content>
      </Modal> */}
    </Box>
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
  },
  center: {},
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

export default Personal;
