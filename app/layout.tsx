"use client";

import { ReactNode } from "react";
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

const Layout = ({ children }: { children: ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated: serverAuthenticated } = useClientAuth();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(
    serverAuthenticated
  );
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  useEffect(() => {
    const checkUserRole = async () => {
      if (serverAuthenticated) {
        const user = auth.currentUser;
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setIsAdmin(userDoc.data().role === "admin");
          }
        }
      }
      setIsAuthenticated(serverAuthenticated);
    };

    checkUserRole();
  }, [serverAuthenticated]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (isAuthenticated === null) {
    // Render a loading state while determining authentication
    return <div>Loading...</div>;
  }

  return (
    <div className={roboto.className}>
      <header className="header">
        <div className="header-buttons">
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
            <button className="header-button" onClick={handleLogout}>
              Logout
            </button>
          )}
        </div>
      </header>

      <div className="layout">
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
    </div>
  );
};

const RootLayout = ({ children }: { children: ReactNode }) => {
  return (
    <html lang="en">
      <body>
        <Layout>{children}</Layout>
      </body>
    </html>
  );
};

export default RootLayout;
