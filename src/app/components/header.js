'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { app } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();
  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, [auth]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed z-100 w-full h-18 bg-white dark:bg-gray-900">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20"> {/* Adjusted height to match header */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-gray-900 dark:text-white">
              <img
                src="/High-Resolution-Logo-White-on-Transparent-Background (1).svg" // Update the path to point to the public directory
                alt="Logo"
                className="h-28 w-28 mr-6 hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.9)] transition-all duration-300 ease-in-out rounded-full"
              />
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-center space-x-4">
              <Link
                href="upload"
                className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
              >
                Upload
              </Link>
              {user ? (
                <>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Logout
                  </button>
                  <Link
                    href="/profile"
                    className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
                  >
                    Profile
                  </Link>
                  <Link
                    href="/zone"
                    className="block bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    The Zone
                  </Link>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-sm font-medium"
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
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
            >
              <FontAwesomeIcon icon={isMobileMenuOpen ? faXmark : faBars} className="h-6 w-6 text-2xl" />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-gray-500 bg-opacity-50"
              onClick={() => setIsMobileMenuOpen(false)}
            ></div>

            {/* Mobile menu panel */}
            <div className="fixed inset-y-0 right-0 w-full bg-white dark:bg-gray-900 shadow-xl">
              <div className="flex flex-col h-full">
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-200 dark:border-gray-700">
                  <Link
                    href="/"
                    className="text-xl font-bold text-gray-900 dark:text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    The Note Distillery
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                  >
                    <FontAwesomeIcon icon={faXmark} className="h-6 w-6 text-2xl" />
                  </button>
                </div>

                <div className="flex-1 px-4 py-6 space-y-4">
                  <Link
                    href="input"
                    className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    Upload
                  </Link>
                  {user ? (
                    <>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMobileMenuOpen(false);
                        }}
                        className="block w-full text-left text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
                      >
                        Logout
                      </button>
                      <Link
                        href="/profile"
                        className="flex items-center text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Profile
                      </Link>
                      <Link
                        href="/zone"
                        className="block bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        The Zone
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        href="/login"
                        className="block text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white px-3 py-2 rounded-md text-base font-medium"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Login
                      </Link>
                      <Link
                        href="/signup"
                        className="block bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}
