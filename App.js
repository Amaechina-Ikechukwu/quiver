import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Unboarding from "./pages/Onboarding";
import React, {
  useState,
  useEffect,
  useLayoutEffect,
  useCallback,
} from "react";
import { KeyboardAvoidingView, useToast } from "native-base";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
  FontAwesome,
  Entypo,
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
import BottomComments from "./screens/BottomComments";

import EditProfile from "./screens/ProfileContents/EditProfile";
import DirectMessage from "./screens/MessagesFolder/DirectMessage";
import SplashScreen from "./SplashScreen";
import MessageList from "./screens/MessagesFolder/MessageList";
import Notify from "./pages/Notify";
import PostPage from "./screens/PostFolder/Postpage";
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();

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
    <RootStack.Navigator>
      <RootStack.Screen
        options={{ headerShown: false }}
        name="Profile"
        component={ProfilePage}
      />
      <RootStack.Screen
        options={{ headerShown: true }}
        name="UserProfile"
        component={UserProfile}
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
  );
}

function MessageScreen() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        options={{ headerShown: false }}
        name="MessageList"
        component={MessageList}
      />
      <RootStack.Screen
        options={{
          headerStyle: {
            backgroundColor: colors.sec,
          },
          headerTitleAlign: "center",
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "200",
          },
          headerShown: true,
          presentation: "modal",
        }}
        name="DirectMessage"
        component={DirectMessage}
      />
    </RootStack.Navigator>
  );
}

function PostScreen() {
  return (
    <Stack.Navigator>
      {/* <Stack.Screen
        name="Home"
        component={HomePage}
        options={{
          title: "Post",
          headerStyle: {
            backgroundColor: colors.sec,
          },
          headerShown: false,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "200",
          },
        }}
      /> */}
      <Stack.Screen
        name="PostPage"
        component={PostPage}
        options={{
          title: "Post",
          headerStyle: {
            backgroundColor: colors.sec,
          },
          headerShown: false,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "200",
          },
        }}
      />

      <Stack.Screen
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
      <Stack.Screen
        options={{
          headerStyle: {
            backgroundColor: colors.sec,
          },
          headerShown: true,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "200",
          },
        }}
        name="UserProfile"
        component={UserProfile}
      />
    </Stack.Navigator>
  );
}

function Notifications() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen
        name="Notify"
        component={Notify}
        options={{
          headerStyle: {
            backgroundColor: colors.sec,
          },
          headerShown: false,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "200",
          },
        }}
      />
      <RootStack.Screen
        options={{
          headerStyle: {
            backgroundColor: colors.sec,
          },
          headerShown: false,
          headerTintColor: "#fff",
          headerTitleStyle: {
            fontWeight: "200",
          },
        }}
        name="UserProfileN"
        component={UserProfile}
      />
    </RootStack.Navigator>
  );
}

export default function App() {
  const isOnline = useStore((state) => state.isOnline);
  let [fontsLoaded] = useFonts({
    "Raleway-Regular": require("./assets/fonts/static/Raleway-Regular.ttf"),
    "AlmendraSC-Regular": require("./assets/fonts/AlmendraSC-Regular.ttf"),
  });
  const [log, setLog] = useState(true);
  const [loading, setloading] = useState(false);
  const [user, setUser] = useState({});
  const [NotificationCount, setNotificationCount] = useState(0);
  const [UnreadMessagesCount, setUnreadMessagesCount] = useState(0);
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
  const inQuiver = useStore((state) => state.inQuiver);
  const setUserData = useStore((state) => state.setUserData);
  const openComment = useStore((state) => state.openComment);
  const setChatList = useStore((state) => state.setChatList);
  const setLastMessages = useStore((state) => state.setLastMessages);
  const getNC = useStore((state) => state.getNC);
  const clearToast = useStore((state) => state.clearToast);
  const setUnreadMessages = useStore((state) => state.setUnreadMessages);
  const UnreadMessages = useStore((state) => state.UnreadMessages);
  const noticeCount = useStore((state) => state.noticeCount);

  const connect = async () => {
    const db = getDatabase();
    let on;
    onAuthStateChanged(getAuth(app), async (user) => {
      var myConnectionsRef = await ref(db, `connection/${user.uid}`);

      // stores the timestamp of my last disconnect (the last time I was seen online)
      var lastOnlineRef = await ref(db, `connection/${user.uid}/lastOnline`);

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
    });

    return on;
  };
  const CallAllFunctions = () => {
    clearToast();
    connect();
    setLastMessages();
    getNotify();
    setChatList();
    getNC();

    setHasQuiver();
    getLikes();
    checkuser();
    isUsers();

    setTimeout(() => {
      setUnreadMessages();
      setNotificationCount(noticeCount);
      setUnreadMessagesCount(UnreadMessages.length);
    }, 5000);
  };
  useEffect(() => {
    initializeApp(firebaseConfig);
    clearToast();
    connect();
    setLastMessages();
    getNotify();
    setChatList();
    getNC();
    setQuiver();
    setHasQuiver();
    getLikes();
    checkuser();
    isUsers();

    onAuthStateChanged(getAuth(app), (user) => {
      if (!user) {
        setLog(false);
      } else {
        console.log("inQuiver", inQuiver);
        setloading(true);
        setLog(true);
        setTimeout(() => {
          setUnreadMessages();
          setNotificationCount(noticeCount);
          setUnreadMessagesCount(UnreadMessages.length);
          setUserData();
          setPosts();
          console.log(
            "notification",
            NotificationCount,
            "---",
            "Unread",
            UnreadMessages.length
          );
        }, 5000);
      }
    });
    return () => {};
  }, []);

  if (log == false) {
    return (
      <NativeBaseProvider theme={theme}>
        <SplashScreen />
      </NativeBaseProvider>
    );
  }

  return (
    <NativeBaseProvider theme={theme}>
      <Box flex={1} backgroundColor="brand.100">
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={() => ({
              headerShown: false,
              tabBarHideOnKeyboard: true,
              tabBarActiveTintColor: `${colors.textColor}`,
              tabBarInactiveTintColor: colors.disbrand,
              tabBarStyle: {
                backgroundColor: colors.primary,
                border: "none",
                padding: 1,
              },
              tabBarLabelStyle: {
                fontWeight: "bold",
              },
            })}
          >
            <Tab.Group>
              <Tab.Screen
                name="Home"
                component={PostScreen}
                options={{
                  tabBarLabel: "Home",
                  tabBarIcon: ({ focused, size, color }) => (
                    <Octicons
                      name="home"
                      size={size}
                      color={focused ? colors.textColor : colors.disbrand}
                    />
                  ),
                }}
              />

              {/* <Tab.Screen
          name="Talks"
          component={PostPage}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Foundation
                name="sound"
                size={size}
                color={focused ? colors.textColor : colors.disbrand}
              />
            ),
          }}
        /> */}

              <Tab.Screen
                name="Messages"
                component={MessageScreen}
                options={{
                  tabBarIcon: ({ focused, size }) => (
                    <Entypo
                      name="new-message"
                      size={24}
                      color={focused ? colors.textColor : colors.disbrand}
                    />
                  ),
                  tabBarBadge:
                    UnreadMessages.length !== 0 ? UnreadMessagesCount : null,
                }}
              />
              <Tab.Screen
                name="Notify"
                component={Notifications}
                options={{
                  tabBarIcon: ({ focused, size }) => (
                    <Ionicons
                      name="md-notifications-outline"
                      size={size}
                      color={focused ? colors.textColor : colors.disbrand}
                    />
                  ),
                  tabBarBadge: NotificationCount || null,
                  headerShown: false,
                }}
              />
              <Tab.Screen
                name="Profile"
                component={ProfileStackScreen}
                options={{
                  tabBarIcon: ({ focused, size }) => (
                    <Ionicons
                      name="person-outline"
                      size={size}
                      color={focused ? colors.textColor : colors.disbrand}
                    />
                  ),
                }}
              />
            </Tab.Group>
          </Tab.Navigator>

          <Box safeAreaBottom />
        </NavigationContainer>
      </Box>
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
