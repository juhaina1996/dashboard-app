"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, updateDoc } from "firebase/firestore";
import "../styles/assignrole.css";

const AssignRole: React.FC = () => {
  const [users, setUsers] = useState<any[]>([]); // State to store list of users
  const [currentUser, setCurrentUser] = useState<any>(null); // State to store the currently authenticated user

  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    try {
      // Reference to the "users" collection in Firestore
      const userCollection = collection(db, "users");

      // Fetch all documents from the "users" collection
      const userSnapshot = await getDocs(userCollection);

      // Map over documents and extract data along with document IDs
      const userList = userSnapshot.docs.map((doc) => ({
        id: doc.id, // Document ID
        ...doc.data(), // Document data
      }));

      // Update state with the fetched users
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error); // Log errors if fetching fails
    }
  };

  // Effect to fetch users and set up authentication state listener
  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts

    // Set up an authentication state listener
    const unsubscribe = onAuthStateChanged(getAuth(), (user) => {
      if (user) {
        setCurrentUser(user); // Update currentUser state when a user is authenticated
      }
    });

    // Cleanup function to unsubscribe from authentication listener
    return () => unsubscribe();
  }, []);

  // Function to handle role assignment
  const handleRoleAssign = async (userId: string, newRole: string) => {
    try {
      // Update the user's role in Firestore
      await updateDoc(doc(db, "users", userId), {
        role: newRole,
      });

      console.log(`Assigned role ${newRole} to user ${userId}`); // Log role assignment

      // Update the user's role in the state
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
    } catch (error) {
      console.error("Error assigning role:", error); // Log errors if role assignment fails
    }
  };

  return (
    <div className="table-container">
      <p className="registered-user-text">Assign Role</p>
      {users.map((user) => (
        <div key={user.id} className="main-container">
          <span>{user.email} </span>
          <select
            value={user.role} // Display the current role of the user
            onChange={(e) => handleRoleAssign(user.id, e.target.value)} // Handle role change
          >
            <option value="member">Member</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      ))}
    </div>
  );
};

export default AssignRole;
