// import Unboarding from "./pages/Onboarding";
// import React, { useState, useEffect } from "react";

// import {
//   Ionicons,
//   SimpleLineIcons,
//   Octicons,
//   Foundation,
//   AntDesign,
//   Entypo,
// } from "@expo/vector-icons";

// import { Box, extendTheme, NativeBaseProvider, Spinner } from "native-base";

// import CallPage from "./screens/Callpage";

// import Personal from "./callScreens/Personal";

// import { app, firebaseConfig } from "./Firebase";
// import { onAuthStateChanged, getAuth } from "firebase/auth";

// import useStore from "./store/user";
// import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
// import HomePage from "./screens/Homepage";
// import colors from "./colors";
// import ProfilePage from "./screens/Profile";
// import {
//   getDatabase,
//   ref,
//   onValue,
//   push,
//   onDisconnect,
//   set,
//   serverTimestamp,
//   get,
//   child,
// } from "firebase/database";
// import UserProfile from "./pages/UserProfile/Userprofile";
// import Notify from "./pages/Notify";
// import PostPage from "./screens/PostFolder/Postpage";
// import BottomComments from "./screens/BottomComments";
// import MessageList from "./screens/MessagesFolder/MessageList";
// import SplashScreen from "./SplashScreen";

// const Tab = createBottomTabNavigator();

// function Example({ navigation }) {
//   const getNotify = useStore((state) => state.getNotify);
//   const getNC = useStore((state) => state.getNC);
//   const noticeCount = useStore((state) => state.noticeCount);
//   const setQuiver = useStore((state) => state.setQuiver);
//   const setPosts = useStore((state) => state.setPosts);
//   const setCliques = useStore((state) => state.setCliques);
//   const openComment = useStore((state) => state.openComment);
//   const directMessages = useStore((state) => state.directMessages);
//   const posts = useStore((state) => state.posts);
//   const UnreadMessages = useStore((state) => state.UnreadMessages);
//   const setUnreadMessages = useStore((state) => state.setUnreadMessages);

//   useEffect(() => {
//     // getNotify();
//     // getNC();
//     // setPosts();
//      (UnreadMessages.length, "all contains");
//     setQuiver();
//     // navigation.addListener("focus", () => {
//     //   setPosts();
//     //   setUnreadMessages();
//     // });
//     // setPosts();
//     // setTimeout(() => {
//     //   setUnreadMessages();
//     // }, 5000);
//   });
//   return (
//     <Box flex={1} bg="brand.100">
//       <RootStack.Navigator>
//         {loading ? (
//           <>
//             <RootStack.Screen
//               options={{ headerShown: false }}
//               name="Example"
//               component={Example}
//             />
//             <RootStack.Screen
//               options={{ headerShown: false }}
//               name="Callpage"
//               component={CallPage}
//               initialParams={{ user: user }}
//             />
//             <RootStack.Screen
//               options={{ headerShown: false }}
//               name="personalcall"
//               component={Personal}
//             />
//             <RootStack.Screen
//               options={{ headerShown: false }}
//               name="brainstorm"
//               component={BrainstormArena}
//             />
//             <RootStack.Screen
//               name="UserProfile"
//               component={UserProfile}
//               options={{
//                 title: "Back",
//                 headerStyle: {
//                   backgroundColor: colors.sec,
//                 },
//                 headerTintColor: "#fff",
//                 headerTitleStyle: {
//                   fontWeight: "200",
//                 },
//               }}
//             />
//             <RootStack.Screen
//               name="Postpage"
//               component={PostModals}
//               options={{
//                 title: "Post",
//                 headerStyle: {
//                   backgroundColor: colors.sec,
//                 },
//                 headerTintColor: "#fff",
//                 headerTitleStyle: {
//                   fontWeight: "200",
//                 },
//               }}
//             />
//             <RootStack.Screen
//               name="Comments"
//               component={CommentPage}
//               options={{
//                 title: "Post",
//                 headerStyle: {
//                   backgroundColor: colors.sec,
//                 },
//                 headerTintColor: "#fff",
//                 headerTitleStyle: {
//                   fontWeight: "200",
//                 },
//                 headerShown: false,
//                 presentation: "modal",
//               }}
//             />
//             <RootStack.Screen
//               name="PhotosRender"
//               component={PhotosRender}
//               options={{
//                 title: "Post",
//                 headerStyle: {
//                   backgroundColor: colors.sec,
//                 },
//                 headerTintColor: "#fff",
//                 headerTitleStyle: {
//                   fontWeight: "200",
//                 },
//                 headerShown: false,
//                 presentation: "modal",
//               }}
//             />
//             <RootStack.Screen
//               name="EditProfile"
//               component={EditProfile}
//               options={{
//                 title: "Post",
//                 headerStyle: {
//                   backgroundColor: colors.sec,
//                 },
//                 headerTintColor: "#fff",
//                 headerTitleStyle: {
//                   fontWeight: "200",
//                 },
//                 headerShown: false,
//                 presentation: "modal",
//               }}
//             />
//             <RootStack.Screen
//               name="DirectMessage"
//               component={DirectMessage}
//               options={{
//                 headerStyle: {
//                   backgroundColor: colors.sec,
//                 },
//                 headerTitleAlign: "center",
//                 headerTintColor: "#fff",
//                 headerTitleStyle: {
//                   fontWeight: "200",
//                 },
//                 headerShown: true,
//                 presentation: "modal",
//               }}
//             />
//           </>
//         ) : (
//           <RootStack.Screen
//             name="Loading"
//             component={Loading}
//             options={{
//               headerStyle: {
//                 backgroundColor: colors.sec,
//               },
//               headerTintColor: "#fff",
//               headerTitleStyle: {
//                 fontWeight: "200",
//               },
//               headerShown: false,
//               presentation: "modal",
//             }}
//           />
//         )}
//       </RootStack.Navigator>
//     </Box>
//   );
// }
// export default Example;
