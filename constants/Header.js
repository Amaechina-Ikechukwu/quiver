import React from "react";
import { StyleSheet, Text } from "react-native";
import { useFonts } from "expo-font";
function Header(props) {
  return (
    <Text
      style={[{ fontSize: 50, fontFamily: "AlmendraSC-Regular" }, props.styles]}
    >
      {props.title}
    </Text>
  );
}

export default Header;
