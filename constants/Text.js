import { Text } from "native-base";
import React from "react";
function CText(props) {
  return (
    <Text
      color={props.color == undefined ? "brand.800" : props.color}
      {...props.style}
      fontSize={props.size == undefined ? "md" : props.size}
    >
      {props.text}
    </Text>
  );
}

export default CText;
