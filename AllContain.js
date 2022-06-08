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
import Notifications from "./screens/Notifications";

const Tab = createBottomTabNavigator();

function Example({ navigation }) {
  const isOnline = useStore((state) => state.isOnline);

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
  const getNotify = useStore((state) => state.getNotify);
  useEffect(() => {
    getNotify();
    connect();
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
          component={HomePage}
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

        <Tab.Screen
          name="Talks"
          component={Personal}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Foundation
                name="sound"
                size={size}
                color={focused ? colors.textColor : colors.disbrand}
              />
            ),
          }}
        />

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
          component={Notifications}
          options={{
            tabBarIcon: ({ focused, size }) => (
              <Ionicons
                name="md-notifications-outline"
                size={size}
                color={focused ? colors.textColor : colors.disbrand}
              />
            ),
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
