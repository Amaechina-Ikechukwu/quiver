import Unboarding from "./pages/Onboarding";
import React, { useState, useEffect } from "react";

import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
} from "@expo/vector-icons";

import { Box, extendTheme, NativeBaseProvider, Spinner } from "native-base";

import CallPage from "./screens/Callpage";

import Personal from "./callScreens/Personal";

import { app, firebaseConfig } from "./Firebase";
import { onAuthStateChanged, getAuth } from "firebase/auth";

import useStore from "./store/user";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "./screens/Homepage";
import colors from "./colors";
import ProfilePage from "./screens/Profile";
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
import UserProfile from "./screens/Userprofile";
import Notify from "./pages/Notify";
import PostPage from "./screens/PostFolder/Postpage";

const Tab = createBottomTabNavigator();

function Example({ navigation }) {
  const getNotify = useStore((state) => state.getNotify);
  const getNC = useStore((state) => state.getNC);
  const noticeCount = useStore((state) => state.noticeCount);

  const setPosts = useStore((state) => state.setPosts);
  const setCliques = useStore((state) => state.setCliques);

  useEffect(() => {
    getNotify();
    getNC();

    // setPosts();
  });
  return (
    <Box flex={1}>
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
        <Tab.Screen
          name="Home"
          component={PostPage}
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
          name="Call"
          component={CallPage}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="call-outline"
                size={size}
                color={focused ? colors.textColor : colors.disbrand}
              />
            ),
          }}
        />
        <Tab.Screen
          name="Notify"
          component={Notify}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="md-notifications-outline"
                size={size}
                color={focused ? colors.textColor : colors.disbrand}
              />
            ),
            tabBarBadge: noticeCount || null,
          }}
        />
        <Tab.Screen
          name="Profile"
          component={ProfilePage}
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
      </Tab.Navigator>
    </Box>
  );
}
export default Example;
