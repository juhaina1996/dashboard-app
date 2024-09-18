import { db } from "../../firebaseConfig";
import { collection, getDocs } from "firebase/firestore";

export const getUsers = async () => {
  // Reference to the "users" collection in Firestore
  const usersCollection = collection(db, "users");

  // Fetch all documents from the "users" collection
  const userSnapshot = await getDocs(usersCollection);

  // Map over the documents and extract data along with document IDs
  const userList = userSnapshot.docs.map((doc) => ({
    id: doc.id, // Document ID
    ...doc.data(), // Document data
  }));

  // Return the list of users
  return userList;
};
