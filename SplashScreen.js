import Unboarding from "./pages/Onboarding";
import React, { useState, useEffect, createRef, useRef } from "react";
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
  VStack,
  KeyboardAvoidingView,
} from "native-base";
import {
  View,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  Dimensions,
  Text,
  StyleSheet,
} from "react-native";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";

import { initializeApp } from "firebase/app";
import { useFonts } from "expo-font";
import Login from "./pages/Login";
import CallPage from "./screens/Callpage";
import Loading from "./screens/Loading";
import Personal from "./callScreens/Personal";
import BrainstormArena from "./callScreens/Brainstrom";
import useSplash from "./store/Splash";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createStackNavigator } from "@react-navigation/stack";
import useLoggedIn from "./store/loggedin";
import { app, firebaseConfig } from "./Firebase";
import * as WebBrowser from "expo-web-browser";
import { ResponseType } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithCredential,
} from "firebase/auth";
import { registerRootComponent } from "expo";
import { LocalGasStationTwoTone } from "@material-ui/icons";
import useStore from "./store/user";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./screens/Homepage";
import colors from "./colors";
import ProfilePage from "./screens/Profile";
import useNewStore from "./store/post";
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
} from "firebase/database";
import UserProfile from "./pages/UserProfile/Userprofile";
import Example from "./AllContain";
import PostModals from "./screens/PostFolder/PostModal";
import CommentPage from "./pages/CommentsFolder/Comments";
import PhotosRender from "./screens/ProfileContents/PhotosRender";
import BottomComments from "./screens/BottomComments";
import EditProfile from "./screens/ProfileContents/EditProfile";
import DirectMessage from "./screens/MessagesFolder/DirectMessage";
import CText from "./constants/Text";
import Buttons from "./constants/Button";
import { AutoScrollFlatList } from "react-native-autoscroll-flatlist";

function SplashScreen() {
  const toasted = useStore((state) => state.toasted);
  const [intervalTime, setIntervalTime] = useState(4000);
  const andriodclient =
    "694344473866-0cqv3mmgcgsbp4crsll8v0retpfgrnik.apps.googleusercontent.com";
  const webclient =
    "694344473866-oiar0lsbjv3a44h3brukvgf10igc2lp3.apps.googleusercontent.com";
  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId: andriodclient,
  });

  let CurrentSlide = 0;
  let IntervalTime = 4000;
  const splash = [
    {
      id: 1,
      image: require("./images/ketut.jpg"),
      text: "Forboding The Stigma Of Less Followers",
    },
    {
      id: 2,
      image: require("./images/mikoto.jpg"),
      text: "Truly Connecting and Sharing",
    },
    {
      id: 3,
      image: require("./images/cotton.jpg"),
      text: "Express Thy Self",
    },
  ];
  let flatList;
  flatList = useRef();
  // TODO _goToNextPage()
  var goToNextPage = () => {
    if (flatList !== null) {
      if (CurrentSlide == splash.length - 1) {
        CurrentSlide = 0;
      } else {
        ++CurrentSlide;
      }

      flatList.scrollToIndex({
        index: CurrentSlide,
        animated: true,
      });
    } else {
      null;
    }
  };

  var stopPage = () => {
    flatList.current.scrollToIndex({
      index: 0,
      animated: true,
    });
  };

  const [text, setText] = useState("Login with Google");
  const autoplay = () => {};

  const stopPlay = () => {
    setIntervalTime(0);
  };
  const windowWidth = Dimensions.get("window").width;
  const windowHeight = Dimensions.get("window").height;
  const createAlert = useStore((state) => state.setAlert);

  useEffect(() => {
    if (response?.type === "success") {
      const { id_token } = response.params;

      const auth = getAuth();
      const provider = new GoogleAuthProvider();

      // const credential = provider.credential(id_token);
      signInWithCredential(auth, GoogleAuthProvider.credential(id_token))
        .then((result) => {
          const val = result.user;
          const db = getDatabase();
          set(ref(db, "users/" + val.uid), {
            phoneNumber: `${val.phoneNumber !== "" ? val.phoneNumber : ""}`,
            displayName: val.displayName,
            photoURL: val.photoURL,
          });
          const rad = Math.random().toString(36).substring(2, 17);
          // const reff = ref(db, "inQuiver/" + val.uid + `/${rad}`);
          // const toPush = push(reff);
          set(ref(db, "inQuiver/" + val.uid), {
            currentUser: `${val.uid}`,
            followedBy: `${val.uid}`,
          });
          setText("Loading");
          ("updated");
          createAlert("Profile set");
          navigation.navigate("Home");
        })
        .catch((err) => {
          createAlert("Profile not set");
        });
    }
    return () => {};
  }, [response]);

  return (
    <Box flex={1} bg={"brand.100"}>
      <FlatList
        data={splash}
        horizontal
        ref={flatList}
        renderItem={({ item }) => {
          return (
            <Box alignItems="center">
              <ImageBackground
                resizeMode="cover"
                style={{
                  width: windowWidth,
                  height: windowHeight,
                  padding: 50,
                  justifyContent: "center",
                  alignItems: "center",
                }}
                source={item.image}
              >
                <Box
                  w={windowWidth}
                  h={windowHeight}
                  bg={"rgba(2, 154, 136,0.6)"}
                >
                  <Box
                    w={windowWidth}
                    h={windowHeight * 0.9}
                    px={5}
                    justifyContent="flex-end"
                  >
                    <CText
                      text={item.text}
                      size="3xl"
                      style={{ fontSize: 50, fontWeight: "900" }}
                    />
                  </Box>
                </Box>
              </ImageBackground>
            </Box>
          );
        }}
      />
      <Box
        w={windowWidth}
        h={windowHeight}
        position="absolute"
        justifyContent={"center"}
        bg={"rgba(0,0,0,0.6)"}
      >
        <Box alignItems={"center"}>
          <Image source={require("./assets/quiver.png")} />
        </Box>

        <Center w="full" mt="20%">
          <Buttons
            click={() => promptAsync()}
            title={text}
            styles={styles.button}
            textStyle={styles.text}
          />

          <Text
            style={[
              styles.text,
              { textAlign: "center", opacity: 0.8, fontSize: 14 },
            ]}
          >
            One click authentication
          </Text>
        </Center>
      </Box>
    </Box>
  );
}

export default SplashScreen;
const styles = StyleSheet.create({
  button: {
    width: "90%",
    backgroundColor: colors.brand2,
    marginBottom: "5%",
  },
  text: {
    fontSize: 20,
    color: colors.textColor,
    fontFamily: "Raleway-Regular",
  },
});
