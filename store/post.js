// import create from "zustand";

// import { onAuthStateChanged, getAuth } from "firebase/auth";
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
//   orderByChild,
//   query,
//   orderByValue,
//   onChildAdded,
// } from "firebase/database";
// import useStore from "./user";

// // const setPosts = useStore((state) => state.setPosts);
// // const getLikes = useStore((state) => state.getLikes);

// const AppendLike = () => {
//   const likes = useStore((state) => state.likes);
//   const posts = useStore((state) => state.posts);
//   let newPost = [];
//   const likeIdArray = likes.map((u) => {
//     return u.likeId;
//   });
//   const likeInfoArray = likes.map((u) => {
//     return u.likeInfo;
//   });
//   for (var i = 0; i < posts.length; i++) {
//     if (posts[i].info.uid.includes(inQuiver)) {
//       newPost.push({
//         by: posts[i].by,
//         like: likeIdArray.includes(post[i].id) ? true : false,
//         isMe: likesInfoArray.includes(getAuth().currentUser.uid) ? true : false,
//         id: posts[i].id,
//         info: posts[i].info,
//         photo: posts[i].photo,
//       });
//     }
//   }
//   return newPost;
// };

// const useNewStore = create((set, get) => ({
//   online: false,
//   isOnline: (bool) => set((state) => ({ online: bool })),
//   quiver:
//     "https://firebasestorage.googleapis.com/v0/b/ws-quiver.appspot.com/o/quiver%2Fadaptive-icon.png?alt=media&token=2973829f-a320-4e46-be96-0247c966d601",
//   users: [],
//   newPosts: [],
//   // setCliques: (e) => set((state) => getCliques()),

//   getNewPosts: () => set(() => ({ newPosts: AppendLike() })),
// }));

// export default useNewStore;
