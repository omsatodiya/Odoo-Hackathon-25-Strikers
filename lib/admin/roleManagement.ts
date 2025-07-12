import { getFirestore, doc, updateDoc, getDoc } from 'firebase/firestore';
import { app } from '@/lib/firebase';

export interface RoleUpdateResult {
  success: boolean;
  error?: string;
}

/**
 * Set a user as admin
 */
export async function setUserAsAdmin(userId: string): Promise<RoleUpdateResult> {
  try {
    const db = getFirestore(app);
    const userDoc = doc(db, 'users', userId);
    
    // First check if user exists
    const userSnapshot = await getDoc(userDoc);
    if (!userSnapshot.exists()) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Update user role to admin
    await updateDoc(userDoc, {
      role: 'admin',
      isAdmin: true,
      updatedAt: new Date()
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error setting user as admin:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Remove admin role from user
 */
export async function removeUserAdminRole(userId: string): Promise<RoleUpdateResult> {
  try {
    const db = getFirestore(app);
    const userDoc = doc(db, 'users', userId);
    
    // First check if user exists
    const userSnapshot = await getDoc(userDoc);
    if (!userSnapshot.exists()) {
      return {
        success: false,
        error: 'User not found'
      };
    }

    // Remove admin role
    await updateDoc(userDoc, {
      role: 'user',
      isAdmin: false,
      updatedAt: new Date()
    });

    return {
      success: true
    };
  } catch (error) {
    console.error('Error removing admin role:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

/**
 * Check if a user has admin role
 */
export async function checkUserAdminRole(userId: string): Promise<{ isAdmin: boolean; error?: string }> {
  try {
    const db = getFirestore(app);
    const userDoc = doc(db, 'users', userId);
    const userSnapshot = await getDoc(userDoc);

    if (!userSnapshot.exists()) {
      return {
        isAdmin: false,
        error: 'User not found'
      };
    }

    const userData = userSnapshot.data();
    const isAdmin = userData?.role === 'admin' || userData?.isAdmin === true;

    return {
      isAdmin
    };
  } catch (error) {
    console.error('Error checking admin role:', error);
    return {
      isAdmin: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
} 