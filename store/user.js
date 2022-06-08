import create from "zustand";

import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  push,
  onDisconnect,
  set,
  serverTimestamp,
  get,
  child,
  orderByChild,
  query,
} from "firebase/database";
let use;
const getUsers = () => {
  let data;
  let check = [];
  const dbRef = getDatabase();
  const reff = ref(dbRef, `users`);

  onValue(reff, (snapshot) => {
    const val = snapshot.val();

    for (const key in val) {
      check.push({ id: key, info: val[key] });
    }
    // console.log("check", check);
    data = check;
  });

  return data;
};

const getNotice = () => {
  let data;
  let check = [];
  const dbRef = getDatabase();
  const reff = ref(dbRef, `notifications`, getAuth().currentUser.uid);
  const ordered = query(reff, orderByChild("time"));
  onValue(ordered, (snapshot) => {
    const val = snapshot.val();

    for (const key in val) {
      check.push({ id: key, info: val[key] });
    }

    data = check;
    console.log("data", data);
  });

  return data;
};

const connect = async () => {
  const db = getDatabase();
  var myConnectionsRef = await ref(
    db,
    `connection/${getAuth().currentUser.uid}`
  );
  let on;
  // stores the timestamp of my last disconnect (the last time I was seen online)
  var lastOnlineRef = await ref(
    db,
    `connection/${getAuth().currentUser.uid}/lastOnline`
  );

  var connectedRef = await ref(db, ".info/connected");
  onValue(connectedRef, (snap) => {
    if (snap.val() === true) {
      // We're connected (or reconnected)! Do anything here that should happen only if online (or on reconnect)
      const con = push(myConnectionsRef);

      // When I disconnect, remove this device
      onDisconnect(con).remove();

      // Add this device to my connections list
      // this value could contain info about the device or a timestamp too
      set(con, true);

      // When I disconnect, update the last time I was seen online
      onDisconnect(lastOnlineRef).set(serverTimestamp());
      console.log("connected");

      on = true;
    } else {
      console.log("not connected");
      on = false;
    }
  });
  return on;
};
getUsers();
connect();
getNotice();
const useStore = create((set, get) => ({
  online: false,
  isOnline: (bool) => set((state) => ({ online: bool })),
  quiver:
    "https://firebasestorage.googleapis.com/v0/b/ws-quiver.appspot.com/o/quiver%2Fadaptive-icon.png?alt=media&token=2973829f-a320-4e46-be96-0247c966d601",
  users: [],
  user: getAuth().currentUser,
  toast: "",
  notify: [],
  getNotify: (e) => set((state) => ({ notify: getNotice() })),
  checkuser: () => set((state) => ({ user: getAuth().currentUser })),
  isUsers: (e) => set((state) => ({ users: getUsers() })),
  clearToast: () => set(() => ({ toast: "" })),
  toasted: (toast) => set((state) => ({ toast: toast })),
}));

export default useStore;
