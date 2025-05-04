"use client";

import Link from "next/link";
import React, { useState } from "react";
import { faBars } from "@fortawesome/free-solid-svg-icons";
import { getAuth, signOut } from "firebase/auth";
import { useAuthUser } from "@/firebase/firebaseFunctions";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Image from "next/image";
import { app } from "@/firebase/firebaseConfig";
import { useRouter } from "next/navigation";
import MobileHeader from "./mobileHeader";

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const auth = getAuth(app);
  const user = useAuthUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <header className="fixed z-40 w-full h-fit bg-gray-900">
      <nav className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
          <Image
            src="/High-Resolution-Logo-White-on-Transparent-Background (1).svg"
            alt="Logo"
            width={112} // Explicit width (28 * 4 = 112px, based on your h-28 class)
            height={112} // Explicit height 
            className="mr-6 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 ease-in-out rounded-full"
          />
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="/upload"
                className=" text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
              >
                Upload
              </Link>
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className=" text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    Logout
                  </button>
                  <Link
                    href="/profile"
                    className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/zone"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                  >
                    The Zone
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className=" text-gray-300 hover:text-white px-3 py-2 text-sm font-medium"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-blue-700"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
          <div className="md:hidden">
            <FontAwesomeIcon
              icon={faBars}
              className="h-6 w-6 text-2xl"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            />
          </div>
        </div>

        {isMobileMenuOpen && (
          <MobileHeader
            setIsMobileMenuOpen={setIsMobileMenuOpen}
            handleLogout={handleLogout}
          />
        )}
      </nav>
    </header>
  );
}
