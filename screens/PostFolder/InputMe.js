import React, { useState, useEffect } from "react";
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
  View,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
  KeyboardAvoidingView,
  TextInput,
} from "react-native";
import { ToastAndroid } from "react-native";
import useStore from "../../store/user";

import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
  FontAwesome,
} from "@expo/vector-icons";
import colors from "../../colors";
import CText from "../../constants/Text";
import moment from "moment";
import IconPress from "../../constants/IconPress";
import { getDatabase, ref, set, remove, update } from "firebase/database";
import { getAuth } from "firebase/auth";
import IconAction from "../../constants/IconAction";
import UploadAlert from "../../constants/UploadAlert";
import Header from "../../pages/Header";
import PostsRender from "./PostsRender";
import BottomComments from "../BottomComments";
import { useNavigation } from "@react-navigation/native";

function InputMe() {
  return (
    <Box>
      <HStack
        w="100%"
        bg={"brand.400"}
        alignItems="center"
        justifyContent={"space-around"}
      >
        <TextInput
          style={{
            height: 50,
            color: colors.textColor,
            width: "80%",

            borderRadius: 5,
            padding: 5,
            marginTop: 3,
          }}
          //   value={comments}
          //   onChangeText={change}
          placeholder="Add caption"
          placeholderTextColor={"rgba(255,255,255,0.6)"}
        />
        <IconPress
          //   click={() => submitToComments()}
          children={<FontAwesome name="send" size={30} color={colors.brand} />}
        />
      </HStack>
    </Box>
  );
}

export default InputMe;
