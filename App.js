import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Unboarding from "./pages/Onboarding";
import React, { useState, useEffect } from "react";

import { NavigationContainer } from "@react-navigation/native";
import { Box, extendTheme, NativeBaseProvider, Spinner } from "native-base";
import { initializeApp } from "firebase/app";
import { useFonts } from "expo-font";
import Login from "./pages/Login";
import CallPage from "./screens/Frontpage";
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

const Stack = createNativeStackNavigator();
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

export default function App() {
  let [fontsLoaded] = useFonts({
    "Raleway-Regular": require("./assets/fonts/static/Raleway-Regular.ttf"),
    "AlmendraSC-Regular": require("./assets/fonts/AlmendraSC-Regular.ttf"),
  });
  const [log, setLog] = useState(undefined);
  const [loading, setloading] = useState(false);
  const [user, setUser] = useState({});

  const checkuser = useStore((state) => state.checkuser);

  useEffect(() => {
    onAuthStateChanged(getAuth(app), (user) => {
      if (user) {
        setloading(true);
        setLog(true);
        checkuser();
      }
      if (!user) {
        setLog(false);
      }
    });
  });

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
      <Box flex={1} backgroundColor="brand.100">
        <NavigationContainer>
          <Stack.Navigator>
            {loading ? (
              <>
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="frontpage"
                  component={CallPage}
                  initialParams={{ user: user }}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="personalcall"
                  component={Personal}
                />
                <Stack.Screen
                  options={{ headerShown: false }}
                  name="brainstorm"
                  component={BrainstormArena}
                />
              </>
            ) : (
              <Stack.Screen
                options={{ headerShown: false }}
                name="load"
                component={Loading}
              />
            )}
          </Stack.Navigator>
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
