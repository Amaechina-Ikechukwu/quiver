import { signInWithEmailAndPassword } from "firebase/auth";
import {
  serverTimestamp,
  getDatabase,
  ref,
  set,
  onValue,
} from "firebase/database";
import { Avatar, Box, HStack, Pressable, VStack } from "native-base";
import React, { useState, useEffect } from "react";
import CText from "../constants/Text";
import useStore from "../store/user";
function UserProfile({ route, navigation }) {
  const quiver = useStore((state) => state.quiver);
  const user = useStore((state) => state.user);
  const users = useStore((state) => state.users);
  const [items, setItems] = useState();
  const [status, setStatus] = useState("Add to your clique");
  const { itemID, item } = route.params;
  const clearToast = useStore((state) => state.clearToast);
  const showToast = () => {
    ToastAndroid.show(toastt, ToastAndroid.SHORT, ToastAndroid.BOTTOM);
    setTimeout(() => {
      clearToast();
    }, 2000);
  };
  const toastt = useStore((state) => state.toast);
  const toasted = useStore((state) => state.toasted);
  toastt !== "" ? showToast() : null;

  const pushToFirestore = (val) => {
    const db = getDatabase();
    set(
      ref(
        db,
        "notifications/" +
          itemID +
          "/info/" +
          Math.random().toString(36).slice(2, 16)
      ),
      {
        type: `request`,
        from: user.uid,
        time: serverTimestamp(),
        accept: "Accept",
        decline: "Decline",
        uri: user.photoURL,
        name: user.displayName,
        isRead: false,
      }
    )
      .then(() => setStatus("Pending"))
      .catch((e) => toasted("request failed"));
  };

  const checkStatus = () => {
    let data;
    let check = [];
    const dbRef = getDatabase();
    const reff = ref(dbRef, "notifications/" + itemID + "/info");

    onValue(reff, (snapshot) => {
      const val = snapshot.val();

      for (const key in val) {
        check.push({ from: val[key].from, status: val[key].decline });
      }
      console.log("valCheck", check);
      check.find((x) => {
        if (x.from == user.uid && x.status !== "Declined") {
          setStatus("Still Pending");
          hasAdded();
        } else {
          setStatus("Add to your clique");
        }
      });
    });
  };

  const hasAdded = () => {
    let check = [];
    const dbRef = getDatabase();
    const reff = ref(dbRef, "inQuiver/" + itemID);

    onValue(reff, (snapshot) => {
      const val = snapshot.val();

      for (const key in val) {
        check.push(val.clique);
      }

      check.find((x) => {
        if (x == user.uid) {
          setStatus("Added");
        }
      });
    });
  };

  useEffect(() => {
    checkStatus();
    try {
      users.forEach((ele) => {
        if (ele.id == itemID) {
          setItems(ele.info);
          // console.log("done");
        }
      });
    } catch {
      console.log("couldnt fetch users");
    }

    const unsubscribe = navigation.addListener("focus", () => {
      // The screen is focused
      // Call any action
    });
    return () => {};
  }, [navigation]);
  try {
    return (
      <Box bg="brand.100">
        <VStack space={3}>
          <Box bg="brand.400" h="15%" p={3}>
            <Box h="full" flexDirection={"row"} justifyContent="space-around">
              <Box h="full" w="full">
                <HStack space="lg" w="full">
                  <HStack space="5" alignItems="center">
                    <Avatar
                      size="xl"
                      source={{
                        uri: items.photoURL || quiver,
                      }}
                    />
                    <VStack alignItems="center" space={3}>
                      <CText text={items.displayName} />
                      {status === "Added" ? (
                        <Box bg="gray.900" p={2} rounded="sm">
                          <CText text={"Added"} />
                        </Box>
                      ) : null}
                      {status !== "Added" ? (
                        <Pressable onPress={() => pushToFirestore()}>
                          {({ isHovered, isFocused, isPressed }) => {
                            return (
                              <Box
                                bg={
                                  status === "Pending" ||
                                  status === "Still Pending"
                                    ? "yellow.900"
                                    : "brand.700"
                                }
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
                                <CText text={status} />
                              </Box>
                            );
                          }}
                        </Pressable>
                      ) : null}
                    </VStack>
                  </HStack>
                </HStack>
              </Box>
            </Box>
          </Box>
          <Box bg="brand.400" h="15%" p={2}>
            <CText style={{ opacity: 0.4 }} text={"Moments"} size="sm" />
          </Box>
          <Box bg="brand.400" h="full" p={2}>
            <CText style={{ opacity: 0.4 }} text={"Post"} size="sm" />
          </Box>
        </VStack>
      </Box>
    );
  } catch (e) {
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
            <CText style={{ opacity: 0.4 }} text={"Not Found"} size="lg" />
          </Box>
        </Box>
      </Box>
    );
  }
}

export default UserProfile;
