'use client';
import React from 'react'
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/firebase/firebaseFunctions';

const AuthCheck = ({ children }) => {
    const {user, loading} = useAuthUser();
    const router = useRouter();

    if (loading) return null;

    if (!user){
        router.push('/login');
        return null;
    }
    
    return <>{children}</>;
};

export default AuthCheck;