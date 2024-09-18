import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { auth } from "./firebaseConfig";

// Custom hook to manage Firebase authentication state
export const useAuth = () => {
  // State to hold the current user or null if no user is logged in
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    // Subscribe to the Firebase authentication state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      // Update the user state whenever the authentication state changes
      setUser(user);
    });

    // Cleanup function to unsubscribe from the auth listener when the component unmounts
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once when the component mounts

  // Return the current user state
  return { user };
};
