"use client";

import React, { useEffect, useState } from "react";
import { useAuth } from "../../useAuth"; // Custom hook for authentication
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebaseConfig"; // Firebase configuration
import "../styles/user.css";
import { Roboto } from "next/font/google";

// Importing Roboto font
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

const UsersPage: React.FC = () => {
  // Access the authenticated user from custom hook
  const { user } = useAuth();
  // State to manage list of users
  const [users, setUsers] = useState<any[]>([]);
  // State to manage loading state
  const [loading, setLoading] = useState(true);
  // State to manage error messages
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      // Function to fetch users from Firestore
      const fetchUsers = async () => {
        try {
          const userCollection = collection(db, "users");
          const userSnapshot = await getDocs(userCollection);
          const userList = userSnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }));
          setUsers(userList); // Update state with fetched users
        } catch (err: any) {
          setError("Failed to fetch users."); // Set error message if fetching fails
        } finally {
          setLoading(false); // Set loading to false after data fetching
        }
      };

      fetchUsers(); // Call the function to fetch users
    } else {
      setLoading(false); // Set loading to false if no user is authenticated
    }
  }, [user]); // Effect runs when `user` changes

  if (!user) {
    return <div>Access Denied</div>; // Show access denied message if no user is authenticated
  }

  return (
    <div className={roboto.className}>
      {" "}
      {/* Apply Roboto font */}
      <div className="table-container">
        <p className="registered-user-text">Registered Users</p>
        {loading && <p>Loading...</p>}{" "}
        {/* Show loading message while data is being fetched */}
        {error && <p style={{ color: "red" }}>{error}</p>}{" "}
        {/* Show error message if there's an error */}
        {!loading && !error && (
          <div className={roboto.className}>
            {users.map((user) => (
              <div key={user.id} className="list">
                <p>Email: {user.email}</p> {/* Display user email */}
                <p>Role: {user.role ? user.role : "Not Assigned"}</p>{" "}
                {/* Display user role or default message */}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersPage;
