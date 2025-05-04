import React from 'react';
import Link from 'next/link';
import { useAuthUser } from '@/firebase/firebaseFunctions';
import ClosingX from '../icons/closingX';


const MobileHeader = ({setIsMobileMenuOpen, handleLogout}) => {
      const user = useAuthUser();

      const handleClose = () => {
        setIsMobileMenuOpen(false);
      }
    
    return (
        <div className="md:hidden">

            {/* Mobile menu panel */}
            <div className="fixed inset-y-0 right-0 w-full bg-gray-900">
            <div className="flex flex-col">
                <div className="flex items-center justify-between px-4 py-4 border-b border-gray-700">
                    <Link
                        href="/"
                        className="text-xl font-bold text-white"
                        onClick={handleClose}
                    >
                        The Note Distillery
                    </Link>
                    <ClosingX onCloseFunc={handleClose} />
                </div>
                <div className="px-4 py-6 space-y-4">
                    <Link
                        href={user ? "/upload" : "/login"}
                        className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                        onClick={handleClose}
                    >
                        Upload
                    </Link>
                    {user ? (
                        <>
                            <button
                                onClick={() => {
                                handleLogout();
                                handleClose();
                                }}
                                className="block w-full text-left text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                            >
                                Logout
                            </button>
                            <Link
                                href="/profile"
                                className="flex items-center text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                                onClick={handleClose}
                            >
                                Profile
                            </Link>
                            <Link
                                href="/zone"
                                className="block bg-blue-600 text-white px-4 py-2 rounded-md text-base font-medium hover:bg-blue-700"
                                onClick={handleClose}
                            >
                                The Zone
                            </Link>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="block text-gray-300 hover:text-white px-3 py-2 text-base font-medium"
                                onClick={handleClose}
                            >
                                Login
                            </Link>
                            <Link
                                href="/signup"
                                className="block bg-blue-600 text-white px-4 py-2 text-base font-medium hover:bg-blue-700"
                                onClick={handleClose}
                            >
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
            </div>
        </div>
    );
};

export default MobileHeader;