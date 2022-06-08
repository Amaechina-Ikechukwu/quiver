import { getDatabase, ref, child, get, onValue } from "firebase/database";
import useStore from "../user";

let use;
const getUsers = () => {
  const isUsers = useStore((state) => state.isUsers);
  const dbRef = getDatabase();
  const reff = ref(dbRef, `users`);

  onValue(reff, (snapshot) => {
    const data = snapshot.val();
    use = [data];
    isUsers(use);

    return data;
  });
};

export default getUsers;
