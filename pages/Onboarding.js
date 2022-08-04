import Onboarding from "react-native-onboarding-swiper";
import React, { useState, useEffect, useRef } from "react";
import { Entypo } from "@native-base/icons";
import {
  StyleSheet,
  View,
  Dimensions,
  Animated,
  Button,
  TouchableOpacity,
  Text,
  StatusBar,
} from "react-native";
import { Box, Center, Flex, Icon, Container, Spinner } from "native-base";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { useFonts } from "expo-font";
import { Link, useNavigate } from "react-router-native";
import useSplash from "../store/Splash";

const MoveOut = () => {
  // Will change fadeAnim value to 0 in 3 seconds
  Animated.timing(fadeAnim, {
    toValue: 0,
    duration: 3000,
  }).start();
};

function Unboarding() {
  let [fontsLoaded] = useFonts({
    "Raleway-Regular": require("../assets/fonts/static/Raleway-Regular.ttf"),
    "AlmendraSC-Regular": require("../assets/fonts/AlmendraSC-Regular.ttf"),
  });
  const [index, setIndex] = useState(1);
  const ballAnimatedValue = useRef(new Animated.Value(0)).current;

  const seenSplash = useSplash();
  const xVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 40],
  });

  const yVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 45],
  });
  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
      { translateX: xVal },
      { scaleX: -1 },
    ],
  };
  const qVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 10],
  });

  const wVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 50],
  });
  const qwnimStyle = {
    transform: [
      {
        translateY: qVal,
      },
      { translateX: wVal },
      { scaleX: -1 },
    ],
  };
  ////////////////index 2

  const sVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 70],
  });

  const dVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 80],
  });
  const sdnimStyle = {
    transform: [
      {
        translateY: sVal,
      },
      { translateX: dVal },
      { scaleX: -1 },
    ],
  };
  ////////////////////////////////////////////////////////////////

  const mVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  const nVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -55],
  });
  const mnimStyle = {
    transform: [
      {
        translateY: mVal,
      },
      { translateX: nVal },
    ],
  };

  ////index 3

  const rVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -90],
  });

  const tVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -60],
  });
  const rtnimStyle = {
    transform: [
      {
        translateY: rVal,
      },
      { translateX: tVal },
    ],
  };
  const tnimStyle = {
    transform: [
      {
        translateY: rVal,
      },
      { translateX: tVal },
      {
        scaleX: -1,
      },
    ],
  };

  ////index 2

  const bVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -70],
  });

  const vVal = ballAnimatedValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, -80],
  });
  const bvnimStyle = {
    transform: [
      {
        translateY: bVal,
      },
      { translateX: vVal },
    ],
  };

  const MoveIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(ballAnimatedValue, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const MoveOut = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(ballAnimatedValue, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  const Log = () => {
    MoveOut();
    setTimeout(() => {
      MoveIn();
    }, 800);
    setTimeout(() => {
      seenSplash.hasSeenSplash();
    }, 2000);
  };

  const Push = () => {
    MoveOut();
    setTimeout(() => {
      MoveIn();
    }, 800);

    setTimeout(() => {
      if (index >= 3) {
        setIndex(index - 2);
      } else setIndex(index + 1);
      index;
    }, 2000);
  };

  useEffect(() => {
    // async function loadFonts() {
    //   await Font.loadAsync({
    //     Raleway: require("../assets/fonts/static/Raleway-Regular.ttf"),
    //     "AlmendraSC-Regular": require("../assets/fonts/AlmendraSC-Regular.ttf"),
    //   })
    //     .then((res) => {
    //        ("FONTS LOADED!");
    //     })
    //     .catch((Err) => {
    //        (Err);
    //     });
    // }
    MoveIn();
  });
  if (!fontsLoaded) {
    return <Spinner size="sm" />;
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="default" />
      <View style={styles.vText}>
        <Text style={styles.text}>Quiver</Text>
      </View>
      <View>
        {index === 1 ? (
          <View style={styles.vUn}>
            <View style={{ width: "100%" }}>
              <Animated.View
                style={[
                  {
                    display: "flex",
                    alignItems: "flex-end",
                  },
                  animStyle,
                ]}
              >
                <Ionicons name="md-people" size={150} color="#4F4F4F" />
              </Animated.View>
              <Animated.View
                style={[{ display: "flex", alignItems: "flex-end" }, mnimStyle]}
              >
                <Ionicons name="md-people" size={150} color="#E5E5E5" />
              </Animated.View>
            </View>
            <View>
              <Text style={styles.vTitle}>
                Continue the never ending gists with cliques right
                <Text style={{ color: "#00E5CA" }}> here</Text>.
              </Text>
            </View>
          </View>
        ) : null}
        {/* ///////////////////////////////////////////////////////////////////////////////////// */}
        {index === 2 ? (
          <View style={styles.vUn}>
            <View style={{ width: "75%" }}>
              <Animated.View
                style={[
                  {
                    display: "flex",
                    alignItems: "flex-end",
                  },
                  sdnimStyle,
                ]}
              >
                <View
                  style={{
                    height: 200,
                    width: 50,
                    backgroundColor: "#4f4f4f",
                    borderRadius: 5,
                  }}
                />
              </Animated.View>
              <Animated.View
                style={[
                  { display: "flex", alignItems: "flex-end" },
                  bvnimStyle,
                ]}
              >
                <View
                  style={{
                    height: 200,
                    width: 50,
                    backgroundColor: "#029A88",
                    borderRadius: 5,
                  }}
                />
              </Animated.View>
            </View>

            <View>
              <Text
                style={{ color: "#fff", fontSize: 22, fontWeight: "normal" }}
              >
                There is still space for the one on one immersing
                <Text style={{ color: "#00E5CA" }}> conversation</Text>....or
                chyke.
              </Text>
            </View>
          </View>
        ) : null}
        {/* ///////////////////////////////////////////////////////////////////////////////////// */}

        {index === 3 ? (
          <View style={styles.vUn}>
            <View style={{ width: "100%" }}>
              <Animated.View
                style={[
                  {
                    display: "flex",
                    alignItems: "flex-end",
                  },
                  qwnimStyle,
                ]}
              >
                <MaterialIcons name="lightbulb" size={200} color="#4F4F4F" />
              </Animated.View>
              <Animated.View
                style={[
                  { display: "flex", alignItems: "flex-end" },
                  rtnimStyle,
                ]}
              >
                <Ionicons name="ios-person" size={200} color="#029A88" />
              </Animated.View>
            </View>

            <View>
              <Text style={[styles.vTitle, { padding: 5 }]}>
                Come up with an idea and have it stick with the provided
                <Text style={{ color: "#00E5CA" }}> idea-side</Text>.
              </Text>
            </View>
          </View>
        ) : null}
      </View>
      <View
        style={{
          width: "100%",

          display: "flex",
          alignItems: "center",
        }}
      >
        {index === 3 ? (
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              width: "70%",
              height: 50,
              padding: 5,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => Log()}
          >
            <Text>Login</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            style={{
              backgroundColor: "white",
              width: "70%",
              height: 50,
              padding: 5,
              borderRadius: 5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPressOut={() => MoveIn()}
            onPress={() => Push()}
          >
            <Text>Here</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: Dimensions.get("window").height,
    alignItems: "center",
    justifyContent: "space-evenly",
    backgroundColor: "#151515",
  },
  text: {
    fontSize: 46,
    color: "#fff",
    fontFamily: "AlmendraSC-Regular",
  },
  vText: {
    display: "flex",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    width: "100%",
    position: "relative",
    right: -20,
  },
  vUn: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  vTitle: {
    fontSize: 20,
    color: "#fff",
    textAlign: "left",
    fontFamily: "Raleway-Regular",
  },
});
export default Unboarding;
