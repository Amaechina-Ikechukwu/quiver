import { Box, Button, Modal, Text } from "native-base";
import React, { useState, useEffect } from "react";
function FunModal({ open }) {
  return (
    <Modal isOpen={open} borderWidth={"0"}>
      <Modal.Content paddingX={2} paddingY={5} w="full" {...styles["bottom"]}>
        <Box w="full">
          <Text color="brand.800" mb="10%" fontSize={18}>
            Seems you haven’t added anyone to your quiver...
          </Text>
          <Box>
            <Box w="full" {...styles["display"]}>
              <Button bg={"brand.400"} w="1/4" mr={4}>
                <Text color="brand.800">Close</Text>
              </Button>
              <Button bg={"brand.800"} w="2/4" color="brand.100">
                <Text>Find Cliques</Text>
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal.Content>
    </Modal>
  );
}
const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0,
  },
  bottom: {
    marginBottom: 0,
    marginTop: "auto",
    backgroundColor: "brand.200",
    border: "none",
  },
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
  },
  center: {},
  display: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  place: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
};

export default FunModal;
