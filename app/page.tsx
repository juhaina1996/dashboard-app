"use client";

import React from "react";
import useClientAuth from "./hooks/useClientAuth";
import Layout from "./layout";
import "./styles/home.css";

const HomePage: React.FC = () => {
  const { isAuthenticated } = useClientAuth();

  return (
    <Layout isLoggedIn={isAuthenticated}>
      {" "}
      {/* Pass the isLoggedIn prop here */}
      {isAuthenticated ? (
        <p className="welcome-back">🎉 Welcome back 🎉</p>
      ) : (
        <div className="login-prompt">
          <p>🚀 Hey there! It looks like you’re not logged in.</p>
          <p>Click Login to enter the dashboard and start exploring!</p>
        </div>
      )}
    </Layout>
  );
};

export default HomePage;
