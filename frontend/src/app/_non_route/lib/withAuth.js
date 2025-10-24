'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthToken } from '../lib/api';
import toast from 'react-hot-toast';

export function withAuth(WrappedComponent) {
    return function AuthWrapper(props) {
        const router = useRouter();
        const token = getAuthToken();

        useEffect(() => {
            if (!token) {
                toast.error('Silakan login dulu!', { position: 'top-center' });
                router.push('/');
            }
        }, [token, router]);

        if (!token) {
            return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
        }

        return <WrappedComponent {...props} />;
    };
}
