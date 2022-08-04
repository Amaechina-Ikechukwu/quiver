import { Box, Center, Pressable, Text } from "native-base";

function IconPress(props, { navigation }) {
  return (
    <Pressable
      {...props.style}
      w={props.w || null}
      h={props.h || null}
      onPress={props.click}
      bg={props.bg || null}
    >
      {({ isHovered, isFocused, isPressed }) => {
        return (
          <Box
            bg={props.bg || null}
            rounded="sm"
            opacity={isPressed ? 0.5 : 1}
            style={{
              transform: [
                {
                  scale: isPressed ? 0.96 : 1,
                },
              ],
            }}
          >
            <Center>{props.children}</Center>
          </Box>
        );
      }}
    </Pressable>
  );
}

export default IconPress;
