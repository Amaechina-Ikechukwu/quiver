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
  orderByValue,
  onChildAdded,
} from "firebase/database";

const MeAsAUser = async () => {
  const currentUser = await getAuth().currentUser.uid;
  return currentUser;
};
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
  const reff = ref(dbRef, `inQuiver`); //retrieve posts
  const ordered = query(reff); //orders by time
  onChildAdded(ordered, async (snapshot) => {
    if (snapshot.key == getAuth().currentUser.uid) {
      check.push({ id: snapshot.val() });
      console.log(snapshot.val(), "clique val");
    }
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
  const ordered = query(reff, orderByValue("time")); //orders by time
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
            if (val[key].likes[item].from == getAuth().currentUser.uid) {
              return val[key].likes[item].from;
            }
          }
        };
        // console.log(checkHsaLiked());

        if (
          val[key].uid.includes(
            cliques.map((c) => {
              return c.id;
            })
          ) &&
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
        }
        // else if (val[key].uid == getAuth().currentUser.uid) {
        //   check.push({
        //     id: key,
        //     info: val[key],
        //     by: getName(vuid),
        //     photo: getPhoto(),
        //     hasLike: checkHasLiked(),
        //     likeKey: getHasLikedkey(),
        //   });
        // }
        // else {
        //   console.log("nill");
        // }
      }
      const ids = check.map((o) => o.id);
      filtered = check.filter(({ id }, index) => !ids.includes(id, index + 1));
      filtered.map((x) => {
        console.log("from filtered", x);
      });
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

const cliquesArray = () =>
  getCliques().map((c) => {
    return c.id;
  });

const usersArray = () =>
  getUsers().map((c) => {
    return c;
  });

const getAutoPosts = () => {
  let data = [];
  let check = [];
  let filtered = [];
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();
  const reff = ref(dbRef, `posts/`); //retrieve posts
  const ordered = query(reff, orderByValue("time")); //orders by time
  onChildAdded(reff, async (snapshot) => {
    // const val = await snapshot.val();
    // console.log(val);
    try {
      //need to check if the current user belongs to a clique
      // snapshot.forEach((key) => {
      const vuid = await snapshot.val().uid;
      const value = await snapshot.val();

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
        const reff = ref(dbRef, `likes/${snapshot.key}`); //retrieve posts
        const ordered = query(reff); //orders by time
        onChildAdded(ordered, async (snapshot) => {
          const val = await snapshot.val().from;
          return val;
        });
        // for (const item in value.likes) {
        //   if (value.likes[item].from == getAuth().currentUser.uid) {
        //     return true;
        //   } else {
        //     return false;
        //   }
        // }
      };
      const getHasLikedkey = () => {
        for (const item in value.likes) {
          if (value.likes[item].from == getAuth().currentUser.uid) {
            return value.likes[item].from;
          }
        }
      };
      data.push({
        id: snapshot.key,
        info: snapshot.val(),
        by: getName(vuid),
        photo: getPhoto(),
        hasLike: checkHasLiked(),
        likeKey: getHasLikedkey(),
      });
    } catch (e) {
      console.log(e);
    }
    // try {
    //   for (var i = 0; i < data.length; i++) {
    //     console.log("from newData", data[i]);
    //   }
    // } catch (e) {
    //   console.log(e, "from data error");
    // }
  });

  return data;
};

const searchLikes = () => {
  let newData = [];
  // try {
  //   console.log("from appenddata", key);
  // } catch (e) {
  //   console.log(e);
  // }
  const dbRef = getDatabase();
  const reff = ref(dbRef, `likes`); //retrieve posts
  const ordered = query(reff); //orders by time
  onChildAdded(ordered, async (snapshot) => {
    const val = await snapshot.val().from;

    // console.log({
    //   likeInfo: val,
    //   likeId: snapshot.key,
    // });
    newData.push({
      likeInfo: val,
      likeId: snapshot.key,
    });
  });
  return newData;
};

const sortPost = (data) => {
  const newData = data.sort((x, y) => {
    return x.info.time - y.info.time;
  });
  try {
    for (var i = 0; i < newData.length; i++) {
      console.log("from newData", newData[i]);
    }
  } catch (e) {
    console.log(e);
  }

  return newData;
};

const GetLiked = (postId) => {
  console.log(postId);
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();
  let bool;
  const reff = ref(dbRef, `likes/${postId}`); //retrieve posts
  const ordered = query(reff, orderByValue("time")); //orders by time
  onChildAdded(ordered, async (snapshot) => {
    const val = await snapshot.val().from;
    if (val == MeAsAUser()) {
      console.log(postId);
      return val;
    }
  });
};

const AppendLike = () => {
  posts = getAutoPosts();
  for (var i = 0; i < posts.length; i++) {
    console.log("from posts", posts[i]);
  }
  let newPost = [];
  const likeIdArray = searchLikes().map((u) => {
    return u.likeId;
  });
  const likeInfoArray = searchLikes().map((u) => {
    return u.likeInfo;
  });
  for (var i = 0; i < posts.length; i++) {
    if (posts[i].info.uid.includes(inQuiver)) {
      newPost.push({
        by: posts[i].by,
        like: likeIdArray.includes(post[i].id) ? true : false,
        isMe: likeInfoArray.includes(getAuth().currentUser.uid) ? true : false,
        id: posts[i].id,
        info: posts[i].info,
        photo: posts[i].photo,
      });
    }
  }
  return newPost;
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
  inQuiver: [],
  likes: [],
  // setCliques: (e) => set((state) => getCliques()),
  getNC: (e) => set((state) => ({ noticeCount: getNoticeCount() })),
  getNotify: (e) => set((state) => ({ notify: getNotice() })),
  setPosts: (e) => set((state) => ({ posts: getAutoPosts() })),
  checkuser: () => set((state) => ({ user: getAuth().currentUser })),
  isUsers: (e) => set((state) => ({ users: getUsers() })),
  clearToast: () => set(() => ({ toast: "" })),
  toasted: (toast) => set((state) => ({ toast: toast })),
  clearAlert: () => set(() => ({ alert: "" })),
  setAlert: (alert) => set((state) => ({ alert: alert })),
  setQuiver: () => set(() => ({ inQuiver: cliquesArray() })),
  getLikes: () => set(() => ({ likes: searchLikes() })),
}));

export default useStore;
