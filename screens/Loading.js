import { Box, Spinner } from "native-base";
import React, { useState, useEffect } from "react";
import { Text, View } from "react-native";
function Loading() {
  return (
    <Box
      bg="brand.100"
      flex={1}
      alignItems={"center"}
      justifyContent={"center"}
    >
      <Spinner size="sm" color={"brand.700"} />
    </Box>
  );
}

export default Loading;
