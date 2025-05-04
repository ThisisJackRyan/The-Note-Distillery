'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthUser } from '@/firebase/firebaseFunctions';

const AuthCheck = ({ children }) => {
    const user = useAuthUser();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // If the auth state is loading, don't redirect yet
        if (user === undefined) return;
        
        if (!user) {
            router.push('/login');
        } else {
            setLoading(false);
        }
    }, [user, router]);

    if (loading || user === undefined) return null; // or show a spinner

    return <>{children}</>;
};

export default AuthCheck;