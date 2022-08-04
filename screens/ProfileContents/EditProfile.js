import React, {
  useState,
  useEffect,
  memo,
  useCallback,
  useRef,
  useMemo,
} from "react";

import {
  Avatar,
  Badge,
  Box,
  Center,
  FavouriteIcon,
  HStack,
  Popover,
  PresenceTransition,
  Pressable,
  Spacer,
  Text,
  VStack,
  KeyboardAvoidingView,
  Modal,
  ZStack,
  Spinner,
} from "native-base";
import {
  View,
  StatusBar,
  FlatList,
  Image,
  SafeAreaView,
  ImageBackground,
  TextInput,
  ScrollView,
  Keyboard,
  Dimensions,
} from "react-native";
import { ToastAndroid } from "react-native";
import useStore from "../../store/user";
import useNewStore from "../../store/post";
import GestureRecognizer, {
  swipeDirections,
} from "react-native-swipe-gestures";
import {
  Ionicons,
  SimpleLineIcons,
  Octicons,
  Foundation,
  AntDesign,
  EvilIcons,
  FontAwesome,
} from "@expo/vector-icons";
import colors from "../../colors";
import CText from "../../constants/Text";
import UploadAlert from "../../constants/UploadAlert";
import moment from "moment";
import IconPress from "../../constants/IconPress";
import {
  getDatabase,
  ref,
  set,
  remove,
  update,
  serverTimestamp,
  onValue,
  push,
  onDisconnect,
} from "firebase/database";
import {
  getStorage,
  getDownloadURL,
  ref as storageReference,
  uploadBytesResumable,
} from "firebase/storage";
import { getAuth, updateProfile } from "firebase/auth";
import IconAction from "../../constants/IconAction";
import Loading from "../Loading";
import { useNavigation } from "@react-navigation/native";
import Pressing from "../../constants/Pressing";
// import ParallaxScrollView from "react-native-parallax-scrollview";
import BottomSheet from "@gorhom/bottom-sheet";
import * as ImagePicker from "expo-image-picker";
import { app } from "../../Firebase";

function EditProfile() {
  const config = {
    velocityThreshold: 0.3,
    directionalOffsetThreshold: 80,
  };
  const navigation = useNavigation();
  const window = Dimensions.get("window");
  const screen = Dimensions.get("screen");
  // const AnimatedCustomScrollView =

  // Animated.createAnimatedComponent(CustomScrollView);

  const bottomSheetRef = useRef(null);

  // variables
  const snapPoints = useMemo(() => ["5%", "25%", "50%", "90%"], []);

  // callbacks
  const handleSheetChanges = useCallback((index) => {
    "handleSheetChanges", index;
  }, []);

  const likesCount = useStore((state) => state.likesCount);

  const uploadData = {
    caption: "",
    Imageurl: "",
    fileURI: Array,
    showImage: false,
  };
  const auth = getAuth().currentUser;

  const [hasPermission, setHasPermission] = useState(null);
  const [displayname, setDisplayname] = useState(auth.displayName);
  const [ImageUri, setImageURI] = useState();
  const [progress, setProgress] = useState(undefined);

  let openImagePickerAsync = async () => {
    let permissionResult =
      await ImagePicker.requestMediaLibraryPermissionsAsync();

    if (permissionResult.granted === false) {
      alert("Permission to access camera roll is required!");
      return;
    }
    let pickerarray = [];
    let pickerResult = await ImagePicker.launchImageLibraryAsync();
    pickerResult.uri.substr(pickerResult.uri.length - 3);
    pickerarray.push(pickerResult);
    setImageURI(pickerResult.uri);
  };
  const quiver = useStore((state) => state.quiver);
  const checkuser = useStore((state) => state.checkuser);
  const createAlert = useStore((state) => state.setAlert);

  const change = (e) => {
    e;
    setDisplayname(e);
  };

  useEffect(() => {
    return () => {};
  });

  const uploadImage = async () => {
    const storage = getStorage();
    const storageRef = storageReference(
      storage,
      `userProfile/${getAuth().currentUser.uid}/  ${Math.random()
        .toString(36)
        .substring(2, 9)}quiver.${ImageUri.substr(ImageUri.length - 3)}`
    );
    const response = await fetch(ImageUri);

    const blob = await response.blob();
    const metadata = ImageUri;
    // [START storage_monitor_upload]
    var uploadTask = uploadBytesResumable(storageRef, blob, metadata);

    // uploadBytes(storageRef, toUpload.fileURI.uri).then((snapshot) => {
    //    ("Uploaded a blob or file!");
    // });

    // Register three observers:
    // 1. 'state_changed' observer, called any time the state changes
    // 2. Error observer, called on failure
    // 3. Completion observer, called on successful completion
    uploadTask.on(
      "state_changed",

      (snapshot) => {
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        "Upload is ", Math.floor(progress), "% done";
        setProgress(Math.floor(progress));
        switch (snapshot.state) {
          case "paused":
            "Upload is paused";
            break;
          case "running":
            "Upload is running";
            break;
        }
      },
      (error) => {
        // A full list of error codes is available at
        // https://firebase.google.com/docs/storage/web/handle-errors
        switch (error.code) {
          case "storage/unauthorized":
            // User doesn't have permission to access the object

            // navigation.navigate("Postpage");
            break;
          case "storage/canceled":
            // User canceled the upload

            // navigation.navigate("Postpage");

            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse

            // navigation.navigate("Postpage");

            break;
          default:
        }
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // updateProfile(downloadURL);

          updateUserProfile(downloadURL);
          "File available at", downloadURL;
        });
      }
    );
  };

  const updateUserProfile = (downloadURL) => {
    const auths = getAuth(app);
    updateProfile(auths.currentUser, {
      displayName: displayname,
      photoURL: downloadURL || auth.photoURL,
    })
      .then(() => {
        // Profile updated!

        updateToUser(downloadURL);

        // ...
      })
      .catch((error) => {
        error;
        // ...
      });
  };

  const updateToUser = (downloadURL) => {
    const auth = getAuth();
    const db = getDatabase();
    set(ref(db, "users/" + auth.currentUser.uid), {
      displayName: displayname,
      photoURL: downloadURL || auth.photoURL,
    })
      .then(() => {
        // Profile updated!
        navigation.goBack();
        navigation.reset({
          index: 1,

          routes: [{ name: "ProfilePage" }],
        });

        createAlert("Profile uploaded");

        checkuser();
      })
      .catch((error) => {
        // An error occurred
        // ...
      });
  };

  // const clickToUpdate = () => {
  //   if (ImageUri == "") {
  //     uploadImage();
  //   } else {
  //     updateWithoutPhoto();
  //   }
  // };

  return (
    <Box bg="brand.100" flex={1} p={2}>
      <VStack space={3}>
        <HStack space={3} alignItems={"center"} justifyContent={"space-evenly"}>
          <ZStack
            w={100}
            h={100}
            alignItems={"center"}
            justifyContent={"center"}
          >
            <Avatar
              size="xl"
              source={{
                uri: ImageUri || auth.photoURL || quiver,
              }}
            />
            {progress !== undefined ? (
              <Avatar bg="rgba(0,0,0,0.5)" size={"xl"}>
                <Spinner size="sm" color="brand.700" />
              </Avatar>
            ) : null}
          </ZStack>

          <Pressing
            click={() => openImagePickerAsync()}
            text={"Choose a photo"}
            bg="brand.400"
            w="50%"
          />
        </HStack>
        <Box alignItems={"center"}>
          <TextInput
            style={{
              height: 50,
              color: colors.textColor,
              width: "90%",
              borderColor: colors.textColor,
              borderWidth: 1,
              borderRadius: 5,
              padding: 5,
              marginTop: 3,
            }}
            value={displayname}
            onChangeText={change}
            placeholder={displayname}
            placeholderTextColor={"rgba(255,255,255,0.6)"}
          />
        </Box>
        <Box>
          <Pressing
            text={"Save"}
            click={
              ImageUri == undefined || ImageUri == null
                ? () => updateUserProfile(auth.photoURL)
                : () => uploadImage()
            }
          />
        </Box>
      </VStack>
    </Box>
  );
}

export default EditProfile;
