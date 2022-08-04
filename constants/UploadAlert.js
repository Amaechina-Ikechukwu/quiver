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
  Image,
  VStack,
  Collapse,
  Alert,
} from "native-base";
import colors from "../colors";
import React, { useState, useEffect } from "react";
import Pressing from "../constants/Pressing";

import CText from "../constants/Text";
import useStore from "../store/user";

function UploadAlert() {
  const [show, setShow] = useState(true);
  const clearAlert = useStore((state) => state.clearAlert);
  const showToast = () => {
    setTimeout(() => {
      clearAlert();
    }, 3000);
  };
  const alert = useStore((state) => state.alert);

  useEffect(() => {
    showToast();
  });
  try {
    if (alert !== "") {
      return (
        <Box
          w="full"
          alignItems="center"
          position={"absolute"}
          zIndex={2}
          py={3}
          px={3}
        >
          {/* <Collapse bg="green.300" w="full" isOpen={alert !== ""}> */}
          <Alert
            w="full"
            borderColor={"brand.700"}
            borderWidth={0.5}
            bg="brand.400"
          >
            <VStack space={1} w="100%">
              <HStack alignItems="center">
                <CText text={alert} size="sm" style={{ opacity: 0.7 }} />
              </HStack>
            </VStack>
          </Alert>
          {/* </Collapse> */}
        </Box>
      );
    } else {
      return <Box />;
    }
  } catch {
    return <Box />;
  }
}

export default UploadAlert;
