"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth, db } from "../firebaseConfig";
import "./layout.css";
import { Roboto } from "next/font/google";
import useClientAuth from "./hooks/useClientAuth";
import { getDoc, doc } from "firebase/firestore";

// Configure Roboto font with specific weight and subsets
const roboto = Roboto({
  weight: "400",
  subsets: ["latin"],
});

// Define the props interface for the Layout component
interface LayoutProps {
  children: React.ReactNode; // The content to be rendered inside the layout
  isLoggedIn: boolean; // Boolean flag indicating if the user is logged in
}

// Define the Layout component as a functional component
const Layout: React.FC<LayoutProps> = ({ children, isLoggedIn }) => {
  const router = useRouter(); // Hook to access the router object
  const pathname = usePathname(); // Hook to get the current pathname
  const { isAuthenticated: serverAuthenticated } = useClientAuth(); // Get authentication status from custom hook
  const [isAuthenticated, setIsAuthenticated] =
    useState<boolean>(serverAuthenticated); // Local state to track authentication status
  const [isAdmin, setIsAdmin] = useState<boolean>(false); // Local state to track if the user is an admin

  useEffect(() => {
    // Effect to check user role after authentication status changes
    const checkUserRole = async () => {
      if (serverAuthenticated) {
        const user = auth.currentUser;
        if (user) {
          // Fetch user document from Firestore to check the role
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === "admin"); // Set admin status based on role
          }
        }
      }
      setIsAuthenticated(serverAuthenticated); // Update local authentication state
    };

    checkUserRole(); // Call the function to check user role
  }, [serverAuthenticated]); // Dependency array ensures effect runs when serverAuthenticated changes

  const handleLogout = async () => {
    try {
      await signOut(auth); // Sign out the user
      router.push("/"); // Redirect to home page after logout
    } catch (error) {
      console.error("Logout error:", error); // Log any errors that occur during logout
    }
  };

  return (
    <html lang="en">
      <body className={roboto.className}>
        <header className="header">
          <div className="header-buttons">
            {/* Render login/register buttons if not authenticated */}
            {!isAuthenticated ? (
              <>
                <Link href="/registration" className="header-button">
                  Register
                </Link>
                <Link href="/login" className="header-button">
                  Login
                </Link>
              </>
            ) : (
              // Render logout button if authenticated
              <button className="header-button" onClick={handleLogout}>
                Logout
              </button>
            )}
          </div>
        </header>

        <div className="layout">
          {/* Render sidebar if authenticated */}
          {isAuthenticated && (
            <aside className="sidebar">
              <nav>
                <ul>
                  <li>
                    <Link
                      href="/"
                      className={pathname === "/" ? "active-link" : "link"}
                    >
                      Home
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="/calculation"
                      className={
                        pathname === "/calculation" ? "active-link" : "link"
                      }
                    >
                      Calculation
                    </Link>
                  </li>
                  {/* Render admin-specific links if user is an admin */}
                  {isAdmin && (
                    <>
                      <li>
                        <Link
                          href="/users"
                          className={
                            pathname === "/users" ? "active-link" : "link"
                          }
                        >
                          Users
                        </Link>
                      </li>
                      <li>
                        <Link
                          href="/assignrole"
                          className={
                            pathname === "/assignrole" ? "active-link" : "link"
                          }
                        >
                          Roles
                        </Link>
                      </li>
                    </>
                  )}
                </ul>
              </nav>
            </aside>
          )}

          <main className="content">{children}</main>
        </div>
      </body>
    </html>
  );
};

export default Layout;
