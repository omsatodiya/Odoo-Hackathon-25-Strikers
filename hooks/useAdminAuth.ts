'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { useRouter } from 'next/navigation';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface AdminAuthState {
  isAdmin: boolean;
  isLoading: boolean;
  error: string | null;
}

export const useAdminAuth = (): AdminAuthState => {
  const { user, loading: authLoading } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const checkAdminRole = async () => {
      if (authLoading) {
        setIsLoading(true);
        return;
      }

      if (!user) {
        setIsAdmin(false);
        setIsLoading(false);
        setError('User not authenticated');
        router.push('/auth/login');
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        const db = getFirestore(app);
        const userDoc = doc(db, 'users', user.uid);
        const userSnapshot = await getDoc(userDoc);

        if (!userSnapshot.exists()) {
          setIsAdmin(false);
          setError('User profile not found');
          router.push('/auth/login');
          return;
        }

        const userData = userSnapshot.data();
        const userRole = userData?.role || userData?.isAdmin || false;

        if (userRole === 'admin' || userRole === true) {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
          setError('Access denied. Admin privileges required.');
          router.push('/');
        }
      } catch (err) {
        console.error('Error checking admin role:', err);
        setIsAdmin(false);
        setError('Failed to verify admin privileges');
        router.push('/');
      } finally {
        setIsLoading(false);
      }
    };

    checkAdminRole();
  }, [user, authLoading, router]);

  return {
    isAdmin,
    isLoading,
    error,
  };
}; 