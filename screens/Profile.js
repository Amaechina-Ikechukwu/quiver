import { Avatar, Box, HStack, Pressable, VStack } from "native-base";
import React, { useState, useEffect } from "react";
import CText from "../constants/Text";
import useStore from "../store/user";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithCredential,
  signOut,
} from "firebase/auth";
function ProfilePage({ route }) {
  const quiver = useStore((state) => state.quiver);
  const user = useStore((state) => state.user);

  const googlesignout = () => {
    var auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    return () => {};
  });

  const User = () => {
    return (
      <Box flex={1} h="full" bg="brand.100">
        <Box safeAreaTop />
        <VStack space={3}>
          <Box bg="brand.400" h="20%" p={3}>
            <Box h="full" flexDirection={"row"} justifyContent="space-around">
              <Box h="full">
                <HStack space="lg" w="full">
                  <HStack space="5" alignItems="center">
                    <Avatar
                      size="xl"
                      source={{
                        uri: user.photoURL || quiver,
                      }}
                    />
                    <VStack>
                      <CText text={user.displayName} />
                      <Pressable onPress={() => googlesignout()}>
                        {({ isHovered, isFocused, isPressed }) => {
                          return (
                            <Box
                              alignItems={"center"}
                              bg="red.400"
                              p={2}
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
                              <CText text={"Log Out"} />
                            </Box>
                          );
                        }}
                      </Pressable>
                    </VStack>
                  </HStack>
                </HStack>
              </Box>
              <Box>
                <CText text={"Edit"} size="sm" />
              </Box>
            </Box>
          </Box>
          <Box bg="brand.400" h="15%" p={2}>
            <CText style={{ opacity: 0.4 }} text={"Moments"} size="sm" />
          </Box>
          <Box bg="brand.400" h="70%" p={2}>
            <CText style={{ opacity: 0.4 }} text={"Post"} size="sm" />
          </Box>
        </VStack>
      </Box>
    );
  };

  return <User />;
}

export default ProfilePage;
