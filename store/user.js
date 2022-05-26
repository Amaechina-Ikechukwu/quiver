import create from "zustand";

import { onAuthStateChanged, getAuth } from "firebase/auth";

const useStore = create((set, get) => ({
  user: getAuth().currentUser,
  checkuser: () => set((state) => ({ user: getAuth().currentUser })),
}));

export default useStore;
