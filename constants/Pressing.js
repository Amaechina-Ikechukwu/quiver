import { Box, Center, Pressable, Text } from "native-base";

function Pressing(props) {
  return (
    <Pressable
      {...props.style}
      w={props.w || null}
      h={props.h || null}
      onPress={props.click}
    >
      {({ isHovered, isFocused, isPressed }) => {
        return (
          <Box
            bg={props.bg || "brand.700"}
            p={3}
            rounded="sm"
            opacity={isFocused ? 0.5 : 1}
            style={{
              transform: [
                {
                  scale: isPressed ? 0.96 : 1,
                },
              ],
            }}
          >
            <Center>
              <Text
                style={props.textStyle}
                fontSize={props.tw || "sm"}
                color="brand.800"
              >
                {props.text}
              </Text>
            </Center>
          </Box>
        );
      }}
    </Pressable>
  );
}

export default Pressing;
