import { Text } from "native-base";
import React from "react";
function CText(props) {
  return (
    <Text
      color="brand.800"
      {...props.style}
      fontSize={props.size == undefined ? "md" : props.size}
    >
      {props.text}
    </Text>
  );
}

export default CText;
