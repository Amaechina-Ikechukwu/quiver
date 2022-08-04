import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import {
  serverTimestamp,
  getDatabase,
  ref,
  set,
  onValue,
  update,
} from "firebase/database";
import {
  Avatar,
  Box,
  HStack,
  Pressable,
  VStack,
  FlatList,
  Center,
} from "native-base";
import React, { useState, useEffect } from "react";
import CText from "../../constants/Text";
import useStore from "../../store/user";
import ProfilePost from "../../screens/ProfileContents/ProfilePosts";
import Loading from "../../screens/Loading";
import Accept from "../../Modals/AcceptModal";
import { Image } from "react-native";
import { useNavigation } from "@react-navigation/native";

function RequestView({ itemid, item, from }) {
  const quiver = useStore((state) => state.quiver);
  const getNC = useStore((state) => state.getNC);
  const setWhoseCliques = useStore((state) => state.setWhoseCliques);
  const sethasCliques = useStore((state) => state.sethasCliques);
  const setSearchedUserData = useStore((state) => state.setSearchedUserData);
  const setSearchedUserPost = useStore((state) => state.setSearchedUserPost);
  const setSpecifyUser = useStore((state) => state.setSpecifyUser);

  const [getModal, setGetModal] = useState(false);
  const navigation = useNavigation();
  const closeModal = () => {
    setGetModal(!getModal);
  };

  const navigate = (itemid) => {
    navigation.navigate("UserProfileN", {
      itemID: itemid,
    });

    setSpecifyUser(itemid);
    setSearchedUserData(itemid);
    setSearchedUserPost(itemid);
    setWhoseCliques(itemid);
    sethasCliques(itemid);
  };

  const changeToFalse = () => {
    const db = getDatabase();

    update(
      ref(
        db,
        "notifications/" + getAuth().currentUser.uid + "/info/" + item.id
      ),
      {
        isRead: "true",
      }
    )
      .then((e) => e)
      .catch((e) => e);
  };

  useEffect(() => {
    return () => {
      changeToFalse();
    };
  });

  return (
    <Box>
      <VStack p={1}>
        <HStack
          alignItems={"center"}
          w="full"
          justifyContent="space-evenly"
          space={3}
        >
          <Avatar
            size="48px"
            source={{
              uri: item.photo || quiver,
            }}
          />
          <Box>
            <CText
              text={item.name + item.info}
              size="md"
              style={{
                opacity: 0.7,
              }}
            />
          </Box>
          <Image
            source={{
              uri: item.postPhoto,
            }}
            style={{
              height: 50,
              width: 50,
              borderRadius: 10,
            }}
          />
        </HStack>
        <Box h={2} />
      </VStack>
    </Box>
  );
}

export default RequestView;
