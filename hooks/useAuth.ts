"use client";

import { useState, useEffect } from 'react';
import { onAuthStateChanged, User, signOut } from 'firebase/auth';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { auth, app } from '@/lib/firebase';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    return onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if user is banned
        try {
          const db = getFirestore(app);
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          
          if (userDoc.exists()) {
            const data = userDoc.data();
            if (data.isBanned) {
              // User is banned, sign them out
              await signOut(auth);
              alert('Your account has been banned. Please contact support if you believe this is an error.');
              return;
            }
            setUserData(data);
          }
        } catch (error) {
          console.error('Error checking user status:', error);
        }
      }
      
      setUser(user);
      setLoading(false);
    });
  }, []);

  return { user, loading, userData };
} 