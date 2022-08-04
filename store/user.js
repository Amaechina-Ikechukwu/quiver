import create from "zustand";

import { onAuthStateChanged, getAuth } from "firebase/auth";
import {
  getPostbase,
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
  onChildChanged,
  limitToLast,
  getDatabase,
} from "firebase/database";
import { app } from "../Firebase";

const getSpecifyUser = (uid) => {
  let data;
  let check = [];
  const dbRef = getDatabase();
  const reff = ref(dbRef, `users`);

  onChildAdded(reff, async (snapshot) => {
    const val = snapshot.val();
    if (snapshot.key == uid) {
      check.push({ id: snapshot.key, info: val });
    }
  });

  return check;
};

const gethasCliques = () => {
  //getFollowing
  let data;
  let check = [];
  const users = getUsers();
  const dbRef = getDatabase();

  const reff = ref(dbRef, `inQuiver/`); //retrieve posts
  const ordered = query(reff); //orders by time
  onChildAdded(reff, async (snapshot) => {
    const vuid = snapshot.val().currentUser;
    const user = getAuth().currentUser;
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
    if (
      snapshot.val().followedBy == user.uid &&
      snapshot.val().currentUser !== user.uid
    ) {
      check.push({
        id: snapshot.val().currentUser,
        name: getName(),
        photo: getPhoto(),
      });
    }

    //  (snapshot.val(), "clique val");
  });

  return check;
};

const whichCliques = (id) => {
  //anotheruserFollowing
  let data;
  let check = [];
  const dbRef = getDatabase();
  const reff = ref(dbRef, `inQuiver`); //retrieve posts
  const ordered = query(reff); //orders by time
  onChildAdded(ordered, async (snapshot) => {
    if (snapshot.val().followedBy == id) {
      check.push({ id: snapshot.val() });
      //  (snapshot.val(), "clique val");
    }
  });

  return check;
};

const hasCliques = (id) => {
  //another user followers
  let data;
  let check = [];
  const dbRef = getDatabase();
  const reff = ref(dbRef, `inQuiver/`); //retrieve posts
  const ordered = query(reff); //orders by time
  onChildAdded(ordered, async (snapshot) => {
    if (snapshot.val().currentUser == id && snapshot.val().followedBy !== id) {
      check.push({ id: snapshot.val().followedBy });
    }

    //  (snapshot.val(), "clique val");
  });

  return check;
};

const getUsers = () => {
  let data;
  let check = [];
  const dbRef = getDatabase();
  const reff = ref(dbRef, `users`);

  onChildAdded(reff, async (snapshot) => {
    const val = snapshot.val();
    const getFollowers = (uid) => {};

    check.push({
      id: snapshot.key,
      info: val,
      followers: hasCliques(snapshot.key).length,
    });
  });

  return check;
};
const MeAsAUser = async () => {
  const repo = await getAuth().currrentUser.uid;
  repo;
  let data = [];
  const dbRef = getDatabase();
  const reff = ref(dbRef, `users/${getAuth().currrentUser.uid}`); //retrieve posts
  const ordered = query(reff, orderByValue("time")); //orders by time
  onChildAdded(reff, async (snapshot) => {
    const val = snapshot.val();
    "data user", val;
    data.push({
      displayName: val.displayName,
      photoURL: val.photoURL,
    });
  });

  return data;
};
const getNotice = () => {
  let data = [];
  let check = [];
  const dbRef = getDatabase();
  const users = getUsers();
  onAuthStateChanged(getAuth(app), (user) => {
    if (user) {
      const reff = ref(dbRef, `notifications/${user.uid}/info`);
      const ordered = query(reff, orderByChild("time"));

      onChildAdded(ordered, async (snapshot) => {
        const getPhoto = () => {
          for (var i = 0; i < users.length; i++) {
            if (users[i].id == snapshot.val().from) {
              return users[i].info.photoURL;
            }
          }
        };
        const getName = () => {
          for (var i = 0; i < users.length; i++) {
            if (users[i].id == snapshot.val().from) {
              return users[i].info.displayName;
            }
          }
        };
        data.push({
          id: snapshot.key,
          info: snapshot.val().info,
          name: getName(),
          photo: getPhoto(),
          postPhoto: snapshot.val().postPhoto,
        });
      });
    }
  });

  // onValue(ordered, (snapshot) => {
  //   const val = snapshot.val();

  //   for (const key in val) {
  //     check.push({ id: key, info: val[key] });
  //   }
  //   data = check;
  // });

  return data;
};
const getCliques = () => {
  // get followers
  getUsers();
  let data;
  let check = [];
  const users = getUsers();
  const dbRef = getDatabase();
  const reff = ref(dbRef, `inQuiver/`); //retrieve posts
  const ordered = query(reff); //orders by time
  onChildAdded(reff, async (snapshot) => {
    const vuid = snapshot;
    if (snapshot.val().currentUser == getAuth().currentUser.uid) {
      const getPhoto = () => {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == snapshot.val().followedBy) {
            return users[i].info.photoURL;
          }
        }
      };
      const getName = () => {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == snapshot.val().followedBy) {
            return users[i].info.displayName;
          }
        }
      };
      if (
        snapshot.val().currentUser == getAuth().currentUser.uid &&
        snapshot.val().followedBy !== getAuth().currentUser.uid
      ) {
        check.push({
          id: snapshot.val().followedBy,
          name: getName(),

          photo: getPhoto(),
        });
      }
    }
    //  (snapshot.val(), "clique val");
  });

  return check;
};
// getCliques();
// MeAsAUser();
const getAutoPosts = () => {
  gethasCliques();
  let data = [];
  let check = [];
  let filtered = [];
  let Qid = [];
  const dbRef = getDatabase();
  const cliques = gethasCliques();
  const users = getUsers();
  cliques.map((q) => {
    Qid.push(q.id);
  });
  Qid;
  const reff = ref(dbRef, `posts/`); //retrieve posts
  const ordered = query(reff, orderByChild("time")); //orders by time
  onChildAdded(ordered, async (snapshot) => {
    // const val = await snapshot.val();
    //  (val);
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

      if (
        Qid.includes(snapshot.val().uid) ||
        snapshot.val().uid == getAuth().currentUser.uid
      ) {
        check.unshift({
          id: snapshot.key,
          info: snapshot.val(),
          by: getName(vuid),
          photo: getPhoto(),
        });
      }
    } catch (e) {
      e;
    }

    // try {
    //   for (var i = 0; i < data.length; i++) {
    //      ("from newdata", data[i]);
    //   }
    // } catch (e) {
    //    (e, "from data error");
    // }
  });
  // onChildChanged(ordered, async (snapshot) => {
  //   // const val = await snapshot.val();
  //   //  (val);
  //   try {
  //     //need to check if the current user belongs to a clique
  //     // snapshot.forEach((key) => {
  //     const vuid = await snapshot.val().uid;
  //     const value = await snapshot.val();

  //     const getPhoto = () => {
  //       for (var i = 0; i < users.length; i++) {
  //         if (users[i].id == vuid) {
  //           return users[i].info.photoURL;
  //         }
  //       }
  //     };
  //     const getName = () => {
  //       for (var i = 0; i < users.length; i++) {
  //         if (users[i].id == vuid) {
  //           return users[i].info.displayName;
  //         }
  //       }
  //     };

  //     if (Qid.includes(snapshot.val().uid)) {
  //       check.unshift({
  //         id: snapshot.key,
  //         info: snapshot.val(),
  //         by: getName(vuid),
  //         photo: getPhoto(),
  //       });
  //     }
  //   } catch (e) {
  //      (e);
  //   }
  // });
  // data = check.sort((x, y) => {
  //   return y.info.time - x.info.time;
  // });
  // try {
  //   for (var i = 0; i < check.length; i++) {
  //      ("from newdata", check[i]);
  //   }
  // } catch (e) {
  //    (e, "fromcheck error");
  // }

  return check;
};

const currentUserPost = () => {
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
    //  (val);
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
      if (vuid == getAuth().currentUser.uid) {
        data.push({
          id: snapshot.key,
          info: snapshot.val(),
          by: getAuth().currentUser.name,
          photo: getAuth().currentUser.photoURL,
        });
      }
    } catch (e) {
      e;
    }
    // try {
    //   for (var i = 0; i < data.length; i++) {
    //      ("from newData", data[i].id);
    //   }
    // } catch (e) {
    //    (e, "from data error");
    // }
  });

  return data;
};

const searchedUserPost = (uid) => {
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
    //  (val);
    try {
      //need to check if the current user belongs to a clique
      // snapshot.forEach((key) => {
      const vuid = await snapshot.val().uid;
      const value = await snapshot.val();

      const getPhoto = (uid) => {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == uid) {
            return users[i].info.photoURL;
          }
        }
      };
      const getName = (uid) => {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == uid) {
            return users[i].info.displayName;
          }
        }
      };
      if (vuid == uid) {
        data.push({
          id: snapshot.key,
          info: snapshot.val(),
          by: getName(uid),
          photo: getPhoto(uid),
        });
      }
    } catch (e) {
      e;
    }
    // try {
    //   for (var i = 0; i < data.length; i++) {
    //      ("from newData", data[i].id);
    //   }
    // } catch (e) {
    //    (e, "from data error");
    // }
  });

  return data;
};
const searchedUserData = (uid) => {
  let data = [];
  let check = [];
  let filtered = [];
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();

  const getPhoto = () => {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id == uid) {
        return users[i].info.photoURL;
      }
    }
  };
  const getName = () => {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id == uid) {
        return users[i].info.displayName;
      }
    }
  };

  data.push({
    id: uid,

    name: getName(),
    photo: getPhoto(),
  });

  return data;
};

const searchLikes = () => {
  let newData = [];
  // try {
  //    ("from appenddata", key);
  // } catch (e) {
  //    (e);
  // }
  const dbRef = getDatabase();
  const reff = ref(dbRef, `likes`); //retrieve posts
  const ordered = query(reff); //orders by time
  onChildAdded(ordered, async (snapshot) => {
    const val = await snapshot.val().from;

    //  ({
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

const getComments = (postid) => {
  postid, "in post comment";
  let data = [];
  let check = [];
  let filtered = [];
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();
  const reff = ref(dbRef, `comments/${postid}`); //retrieve posts
  const ordered = query(reff, orderByValue("time")); //orders by time
  onChildAdded(reff, async (snapshot) => {
    // const val = await snapshot.val();
    //  (val);
    try {
      //need to check if the current user belongs to a clique
      // snapshot.forEach((key) => {
      const vuid = await snapshot.val().by;
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

      data.unshift({
        id: snapshot.key,
        comment: snapshot.val().comment,
        by: getName(vuid),
        photo: getPhoto(),
        time: snapshot.val().time,
        uid: vuid,
      });
    } catch (e) {
      e;
    }
    //  try {
    //    for (var i = 0; i < data.length; i++) {
    //       ("from newData", data[i]);
    //    }
    //  } catch (e) {
    //     (e, "from data error");
    //  }
  });

  // onChildChanged(reff, async (snapshot) => {
  //   // const val = await snapshot.val();
  //   //  (val);
  //   try {
  //     //need to check if the current user belongs to a clique
  //     // snapshot.forEach((key) => {
  //     const vuid = await snapshot.val().by;
  //     const value = await snapshot.val();

  //     const getPhoto = () => {
  //       for (var i = 0; i < users.length; i++) {
  //         if (users[i].id == vuid) {
  //           return users[i].info.photoURL;
  //         }
  //       }
  //     };
  //     const getName = () => {
  //       for (var i = 0; i < users.length; i++) {
  //         if (users[i].id == vuid) {
  //           return users[i].info.displayName;
  //         }
  //       }
  //     };

  //     data.unshift({
  //       id: snapshot.key,
  //       comment: snapshot.val().comment,
  //       by: getName(vuid),
  //       photo: getPhoto(),
  //       time: snapshot.val().time,
  //       uid: vuid,
  //     });
  //   } catch (e) {
  //      (e);
  //   }
  //   //  try {
  //   //    for (var i = 0; i < data.length; i++) {
  //   //       ("from newData", data[i]);
  //   //    }
  //   //  } catch (e) {
  //   //     (e, "from data error");
  //   //  }
  // });

  return data;
};

const getLikes = (postid) => {
  postid, "in post comment";
  let data = [];
  let count = Number;
  let filtered = [];
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();
  const reff = ref(dbRef, `likes/${postid}`); //retrieve posts
  const ordered = query(reff, orderByValue("time")); //orders by time
  onChildAdded(reff, async (snapshot) => {
    // const val = await snapshot.val();
    //  (val);
    try {
      //need to check if the current user belongs to a clique
      // snapshot.forEach((key) => {
      const vuid = await snapshot.val().by;
      const value = await snapshot.val();

      data.push({ value: value });
    } catch (e) {
      e;
    }
    //  try {
    //    for (var i = 0; i < data.length; i++) {
    //       ("from newData", data[i]);
    //    }
    //  } catch (e) {
    //     (e, "from data error");
    //  }
  });

  return data;
};

const getNoticeCount = () => {
  let count = 0;

  const dbRef = getDatabase();
  onAuthStateChanged(getAuth(app), (user) => {
    if (user) {
      const reff = ref(dbRef, `notifications/${user.uid}/info`);
      // const ordered = query(reff, orderByChild("time"));
      onChildAdded(reff, async (snapshot) => {
        const val = snapshot.val().isRead;

        if (val == false) {
          ++count;
        }
      });
    }
  });
  // onValue(ordered, (snapshot) => {
  //   const val = snapshot.val();

  // for (const key in val) {
  //   if (val[key].isRead === false) {
  //     count++;
  //   }
  // }
  // });

  return count;
};

const connect = async (uid) => {
  const db = getDatabase();
  var myConnectionsRef = await ref(db, `connection/${uid}`);
  let on;
  // stores the timestamp of my last disconnect (the last time I was seen online)
  var lastOnlineRef = await ref(db, `connection/${uid}/lastOnline`);

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

      on = true;
    } else {
      on = false;
    }
  });

  return on;
};

const getDirectMessage = (uid) => {
  getCliques();
  let data = [];
  let check = [];
  let filtered = [];
  let Qid = [];
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();

  Qid;
  const reff = ref(dbRef, `messages/${getAuth().currentUser.uid}/${uid}`); //retrieve posts
  const ordered = query(reff, orderByChild("time"), limitToLast(20)); //orders by time
  onChildAdded(ordered, async (snapshot) => {
    // const val = await snapshot.val();
    //  (val);
    //  ("from getdmUsers", snapshot.key);
    try {
      //need to check if the current user belongs to a clique
      // snapshot.forEach((key) => {

      const vuid = await snapshot.val().uid;
      const value = await snapshot.val();

      const getPhoto = () => {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == uid) {
            return users[i].info.photoURL;
          }
        }
      };
      const getName = () => {
        for (var i = 0; i < users.length; i++) {
          if (users[i].id == uid) {
            return users[i].info.displayName;
          }
        }
      };

      data.unshift({
        id: snapshot.key,
        message: snapshot.val().message,
        // by: getName(),
        time: snapshot.val().time,
        // photo: getPhoto(),
        from: snapshot.val().by,
        isRead: snapshot.val().isRead,
      });
    } catch (e) {
      e;
    }

    // try {
    //   for (var i = 0; i < check.length; i++) {
    //      ("from newcheck", check[i]);
    //   }
    // } catch (e) {
    //    (e, "from data error");
    // }
  });
  // onChildChanged(reff, async (snapshot) => {
  //   // const val = await snapshot.val();
  //   //  (val);
  //   try {
  //     //need to check if the current user belongs to a clique
  //     // snapshot.forEach((key) => {
  //     if (snapshot.key == uid) {
  //       const vuid = await snapshot.val().uid;
  //       const value = await snapshot.val();

  //       const getPhoto = () => {
  //         for (var i = 0; i < users.length; i++) {
  //           if (users[i].id == uid) {
  //             return users[i].info.photoURL;
  //           }
  //         }
  //       };
  //       const getName = () => {
  //         for (var i = 0; i < users.length; i++) {
  //           if (users[i].id == uid) {
  //             return users[i].info.displayName;
  //           }
  //         }
  //       };

  //       for (const key in snapshot.val()) {
  //         check.push({
  //           id: key,
  //           message: snapshot.val()[key].message,
  //           by: getName(),
  //           photo: getPhoto(),
  //         });
  //       }
  //     }
  //   } catch (e) {
  //      (e);
  //   }

  //   try {
  //     for (var i = 0; i < check.length; i++) {
  //        ("from newcheck", check[i]);
  //     }
  //   } catch (e) {
  //      (e, "from data error");
  //   }
  // });
  return data;
};

const getChatList = () => {
  getCliques();
  let data = [];
  let check = [];
  let filtered = [];
  let Qid = [];
  let lastMessage;
  let lastTime;
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();

  Qid;
  onAuthStateChanged(getAuth(app), async (user) => {
    const reff = ref(dbRef, `messages/${user.uid}`); //retrieve posts
    const ordered = query(reff, orderByChild("time")); //orders by time
    onChildAdded(reff, async (snapshot) => {
      // const val = await snapshot.val();
      //  (val);
      //  ("from getdmUsers", snapshot.key);
      try {
        //need to check if the current user belongs to a clique
        // snapshot.forEach((key) => {

        const vuid = await snapshot.key;
        const value = await snapshot.val();

        const getPhoto = () => {
          for (var i = 0; i < users.length; i++) {
            if (users[i].id == snapshot.key) {
              return users[i].info.photoURL;
            }
          }
        };
        const getName = () => {
          for (var i = 0; i < users.length; i++) {
            if (users[i].id == snapshot.key) {
              return users[i].info.displayName;
            }
          }
        };

        for (const key in snapshot.val()) {
          data.unshift({
            id: key,
            message: snapshot.val()[key].message,
            by: snapshot.val()[key].by,
            time: snapshot.val()[key].time,
          });
        }

        check.unshift(
          data.sort((x, y) => {
            return y.time - x.time;
          })
        );

        check.forEach((ele) => {
          "message", ele[0].message;
          lastMessage = ele[0].message;
        });
        check.forEach((ele) => {
          lastTime = ele[0].time;
        });

        filtered.unshift({
          id: snapshot.key,
          lastMessage: lastMessage,
          time: lastTime,
          by: getName(),

          photo: getPhoto(),
        });

        // try {
        //   for (var i = 0; i < filtered.length; i++) {
        //      ("from newfiltered", filtered[i]);
        //   }
        // } catch (e) {
        //    (e, "from data error");
        // }
      } catch (e) {
        e;
      }
    });
  });

  return filtered;
};

const getLastMessages = (uid) => {
  getCliques();
  let data = [];
  let check = [];
  let filtered = [];
  let Qid = [];
  let lastMessage;
  let lastTime;
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();

  Qid;
  onAuthStateChanged(getAuth(app), async (user) => {
    const reff = ref(dbRef, `lastmessages/${user.uid}/${uid}`); //retrieve posts
    const ordered = query(reff, orderByChild("time")); //orders by time
    onChildAdded(reff, async (snapshot) => {
      // const val = await snapshot.val();
      //  (val);
      //  ("from getdmUsers", snapshot.key);
      try {
        //need to check if the current user belongs to a clique
        // snapshot.forEach((key) => {

        const vuid = await snapshot.key;
        const value = await snapshot.val();

        filtered.unshift({
          id: snapshot.key,
          message: snapshot.val().message,

          time: snapshot.val().time,
        });

        // try {
        //   for (var i = 0; i < filtered.length; i++) {
        //      ("from newfiltered", filtered[i]);
        //   }
        // } catch (e) {
        //    (e, "from data error");
        // }
      } catch (e) {
        e;
      }
    });
  });

  return filtered;
};

const getTotalUnread = (uid) => {
  getCliques();
  let data = 0;
  let check = [];
  let filtered = [];
  let Qid = [];
  const dbRef = getDatabase();
  const cliques = getCliques();
  const users = getUsers();

  Qid;
  onAuthStateChanged(getAuth(app), (user) => {
    if (user) {
      const reff = ref(dbRef, `messages/${user.uid}`); //retrieve posts
      const ordered = query(reff, orderByChild("time")); //orders by time
      onChildAdded(reff, async (snapshot) => {
        // const val = await snapshot.val();
        //  (val);
        //  ("from getdmUsers", snapshot.key);
        try {
          //need to check if the current user belongs to a clique
          // snapshot.forEach((key) => {

          for (const key in snapshot.val()) {
            if (
              snapshot.val()[key].isRead == false &&
              snapshot.val()[key].by !== user.uid
            ) {
              check.push(key);
            }
          }
        } catch (e) {
          e;
        }

        // try {
        //    (check.length, "user count");
        // } catch (e) {
        //    (e, "from data error");
        // }
      });
    }
  });

  return check;
};

const useStore = create((set, get) => ({
  online: false,
  isOnline: (bool) => set((state) => ({ online: bool })),
  quiver:
    "https://firebasestorage.googleapis.com/v0/b/ws-quiver.appspot.com/o/quiver%2Fadaptive-icon.png?alt=media&token=2973829f-a320-4e46-be96-0247c966d601",
  users: [],
  user: getAuth().currentUser || {
    name: "quiver",
    photoURL:
      "https://firebasestorage.googleapis.com/v0/b/ws-quiver.appspot.com/o/quiver%2Fadaptive-icon.png?alt=media&token=2973829f-a320-4e46-be96-0247c966d601",
  },
  toast: "",
  alert: "",
  notify: [],
  noticeCount: 0,
  posts: [],
  setCliques: getCliques(),
  inQuiver: [],
  inHasQuiver: [],
  likes: [],
  connected: Boolean,
  postComment: [],
  userData: [],
  likesCount: [],
  whoseQuiver: [],
  hasQuiver: [],
  searchedUser: [],
  searchedUserPost: [],
  specifyUser: [],
  openComment: Boolean,
  input: Boolean,
  item: [],
  directMessages: [],
  chatList: [],
  lastMessages: [],
  UnreadMessages: [],
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
  setQuiver: () => set(() => ({ inQuiver: getCliques() })),
  setHasQuiver: () => set(() => ({ inHasQuiver: gethasCliques() })),
  getLikes: () => set(() => ({ likes: searchLikes() })),
  getConnection: (uid) => set(() => ({ connected: connect(uid) })),
  setComment: (postid) => set(() => ({ postComment: getComments(postid) })),
  setLike: (postid) => set(() => ({ likesCount: getLikes(postid) })),
  setUserData: () => set(() => ({ userData: currentUserPost() })),
  setSearchedUserData: (userid) =>
    set(() => ({ searchedUser: searchedUserData(userid) })),
  setSearchedUserPost: (userid) =>
    set(() => ({ searchedUserPost: searchedUserPost(userid) })),
  setWhoseCliques: (userId) =>
    set(() => ({ whoseQuiver: whichCliques(userId) })),
  sethasCliques: (userId) => set(() => ({ hasQuiver: hasCliques(userId) })),
  // setUser: () => set(() => ({ user: MeAsAUser() })),
  setOpenComment: (bool) => set(() => ({ openComment: bool })),
  setInput: (bool) => set(() => ({ input: bool })),
  setItem: (item) => set(() => ({ item: item })),
  setSpecifyUser: (uid) => set(() => ({ specifyUser: getSpecifyUser(uid) })),
  setDirectMessage: (uid) =>
    set(() => ({ directMessages: getDirectMessage(uid) })),
  setLastMessages: (uid) => set(() => ({ lastMessages: getLastMessages(uid) })),
  setChatList: (uid) => set(() => ({ chatList: getChatList() })),
  setUnreadMessages: (uid) => set(() => ({ UnreadMessages: getTotalUnread() })),
}));

export default useStore;
