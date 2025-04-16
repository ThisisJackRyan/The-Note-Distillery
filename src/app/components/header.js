'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { faBars, faXmark } from '@fortawesome/free-solid-svg-icons';
import { getAuth, onAuthStateChanged, signOut } from 'firebase/auth';
import { useAuthUser } from '@/firebase/firebaseFunctions';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { app } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import MobileHeader from './mobileHeader';
import ClosingX from './closingX';


export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const router = useRouter();
  const auth = getAuth(app);
  const user = useAuthUser();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <header className="fixed z-40 w-full h-fit bg-gray-900">
      <nav className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="flex justify-between items-center h-20">
          <div className="flex items-center">
            <Link href="/" className="text-xl font-bold text-white">
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
                href={user ? "/upload" : "/login"}
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
            <FontAwesomeIcon icon={faBars} className="h-6 w-6 text-2xl"  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}/>
          </div>
        </div>
        
        {isMobileMenuOpen && <MobileHeader setIsMobileMenuOpen={setIsMobileMenuOpen} handleLogout={handleLogout}/>}
        
      </nav>
    </header>
  );
}
