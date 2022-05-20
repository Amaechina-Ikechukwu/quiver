import React from "react";
import { TouchableOpacity, StyleSheet, Text } from "react-native";
function Buttons(props) {
  return (
    <TouchableOpacity
      onPress={props.click}
      style={[
        {
          height: 50,
          borderRadius: 5,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: 10,
        },
        props.styles,
      ]}
    >
      <Text style={props.textStyle}>{props.title}</Text>
    </TouchableOpacity>
  );
}

export default Buttons;
