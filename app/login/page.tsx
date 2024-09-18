"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebaseConfig"; // Import Firebase auth
import InputField from "../components/InputField/InputField";
import Button from "../components/Button/index";
import "../styles/login.css";

const LoginPage: React.FC = () => {
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

  // Function to handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent default form submission
    try {
      // Attempt to sign in with provided email and password
      await signInWithEmailAndPassword(auth, email, password);
      setMessage("Login successful! Redirecting...");
      // Redirect to the home page upon successful login
      router.push("/");
    } catch (error: any) {
      // Set error message if login fails
      setError(error.message);
    }
  };

  return (
    <div className="table-container-login">
      <p className="registered-user-text">Now Login to continue</p>
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
        {/* Submit button for the login form */}
        <div className="button-container">
          <Button type="submit" ariaLabel="Login" onClick={handleSubmit}>
            Login
          </Button>
        </div>
      </div>
      {/* Display error message if any */}
      {error && <p style={{ color: "red" }}>{error}</p>}
      {/* Display success message if any */}
      {message && <p style={{ color: "green" }}>{message}</p>}
    </div>
  );
};

export default LoginPage;
