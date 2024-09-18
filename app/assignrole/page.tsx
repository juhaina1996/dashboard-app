"use client";

import React, { useEffect, useState } from "react";
import { db } from "../../firebaseConfig";

import {
  collection,
  getDocs,
  doc,
  updateDoc,
  DocumentData,
} from "firebase/firestore";
import "../styles/assignrole.css";

// Define a type for User data
interface User extends DocumentData {
  id: string;
  email: string;
  role: string;
}

const AssignRole: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]); // State to store list of users

  // Function to fetch users from Firestore
  const fetchUsers = async () => {
    try {
      // Reference to the "users" collection in Firestore
      const userCollection = collection(db, "users");

      // Fetch all documents from the "users" collection
      const userSnapshot = await getDocs(userCollection);

      // Map over documents and extract data along with document IDs
      const userList: User[] = userSnapshot.docs.map((doc) => {
        const data = doc.data() as Omit<User, "id">; // Get the user data excluding 'id'
        return {
          id: doc.id, // Document ID
          ...data, // Spread data to include all properties of User
        } as User;
      });

      // Update state with the fetched users
      setUsers(userList);
    } catch (error) {
      console.error("Error fetching users:", error); // Log errors if fetching fails
    }
  };

  // Effect to fetch users and set up authentication state listener
  useEffect(() => {
    fetchUsers(); // Fetch users when the component mounts

    // Cleanup function to unsubscribe from authentication listener
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
