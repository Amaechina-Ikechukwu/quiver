import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import Unboarding from "./pages/Onboarding";
import { NativeRouter, Route, Link, Routes } from "react-router-native";
import { Box, extendTheme, NativeBaseProvider } from "native-base";

import { useFonts } from "expo-font";
import Login from "./pages/Login";
import CallPage from "./screens/Frontpage";
import Personal from "./callScreens/Personal";
import BrainstormArena from "./callScreens/Brainstrom";

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

  return (
    <NativeBaseProvider theme={theme}>
      <Box
        w="full"
        flex={1}
        bg="brand.100"
        alignItems="center"
        justifyContent="center"
      >
        <NativeRouter>
          <Routes>
            {/* <Route exact path="/" element={<Unboarding />} /> */}
            <Route exact path="/" element={<Login />} />
            <Route exact path="/frontpage" element={<CallPage />} />
            <Route exact path="/personalcall" element={<Personal />} />
            <Route exact path="/brainstorm" element={<BrainstormArena />} />
          </Routes>
        </NativeRouter>
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
