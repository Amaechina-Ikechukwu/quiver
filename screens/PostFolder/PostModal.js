import {
  Box,
  Flex,
  HStack,
  PresenceTransition,
  Text,
  useSafeArea,
  ZStack,
  Modal,
  Pressable,
  TextArea,
  Center,
  KeyboardAvoidingView,
  ScrollView,
  Image,
  VStack,
} from "native-base";
import colors from "../../colors";
import React, { useState, useEffect } from "react";
import { Ionicons, SimpleLineIcons } from "@expo/vector-icons";
import { Link, useNavigate } from "react-router-native";
import { Platform, TextInput } from "react-native";
import { getAuth } from "firebase/auth";
import { Camera, CameraType } from "expo-camera";
import Pressing from "../../constants/Pressing";
import {
  getStorage,
  getDownloadURL,
  ref as storageReference,
  uploadBytesResumable,
} from "firebase/storage";
import {
  serverTimestamp,
  getDatabase,
  ref,
  set,
  onValue,
} from "firebase/database";
import CText from "../../constants/Text";
import useStore from "../../store/user";
import * as ImagePicker from "expo-image-picker";
import {
  doc,
  getDocs,
  getFirestore,
  collection,
  onSnapshot,
  query,
  getDoc,
  setDoc,
} from "firebase/firestore";
import { app } from "../../Firebase";

function PostModals({ navigation }) {
  const uploadData = {
    caption: "",
    Imageurl: "",
    fileURI: Array,
    showImage: false,
  };
  const [showModal, setShowModal] = useState(false);
  const [toUpload, setUpload] = useState(uploadData);
  const [error, setErrorr] = useState(String);
  const [hasPermission, setHasPermission] = useState(null);
  const [ctype, setCType] = useState(CameraType.back);
  const [load, setLoad] = useState("POST");

  const createAlert = useStore((state) => state.setAlert);
  const setPosts = useStore((state) => state.setPosts);

  const cam = async () => {
    const { status } = await Camera.requestCameraPermissionsAsync();
    setHasPermission(status === "granted");
  };

  const safeAreaProps = useSafeArea({
    safeAreaTop: true,
    pt: 0,
  });

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
    setUpload({ ...toUpload, fileURI: pickerResult, showImage: true });
  };
  //to use later

  const uploadImage = async () => {
    const storage = getStorage();
    const storageRef = storageReference(
      storage,
      `posts/${getAuth().currentUser.uid}/  ${Math.random()
        .toString(36)
        .substring(2, 9)}quiver.${toUpload.fileURI.uri.substr(
        toUpload.fileURI.uri.length - 3
      )}`
    );
    const response = await fetch(toUpload.fileURI.uri);

    const blob = await response.blob();
    const metadata = toUpload.fileURI;
    // [START storage_monitor_upload]
    var uploadTask = uploadBytesResumable(storageRef, blob, metadata);
    setLoad("Uploading");
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
            setLoad("RETRY");

            // navigation.navigate("Postpage");
            break;
          case "storage/canceled":
            // User canceled the upload
            setLoad("RETRY");
            // navigation.navigate("Postpage");

            break;

          // ...

          case "storage/unknown":
            // Unknown error occurred, inspect error.serverResponse
            setLoad("Unknown error occurred, inspect error.serverResponse");
            // navigation.navigate("Postpage");

            break;
          default:
            setLoad("Retry");
        }
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...

        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUpload({ Imageurl: downloadURL });
          navigation.navigate("PostPage");
          submitToPost(downloadURL);
        });
      }
    );
  };

  // Add a new document in collection "cities"

  const required = (e, downloadURL) => {
    if (pName === "") {
      setErrorr("please enter product name field");
    } else if (price === "") {
      setErrorr("Please check the price field");
    } else if (price.length >= 8) {
      setErrorr("Please, the price shouldn't be greater than 8");
    } else if (isNaN(price)) {
      setErrorr("Please, the price field is not a number");
    } else if (descrip === "") {
      setErrorr("Please fill the descrip field");
    } else if (catergory === "") {
      setErrorr("Please fill the catergory field");
    } else if (stock === "") {
      setErrorr("Please check the stock field");
    } else if (isNaN(stock)) {
      setErrorr("Please, the stock field is not a number");
    } else if (stock.length >= 6) {
      setErrorr("Please,the stock field shouldn't be greater than 6");
    } else if (image === "") {
      setErrorr("select an image field");
    } else if (cur === "") {
      setErrorr("select a currency ");
    } else if (discount === "") {
      setErrorr("Please check the discount field");
    } else if (discount.length >= 3) {
      setErrorr("Please, the discount field should be less than 100");
    } else if (isNaN(discount)) {
      setErrorr("Please, the discount field should be a number");
    } else {
      setErrorr("");
      setCurr(true);

      uploadImage(e);
    }
  };

  const change = (e) => {
    setUpload({ ...toUpload, caption: e });
  };

  const UploadToProfile = (downloadURL) => {
    const auth = getAuth();
    const db = getDatabase();
    set(
      ref(
        db,
        "users/" +
          auth.currentUser.uid +
          `/posts/${Math.random().toString(36).substring(2, 17)}`
      ),
      {
        caption: toUpload.caption,
        photoURL: downloadURL,
        time: serverTimestamp(),
      }
    )
      .then(() => {
        // Profile updated!
        createAlert("Post uploaded");
        // setPosts();
      })
      .catch((error) => {
        //  (error);
        createAlert("An error occured");
        // setErrorr("error, please re-enter the fields and try again");
        navigation.navigate("Postpage");
      });
  };

  const submitToPost = (downloadURL) => {
    const auth = getAuth();
    const db = getDatabase();
    set(ref(db, `posts/${Math.random().toString(36).substring(2, 17)}`), {
      caption: toUpload.caption,
      photoURL: downloadURL,
      time: serverTimestamp(),
      uid: auth.currentUser.uid,
    })
      .then(() => {
        // Profile updated!
        createAlert("Post uploaded");
        //  ("done");
        // setErrorr("");
      })
      .catch((error) => {
        //  (error);
        // setErrorr("error, please re-enter the fields and try again");
      });
  };

  const sumbitToFirestore = (downloadURL) => {
    const auth = getAuth();
    const db = getFirestore();
    setDoc(doc(db, `posts/${Math.random().toString(36).substring(2, 17)}`), {
      caption: toUpload.caption,
      photoURL: downloadURL,
      time: serverTimestamp(),
      uid: auth.currentUser.uid,
    })
      .then(() => {
        // Profile updated!
        //  ("done");
        // setErrorr("");
      })
      .catch((error) => {
        //  (error);
        // setErrorr("error, please re-enter the fields and try again");
      });
  };

  // useEffect(() => {
  //   return () => {};
  // });
  try {
    return (
      <Box
        flex={1}
        bg="brand.100"
        alignItems="center"
        justifyContent={
          toUpload.showImage == true || toUpload.caption.length !== 0
            ? "flex-start"
            : "center"
        }
      >
        <KeyboardAvoidingView w="full">
          <VStack w="full" space={2}>
            <Center
              w={"full"}
              justifyContent="space-between"
              alignItems="center"
            >
              <Box mb={3} w={"full"} color="brand.800" alignItems="center">
                <VStack
                  w={"90%"}
                  space={2}
                  justifyContent="space-between"
                  alignItems="center"
                >
                  {toUpload.showImage == true ? (
                    <Box w={"100%"}>
                      <Image
                        resizeMode="contain"
                        source={{
                          uri: toUpload.fileURI.uri,
                        }}
                        alt="Alternate Text"
                        style={{ aspectRatio: 1 / 1 }}
                      />
                    </Box>
                  ) : (
                    <Box />
                  )}

                  <Center>
                    <Pressing
                      click={() => openImagePickerAsync()}
                      text={"Choose a photo"}
                      bg="brand.400"
                      w="50%"
                    />
                  </Center>
                </VStack>
              </Box>

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
                value={toUpload.caption}
                onChangeText={change}
                placeholder="Add caption"
                placeholderTextColor={"rgba(255,255,255,0.6)"}
              />
            </Center>
            {toUpload.showImage == true && toUpload.caption.length !== 0 ? (
              <Center w="full">
                <Pressing
                  click={() => uploadImage()}
                  text={load}
                  bg="brand.700"
                  w="70%"
                  tw="lg"
                />
              </Center>
            ) : null}
          </VStack>
        </KeyboardAvoidingView>
      </Box>
    );
  } catch (e) {
    e;
    return (
      <Box flex={1} bg="brand.100">
        <Box
          h="full"
          bg="brand.400"
          justifyContent="center"
          alignItems={"center"}
          p={3}
        >
          <Box h="full">
            <CText style={{ opacity: 0.4 }} text={"A little Error"} size="lg" />
          </Box>
        </Box>
      </Box>
    );
  }
}

const styles = {
  top: {
    marginBottom: "auto",
    marginTop: 0,
  },
  bottom: {
    marginBottom: 2,
    marginTop: "auto",
    backgroundColor: "brand.200",
    border: "none",
    borderRadius: 10,
  },
  left: {
    marginLeft: 0,
    marginRight: "auto",
  },
  right: {
    marginLeft: "auto",
    marginRight: 0,
    backgroundColor: "brand.800",
  },
  center: {
    backgroundColor: "brand.400",
    color: "brand.800",
  },
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

export default PostModals;
