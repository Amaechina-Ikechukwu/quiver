import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Unboarding from "./pages/Onboarding";
import React, { useState, useEffect } from "react";
import { KeyboardAvoidingView, useToast } from "native-base";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { Box, extendTheme, NativeBaseProvider, Spinner } from "native-base";
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
import { onAuthStateChanged, getAuth } from "firebase/auth";
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

import EditProfile from "./screens/ProfileContents/EditProfile";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
initializeApp(firebaseConfig);

const newColorTheme = {
  brand: {
    100: "#151515",
    200: "#181818",
    300: "#00E5CA",
    400: "#272727",
    800: "#E5E5E5",
    700: "#029A88",
  },
  fontConfig: {
    Sedan: {
      400: {
        normal: "AlmendraSC-Regular",
        italic: "AlmendraSC-Regular",
      },
    },
    Raleway: {
      100: {
        normal: "Raleway-Light",
        italic: "Raleway-LightItalic",
      },
      200: {
        normal: "Raleway-Light",
        italic: "Raleway-LightItalic",
      },
      300: {
        normal: "Raleway-Light",
        italic: "Raleway-LightItalic",
      },
      400: {
        normal: "Raleway-Regular",
        italic: "Raleway-Italic",
      },
      500: {
        normal: "Raleway-Medium",
      },
      600: {
        normal: "Raleway-Medium",
        italic: "Raleway-MediumItalic",
      },
    },
  },
  fonts: {
    heading: "AlmendraSC-Regular",
    body: "Raleway",
    mono: "Raleway",
  },
};
const theme = extendTheme({ colors: newColorTheme });

function ProfileStackScreen() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={ProfilePage}
      />
      <Stack.Screen
        options={{ headerShown: false }}
        name="UserProfile"
        component={UserProfile}
      />
    </Stack.Navigator>
  );
}

export default function App() {
  const isOnline = useStore((state) => state.isOnline);
  let [fontsLoaded] = useFonts({
    "Raleway-Regular": require("./assets/fonts/static/Raleway-Regular.ttf"),
    "AlmendraSC-Regular": require("./assets/fonts/AlmendraSC-Regular.ttf"),
  });
  const [log, setLog] = useState(undefined);
  const [loading, setloading] = useState(false);
  const [user, setUser] = useState({});
  const toast = useToast();
  const checkuser = useStore((state) => state.checkuser);
  const toastt = useStore((state) => state.toast);
  console.log(toastt);
  const getNotify = useStore((state) => state.getNotify);
  const setPosts = useStore((state) => state.setPosts);
  const setQuiver = useStore((state) => state.setQuiver);
  const setHasQuiver = useStore((state) => state.setHasQuiver);
  const getLikes = useStore((state) => state.getLikes);
  const isUsers = useStore((state) => state.isUsers);
  const setUserData = useStore((state) => state.setUserData);

  const connect = async () => {
    const db = getDatabase();
    var myConnectionsRef = await ref(
      db,
      `connection/${getAuth().currentUser.uid}`
    );
    let on;
    // stores the timestamp of my last disconnect (the last time I was seen online)
    var lastOnlineRef = await ref(
      db,
      `connection/${getAuth().currentUser.uid}/lastOnline`
    );

    var connectedRef = await ref(db, ".info/connected");
    onValue(connectedRef, (snap) => {
      if (snap.val() === true) {
        // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
        const con = push(myConnectionsRef);

        // When I disconnect, remove this device
        onDisconnect(con).remove();

        // Add this device to my connections list
        // this value could contain info about the device or a timestamp too
        set(con, true);

        // When I disconnect, update the last time I was seen online
        onDisconnect(lastOnlineRef).set(serverTimestamp());
        console.log("connected");

        isOnline(true);
      } else {
        console.log("not connected");
        isOnline(false);
      }
    });
    return on;
  };

  useEffect(() => {
    onAuthStateChanged(getAuth(app), (user) => {
      if (user) {
        setloading(true);
        setLog(true);
        connect();
        checkuser();
        getNotify();
        setQuiver();
        setHasQuiver();
        getLikes();
        isUsers();
        setPosts();
        setUserData();
        setTimeout(() => {
          setPosts();
          // isUsers();
        }, 3000);
      }
      if (!user) {
        setLog(false);
      }
    });
  }, []);

  // if (seenSplash.seenSplash == false) {
  //   return (
  //     <NativeBaseProvider theme={theme}>
  // <Box
  //   w="full"
  //   flex={1}
  //   bg="brand.100"
  //   alignItems="center"
  //   justifyContent="center"
  // >
  //         <NavigationContainer>
  //           <Stack.Navigator>
  //             <Stack.Screen
  //               name="Home"
  //               component={Unboarding}
  //               options={{ title: "Welcome" }}
  //             />
  //           </Stack.Navigator>
  //         </NavigationContainer>
  //       </Box>
  //     </NativeBaseProvider>
  //   );
  // }
  // if (loading == false) {
  //   return (
  //     <NativeBaseProvider theme={theme}>
  //       <Box
  //         bg="brand.100"
  //         flex={1}
  //         width="100%"
  //         alignItems={"center"}
  //         justifyContent={"center"}
  //       >
  //         <Text color="brand.700">Loading</Text>
  //       </Box>
  //     </NativeBaseProvider>
  //   );
  // }

  if (log == false) {
    return (
      <NativeBaseProvider theme={theme}>
        <Login />
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider theme={theme}>
      <KeyboardAvoidingView position={"relative"} h="full">
        <Box flex={1} backgroundColor="brand.100">
          <NavigationContainer>
            {loading ? (
              <>
                <RootStack.Navigator>
                  <RootStack.Screen
                    options={{ headerShown: false }}
                    name="Example"
                    component={Example}
                  />

                  <RootStack.Screen
                    options={{ headerShown: false }}
                    name="Callpage"
                    component={CallPage}
                    initialParams={{ user: user }}
                  />
                  <RootStack.Screen
                    options={{ headerShown: false }}
                    name="personalcall"
                    component={Personal}
                  />
                  <RootStack.Screen
                    options={{ headerShown: false }}
                    name="brainstorm"
                    component={BrainstormArena}
                  />
                  <RootStack.Screen
                    name="UserProfile"
                    component={UserProfile}
                    options={{
                      title: "Back",
                      headerStyle: {
                        backgroundColor: colors.sec,
                      },
                      headerTintColor: "#fff",
                      headerTitleStyle: {
                        fontWeight: "200",
                      },
                    }}
                  />

                  <RootStack.Screen
                    name="Postpage"
                    component={PostModals}
                    options={{
                      title: "Post",
                      headerStyle: {
                        backgroundColor: colors.sec,
                      },
                      headerTintColor: "#fff",
                      headerTitleStyle: {
                        fontWeight: "200",
                      },
                    }}
                  />

                  <RootStack.Screen
                    name="Comments"
                    component={CommentPage}
                    options={{
                      title: "Post",
                      headerStyle: {
                        backgroundColor: colors.sec,
                      },
                      headerTintColor: "#fff",
                      headerTitleStyle: {
                        fontWeight: "200",
                      },
                      headerShown: false,
                      presentation: "modal",
                    }}
                  />
                  <RootStack.Screen
                    name="PhotosRender"
                    component={PhotosRender}
                    options={{
                      title: "Post",
                      headerStyle: {
                        backgroundColor: colors.sec,
                      },
                      headerTintColor: "#fff",
                      headerTitleStyle: {
                        fontWeight: "200",
                      },
                      headerShown: false,
                      presentation: "modal",
                    }}
                  />

                  <RootStack.Screen
                    name="EditProfile"
                    component={EditProfile}
                    options={{
                      title: "Post",
                      headerStyle: {
                        backgroundColor: colors.sec,
                      },
                      headerTintColor: "#fff",
                      headerTitleStyle: {
                        fontWeight: "200",
                      },
                      headerShown: false,
                      presentation: "modal",
                    }}
                  />
                </RootStack.Navigator>

                <Box safeAreaBottom />
              </>
            ) : (
              <Loading />
            )}
          </NavigationContainer>
        </Box>
      </KeyboardAvoidingView>
    </NativeBaseProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
