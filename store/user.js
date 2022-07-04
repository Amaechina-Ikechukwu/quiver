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

  onValue(reff, async (snapshot) => {
    const val = await snapshot.val();

    for (const key in val) {
      check.push({ id: key, info: val[key] });
    }

    data = check;
  });

  return check;
};

const getCliques = () => {
  let data;
  let check = [];

  const dbRef = getDatabase();
  const reff = ref(dbRef, `inQuiver`);

  onValue(reff, async (snapshot) => {
    const val = await snapshot.val();

    for (const key in val) {
      //check if current user exists as clique to another user
      if (val[key].clique == getAuth().currentUser.uid) {
        check.push({ id: key });
      }
    }

    data = check;
  });

  return check;
};

const getNotice = () => {
  let data;
  let check = [];
  const dbRef = getDatabase();
  const reff = ref(dbRef, `notifications/${getAuth().currentUser.uid}/info`);
  const ordered = query(reff, orderByChild("time"));
  onValue(ordered, (snapshot) => {
    const val = snapshot.val();

    for (const key in val) {
      check.push({ id: key, info: val[key] });
    }
    data = check;
  });

  return data;
};

const getPosts = () => {
  let data = [];
  let check = [];
  let filtered = [];
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();
  const checkUsers = (uid) => {
    let ccc;
    const users = getUsers();
  };
  const reff = ref(dbRef, `posts/`); //retrieve posts
  const ordered = query(reff, orderByChild("time")); //orders by time
  onValue(ordered, async (snapshot) => {
    const val = await snapshot.val();
    try {
      //need to check if the current user belongs to a clique
      for (const key in val) {
        const vuid = val[key].uid;

        const getPhoto = () => {
          for (var i = 0; i < users.length; i++) {
            if (users[i].id == vuid) {
              return users[i].info.photoURL;
            }
          }
        };
        const getName = () => {
          for (var i = 0; i < users.length; i++) {
            if (users[i].id == vuid) {
              return users[i].info.displayName;
            }
          }
        };
        const checkHasLiked = () => {
          for (const item in val[key].likes) {
            if (val[key].likes[item].from == getAuth().currentUser.uid) {
              return true;
            } else {
              return false;
            }
          }
        };
        const getHasLikedkey = () => {
          for (const item in val[key].likes) {
            if (item == getAuth().currentUser.uid) {
              return item;
            }
          }
        };
        // console.log(checkHsaLiked());

        if (
          val[key].uid.includes(
            cliques.map((c) => {
              return c.id;
            })
          ) ||
          val[key].uid.includes(getAuth().currentUser.uid)
        ) {
          check.push({
            id: key,
            info: val[key],
            by: getName(vuid),
            photo: getPhoto(),
            hasLike: checkHasLiked(),
            likeKey: getHasLikedkey(),
          });
        } else {
          console.log("nill");
        }
      }
      // const ids = check.map((o) => o.id);
      // filtered = check.filter(({ id }, index) => !ids.includes(id, index + 1));
      // filtered.map((x) => {
      //   console.log("from filtered", x);
      // });
    } catch (e) {
      console.log(e);
    }
  });
  // const ids = check.map((o) => o.id);
  // filtered.push(check.filter(({ id }, index) => !ids.includes(id, index + 1)));
  // filtered.map((x) => {
  //   console.log("from filtered", x);
  // });
  return check;
};

const checkDuplicated = (check) => {
  const ids = check.map((o) => o.id);
  const filtered = check.filter(
    ({ id }, index) => !ids.includes(id, index + 1)
  );
  filtered.map((x) => {
    console.log("from filtered", x);
  });
  return check;
};

const getNoticeCount = () => {
  let count = 0;

  const dbRef = getDatabase();
  const reff = ref(dbRef, `notifications/${getAuth().currentUser.uid}/info`);
  const ordered = query(reff, orderByChild("time"));
  onValue(ordered, (snapshot) => {
    const val = snapshot.val();

    for (const key in val) {
      if (val[key].isRead === false) {
        count++;
      }
    }
  });

  return count;
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

const useStore = create((set, get) => ({
  online: false,
  isOnline: (bool) => set((state) => ({ online: bool })),
  quiver:
    "https://firebasestorage.googleapis.com/v0/b/ws-quiver.appspot.com/o/quiver%2Fadaptive-icon.png?alt=media&token=2973829f-a320-4e46-be96-0247c966d601",
  users: [],
  user: getAuth().currentUser,
  toast: "",
  alert: "",
  notify: [],
  noticeCount: 0,
  posts: [],
  setCliques: getCliques(),
  // setCliques: (e) => set((state) => getCliques()),
  getNC: (e) => set((state) => ({ noticeCount: getNoticeCount() })),
  getNotify: (e) => set((state) => ({ notify: getNotice() })),
  setPosts: (e) => set((state) => ({ posts: getPosts() })),
  checkuser: () => set((state) => ({ user: getAuth().currentUser })),
  isUsers: (e) => set((state) => ({ users: getUsers() })),
  clearToast: () => set(() => ({ toast: "" })),
  toasted: (toast) => set((state) => ({ toast: toast })),
  clearAlert: () => set(() => ({ alert: "" })),
  setAlert: (alert) => set((state) => ({ alert: alert })),
}));

export default useStore;
