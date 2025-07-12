import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';

interface LockoutData {
  attempts: number;
  lastAttempt: number;
  lockedUntil?: number;
}

const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION = 15 * 60 * 1000; // 15 minutes in milliseconds

export async function checkAccountLockout(email: string): Promise<{ isLocked: boolean; remainingTime?: number }> {
  try {
    const db = getFirestore();
    const lockoutDoc = doc(db, 'accountLockouts', email);
    const lockoutSnapshot = await getDoc(lockoutDoc);

    if (!lockoutSnapshot.exists()) {
      return { isLocked: false };
    }

    const data = lockoutSnapshot.data() as LockoutData;
    const now = Date.now();

    // Check if account is currently locked
    if (data.lockedUntil && now < data.lockedUntil) {
      return { 
        isLocked: true, 
        remainingTime: data.lockedUntil - now 
      };
    }

    // If lockout period has expired, reset the attempts
    if (data.lockedUntil && now >= data.lockedUntil) {
      await setDoc(lockoutDoc, {
        attempts: 0,
        lastAttempt: now,
      });
      return { isLocked: false };
    }

    return { isLocked: false };
  } catch (error) {
    console.error('Error checking account lockout:', error);
    return { isLocked: false };
  }
}

export async function recordLoginAttempt(email: string, success: boolean): Promise<{ isLocked: boolean; remainingTime?: number }> {
  try {
    const db = getFirestore();
    const lockoutDoc = doc(db, 'accountLockouts', email);
    const lockoutSnapshot = await getDoc(lockoutDoc);
    const now = Date.now();

    if (success) {
      // Reset attempts on successful login
      await setDoc(lockoutDoc, {
        attempts: 0,
        lastAttempt: now,
      });
      return { isLocked: false };
    }

    // Handle failed login attempt
    if (!lockoutSnapshot.exists()) {
      // First failed attempt
      await setDoc(lockoutDoc, {
        attempts: 1,
        lastAttempt: now,
      });
      return { isLocked: false };
    }

    const data = lockoutSnapshot.data() as LockoutData;
    const newAttempts = data.attempts + 1;

    if (newAttempts >= MAX_ATTEMPTS) {
      // Lock the account
      const lockedUntil = now + LOCKOUT_DURATION;
      await setDoc(lockoutDoc, {
        attempts: newAttempts,
        lastAttempt: now,
        lockedUntil,
      });
      return { 
        isLocked: true, 
        remainingTime: LOCKOUT_DURATION 
      };
    } else {
      // Increment attempts
      await setDoc(lockoutDoc, {
        attempts: newAttempts,
        lastAttempt: now,
      });
      return { isLocked: false };
    }
  } catch (error) {
    console.error('Error recording login attempt:', error);
    return { isLocked: false };
  }
}

export function formatLockoutTime(milliseconds: number): string {
  const minutes = Math.ceil(milliseconds / (1000 * 60));
  return `${minutes} minute${minutes !== 1 ? 's' : ''}`;
} 