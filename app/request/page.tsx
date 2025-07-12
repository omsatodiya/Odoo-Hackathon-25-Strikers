'use client';

import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RequestCard from '@/components/request/RequestCard';
import { Request } from '@/types';
import { getFirestore, collection, query, where, onSnapshot, doc, updateDoc, deleteDoc, Timestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';

interface FirestoreRequest {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId: string;
  receiverName: string;
  receiverAvatar?: string;
  skillOffered: string;
  skillWanted: string;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: Timestamp;
}

export default function RequestsPage() {
  const [requests, setRequests] = useState<Request[]>([]);
  const currentUserId = 'user1'; // TODO: Replace with actual logged-in user ID

  useEffect(() => {
    const db = getFirestore(app);
    const requestsRef = collection(db, 'requests');
    
    // Query for requests where the current user is either the sender or receiver
    const q = query(
      requestsRef,
      where('senderId', '==', currentUserId)
    );

    const q2 = query(
      requestsRef,
      where('receiverId', '==', currentUserId)
    );

    // Subscribe to both queries
    const unsubscribe1 = onSnapshot(q, (snapshot) => {
      const newRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as FirestoreRequest,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setRequests(prev => {
        const filtered = prev.filter(r => r.receiverId === currentUserId);
        return [...filtered, ...newRequests];
      });
    });

    const unsubscribe2 = onSnapshot(q2, (snapshot) => {
      const newRequests = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as FirestoreRequest,
        createdAt: doc.data().createdAt?.toDate() || new Date()
      }));
      setRequests(prev => {
        const filtered = prev.filter(r => r.senderId === currentUserId);
        return [...filtered, ...newRequests];
      });
    });

    return () => {
      unsubscribe1();
      unsubscribe2();
    };
  }, [currentUserId]);

  const sentRequests = requests.filter(request => request.senderId === currentUserId);
  const receivedRequests = requests.filter(request => request.receiverId === currentUserId);

  const handleAccept = async (requestId: string) => {
    try {
      const db = getFirestore(app);
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'accepted'
      });
      // TODO: Show success notification
    } catch (error) {
      console.error('Error accepting request:', error);
      // TODO: Show error notification
    }
  };

  const handleReject = async (requestId: string) => {
    try {
      const db = getFirestore(app);
      const requestRef = doc(db, 'requests', requestId);
      await updateDoc(requestRef, {
        status: 'rejected'
      });
      // TODO: Show success notification
    } catch (error) {
      console.error('Error rejecting request:', error);
      // TODO: Show error notification
    }
  };

  const handleDelete = async (requestId: string) => {
    try {
      const db = getFirestore(app);
      const requestRef = doc(db, 'requests', requestId);
      await deleteDoc(requestRef);
      // TODO: Show success notification
    } catch (error) {
      console.error('Error deleting request:', error);
      // TODO: Show error notification
    }
  };

  return (
    <div className="container py-6">
      <h1 className="text-2xl font-bold mb-6">Skill Swap Requests</h1>
      
      <Tabs defaultValue="received" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="received">Received</TabsTrigger>
          <TabsTrigger value="sent">Sent</TabsTrigger>
        </TabsList>
        
        <TabsContent value="received" className="space-y-4">
          {receivedRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              type="received"
              onAccept={() => handleAccept(request.id)}
              onReject={() => handleReject(request.id)}
            />
          ))}
          {receivedRequests.length === 0 && (
            <p className="text-center text-gray-500 py-4">No requests received</p>
          )}
        </TabsContent>
        
        <TabsContent value="sent" className="space-y-4">
          {sentRequests.map((request) => (
            <RequestCard
              key={request.id}
              request={request}
              type="sent"
              onDelete={() => handleDelete(request.id)}
            />
          ))}
          {sentRequests.length === 0 && (
            <p className="text-center text-gray-500 py-4">No requests sent</p>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
