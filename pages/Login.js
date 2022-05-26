import { Box, Center, Flex, Spacer } from "native-base";
import React, { useState, useEffect, useRef } from "react";
import Buttons from "../constants/Button";
import Header from "../constants/Header";
import colors from "../colors";
import { StyleSheet, Text, Image, Animated, View } from "react-native";
import { Link, useNavigate } from "react-router-native";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  signInWithRedirect,
  signInWithCredential,
} from "firebase/auth";
import useLoggedIn from "../store/loggedin";
import app from "../Firebase";
import * as WebBrowser from "expo-web-browser";
import { ResponseType } from "expo-auth-session";
import * as Google from "expo-auth-session/providers/google";
WebBrowser.maybeCompleteAuthSession();

function Login({ navigation }) {
  const ballAnimatedValue = useRef(new Animated.Value(0)).current;

  const xVal = ballAnimatedValue.interpolate({
    inputRange: [0, 10],
    outputRange: [0, 1],
  });

  const yVal = ballAnimatedValue.interpolate({
    inputRange: [0, 10],
    outputRange: [0, -70],
  });
  const animStyle = {
    transform: [
      {
        translateY: yVal,
      },
      { translateX: xVal },
    ],
  };

  const MoveIn = () => {
    // Will change fadeAnim value to 1 in 5 seconds
    Animated.timing(ballAnimatedValue, {
      toValue: 1,
      duration: 800,
      useNativeDriver: true,
    }).start();
  };

  const [request, response, promptAsync] = Google.useIdTokenAuthRequest({
    clientId:
      "694344473866-soltk0t5sdhfl2tg42dhe9p2o61ja2vc.apps.googleusercontent.com",
  });

  const googlesignout = () => {
    var auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
      })
      .catch((error) => {
        // An error happened.
      });
  };

  useEffect(() => {
    MoveIn();
    if (response?.type === "success") {
      const { id_token } = response.params;

      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      // const credential = provider.credential(id_token);
      signInWithCredential(auth, GoogleAuthProvider.credential(id_token));
    }
  }, [response]);

  return (
    <Center bg="brand.100" w="full" h="full">
      <Flex align="center" justify="space-evenly">
        <Animated.View style={[animStyle]}>
          <Header
            title="Quiver"
            styles={{ color: colors.textColor, marginBottom: "20%" }}
          />
        </Animated.View>

        <Image source={require("../assets/quiver.png")} />
        <Center w="full" mt="20%">
          <Buttons
            click={() => promptAsync()}
            title="Login in with Google"
            styles={styles.button}
            textStyle={styles.text}
          />

          <Text
            style={[
              styles.text,
              { textAlign: "center", opacity: 0.8, fontSize: 18 },
            ]}
          >
            Google verification allows us to elinimate fake users
          </Text>
        </Center>
      </Flex>
    </Center>
  );
}
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
export default Login;
