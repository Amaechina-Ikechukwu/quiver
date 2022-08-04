import {
  Avatar,
  Badge,
  Box,
  Center,
  FavouriteIcon,
  HStack,
  Popover,
  PresenceTransition,
  Pressable,
  Spacer,
  Text,
  VStack,
} from "native-base";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
} from "@expo/vector-icons";
import IconPress from "./IconPress";
import colors from "../colors";
import useStore from "../store/user";
import { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
  get,
  child,
  orderByChild,
  query,
  orderByValue,
  onChildAdded,
  onChildChanged,
  onChildRemoved,
} from "firebase/database";

function IconAction(props) {
  const [checkLike, setCheckLike] = useState(Boolean);
  const [likes, setLikes] = useState(false);
  const searchLikes = () => {
    let newData = [];

    const dbRef = getDatabase();
    const reff = ref(dbRef, `likes/${props.postId}`); //retrieve posts
    const ordered = query(reff); //orders by time

    onChildAdded(reff, async (snapshot) => {
      if (snapshot.key == getAuth().currentUser.uid) {
        "key " + snapshot.key + " val " + snapshot.val();
        setCheckLike(snapshot.val().user);
      }
    });
  };

  useEffect(() => {
    const dbRef = getDatabase();
    const reff = ref(dbRef, `likes/${props.postId}`); //retrieve posts
    const ordered = query(reff); //orders by time

    onChildAdded(reff, async (snapshot) => {
      if (snapshot.key == getAuth().currentUser.uid) {
        setCheckLike(snapshot.val().user);
      }
    });
    onChildChanged(reff, async (snapshot) => {
      if (snapshot.key == getAuth().currentUser.uid) {
        setCheckLike(snapshot.val().user);
      }
    });
    return () => {};
  }, [checkLike]);
  return (
    <HStack space={5} alignItems="center">
      {/* {checkLike == true ? ( */}
      <IconPress
        click={checkLike == true ? props.clickDislike : props.clickLike}
        children={
          <FavouriteIcon
            size={30}
            color={checkLike == true ? "red.400" : "brand.400"}
          />
        }
      />
      {/* )
        : (
        <IconPress
          click={props.clickLike}
          children={<FavouriteIcon size={30} color={"brand.400"} />}
        />
      )} */}

      {/* <IconPress
        children={
          <EvilIcons name="comment" size={35} color={colors.textColor} />
        }
      />
      <IconPress
        children={
          <Ionicons name="share-outline" size={30} color={colors.textColor} />
        }
      /> */}
    </HStack>
  );
}

export default IconAction;
