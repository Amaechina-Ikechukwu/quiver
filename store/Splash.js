import create from "zustand";
import { persist } from "zustand/middleware";

const useSplash = create(
  persist(
    (set, get) => ({
      seenSplash: false,
      hasSeenSplash: () =>
        set((state) => set({ seenSplash: true }, console.log("Splash set"))),
    }),
    {
      name: "splash", // unique name
      getStorage: () => sessionStorage, // (optional) by default, 'localStorage' is used
    }
  )
);
export default useSplash;
