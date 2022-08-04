import { Box, Button, HStack, Modal, Text } from "native-base";
import React, { useState, useEffect } from "react";
import {
  serverTimestamp,
  getDatabase,
  ref,
  set,
  onValue,
  update,
  remove,
} from "firebase/database";
import { getAuth } from "firebase/auth";
import useStore from "../store/user";
import { Link } from "@react-navigation/native";
function Accept({ open, close, item, from }) {
  const user = useStore((state) => state.user);
  const setPosts = useStore((state) => state.setPosts);
  const getNC = useStore((state) => state.getNC);
  const getNotify = useStore((state) => state.getNotify);
  const toasted = useStore((state) => state.toasted);
  const auth = getAuth().currentUser;
  const accept = () => {
    const db = getDatabase();
    const rad = Math.random().toString(36).substring(2, 17);
    set(ref(db, "inQuiver/" + rad), {
      currentUser: auth.uid,
      followedBy: from,
    }) // the user that clicks is added into the friend list of the person that accepts
      .then(() => toasted("added"), getNC(), getNotify())
      .catch((e) => toasted("add failed"));
    update(ref(db, "notifications/" + auth.uid + "/info/" + item), {
      type: `request`,
      from: from,
      time: serverTimestamp(),
      accept: "Accepted",
      isRead: true,
      decline: null,
    })
      .then((e) => e, setPosts(), close())
      .catch((e) => e);
  };
  useEffect(() => {
    item, from;
    return () => {};
  });
  return (
    <Modal isOpen={open} onClose={close} borderWidth={"0"}>
      <Modal.Content paddingX={2} paddingY={5} w="full" {...styles["bottom"]}>
        <Box w="full">
          <Text color="gray.300" mb="2%" fontSize={16}>
            You will see the users post, talks and public space, but the user
            will not see yours
          </Text>
          <Text color="gray.400" mb="10%" fontSize={12}>
            Visit profile to add user to make your post visible.
          </Text>
          <Box>
            <HStack space={5} w="full" {...styles["display"]}>
              <Button bg={"brand.400"} w="1/4">
                <Link
                  to={{
                    screen: "UserProfile",
                    params: { itemID: from },
                  }}
                  style={{ width: "100%" }}
                >
                  <Text color="brand.800">Visit Profile</Text>
                </Link>
              </Button>

              <Button
                onPress={accept}
                bg={"brand.800"}
                w="2/4"
                color="brand.100"
              >
                <Text>Accept</Text>
              </Button>
            </HStack>
          </Box>
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
    marginBottom: 0,
    marginTop: "auto",
    backgroundColor: "brand.200",
    border: "none",
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

export default Accept;
