'use server';

import { getFirestore, doc, updateDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

const db = getFirestore(app);

export async function verifyUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isVerified: true,
      verifiedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error verifying user:', error);
    return { success: false, error: 'Failed to verify user' };
  }
}

export async function banUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBanned: true,
      bannedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error) {
    console.error('Error banning user:', error);
    return { success: false, error: 'Failed to ban user' };
  }
}

export async function unbanUser(userId: string): Promise<{ success: boolean; error?: string }> {
  try {
    const userRef = doc(db, 'users', userId);
    await updateDoc(userRef, {
      isBanned: false,
      bannedAt: null,
    });
    return { success: true };
  } catch (error) {
    console.error('Error unbanning user:', error);
    return { success: false, error: 'Failed to unban user' };
  }
} 