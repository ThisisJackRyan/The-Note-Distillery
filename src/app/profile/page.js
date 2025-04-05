'use client';

import React, { useState, useEffect } from 'react';
import { getAuth, onAuthStateChanged, updateProfile } from 'firebase/auth';
import { app } from '@/firebase/firebaseConfig';
import { useRouter } from 'next/navigation';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser } from '@fortawesome/free-solid-svg-icons';

const ProfilePage = () => {
    const [user, setUser] = useState(null);
    const [displayName, setDisplayName] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [error, setError] = useState('');
    const router = useRouter();
    const auth = getAuth(app);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
                setDisplayName(user.displayName || '');
            } else {
                router.push('/login');
            }
        });

        return () => unsubscribe();
    }, [auth, router]);

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setError('');

        try {
            await updateProfile(auth.currentUser, {
                displayName: displayName
            });
            setIsEditing(false);
        } catch (error) {
            setError(error.message);
        }
    };

    if (!user) {
        return null;
    }

    return (
        <div className="h-full bg-gray-50 dark:bg-gray-900">
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-8">
                        <div className="mx-auto h-24 w-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center mb-4">
                            <FontAwesomeIcon icon={faUser} className="h-12 w-12 text-gray-500 dark:text-gray-400" />
                        </div>
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white sm:text-5xl">
                            {user.displayName || 'Your Profile'}
                        </h1>
                        <p className="mt-3 text-lg text-gray-500 dark:text-gray-400">
                            {user.email}
                        </p>
                    </div>

                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
                        <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Profile Information</h2>
                        </div>

                        {error && (
                            <div className="mb-4 text-red-500 dark:text-red-400 text-sm">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleUpdateProfile}>
                            <div className="space-y-4">
                                <div>
                                    <label htmlFor="displayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Display Name
                                    </label>
                                    <div className="mt-1">
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                id="displayName"
                                                value={displayName}
                                                onChange={(e) => setDisplayName(e.target.value)}
                                                className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white sm:text-sm"
                                            />
                                        ) : (
                                            <p className="text-gray-900 dark:text-white">{displayName || 'Not set'}</p>
                                        )}
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Email
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">{user.email}</p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Account Created
                                    </label>
                                    <p className="mt-1 text-gray-900 dark:text-white">
                                        {new Date(user.metadata.creationTime).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 flex justify-end space-x-3">
                                {isEditing ? (
                                    <>
                                        <button
                                            type="button"
                                            onClick={() => setIsEditing(false)}
                                            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            Save Changes
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        type="button"
                                        onClick={() => setIsEditing(true)}
                                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                    >
                                        Edit Profile
                                    </button>
                                )}
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default ProfilePage;