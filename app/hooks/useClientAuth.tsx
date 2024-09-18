"use client";

import { useState, useEffect } from "react";
import { auth } from "../../firebaseConfig"; // Import Firebase auth

const useClientAuth = () => {
  // State to track authentication status
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    // Function to handle authentication state changes
    const unsubscribe = auth.onAuthStateChanged((user) => {
      // Update state based on whether a user is authenticated
      setIsAuthenticated(!!user); // Convert user to boolean
    });

    // Clean up subscription on component unmount
    return () => unsubscribe();
  }, []); // Empty dependency array ensures this effect runs only once

  // Return authentication status
  return { isAuthenticated };
};

export default useClientAuth;
