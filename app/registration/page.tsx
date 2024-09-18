"use client";

import React, { useState, useEffect } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../../firebaseConfig";
import { doc, setDoc } from "firebase/firestore";
import InputField from "../components/InputField/InputField";
import Button from "../components/Button/index";
import { useRouter } from "next/navigation"; // Import useRouter hook from Next.js
import "../styles/register.css";
import { FirebaseError } from "firebase/app"; // Import FirebaseError for more specific error handling

const RegistrationPage: React.FC = () => {
  // State to manage email input
  const [email, setEmail] = useState("");
  // State to manage password input
  const [password, setPassword] = useState("");
  // State to manage error messages
  const [error, setError] = useState<string | null>(null);
  // State to manage success messages
  const [message, setMessage] = useState<string | null>(null);
  // Hook to programmatically navigate
  const router = useRouter();

  // Effect to log email and password changes (for debugging purposes)
  useEffect(() => {
    console.log("Email:", email, "Password:", password);
  }, [email, password]);

  // Function to handle user registration
  const handleRegister = async () => {
    try {
      // Create a new user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Save additional user details to Firestore
      await setDoc(doc(db, "users", user.uid), {
        email: user.email,
        role: "admin", // Default role for new users
      });

      setMessage("User registered successfully");
      // Redirect to the login page after successful registration
      router.push("/login");

      // Clear input fields
      setEmail("");
      setPassword("");
    } catch (error) {
      if (error instanceof FirebaseError) {
        // Set error message if registration fails
        setError(error.message);
      } else {
        // Handle unexpected errors
        setError("An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="table-container">
      <p className="registered-user-text">Registration</p>
      <div className="main-container">
        {/* Input field for email */}
        Email:
        <InputField
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          ariaLabel="Email"
        />
        {/* Input field for password */}
        Password:
        <InputField
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          ariaLabel="Password"
        />
        {/* Display error message if any */}
        {error && <p style={{ color: "red" }}>{error}</p>}
        {/* Display success message if any */}
        {message && <p style={{ color: "green" }}>{message}</p>}
        {/* Submit button for the registration form */}
        <div className="button-container">
          <Button type="submit" ariaLabel="Register" onClick={handleRegister}>
            Register
          </Button>
        </div>
      </div>
    </div>
  );
};

export default RegistrationPage;
