import React from "react";
import { Card } from "@/components/ui/card";
import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/lib/firebase";
import UserListClient from "@/components/admin/UserListClient";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

interface User {
  id: string;
  name: string;
  location: string;
  availability: string;
  bio: string;
  verified: boolean;
  banned: boolean;
  skillsOffered: string[];
  skillsWanted: string[];
  swapsCompleted: number;
  swapsPending: number;
}

async function fetchUsersFromFirestore(): Promise<User[]> {
  const db = getFirestore(app);
  const usersCol = collection(db, "users");
  const snapshot = await getDocs(usersCol);
  return snapshot.docs.map((doc) => {
    const data = doc.data();
    return {
      id: doc.id,
      name:
        data.name ||
        `${data.firstName || ""} ${data.lastName || ""}`.trim() ||
        "Unknown",
      location:
        data.location ||
        [data.city, data.state].filter(Boolean).join(", ") ||
        "Unknown",
      availability: data.availability || "Unknown",
      bio: data.bio || "",
      verified: Boolean(data.isVerified),
      banned: Boolean(data.isBanned),
      skillsOffered: Array.isArray(data.skillsOffered)
        ? data.skillsOffered
        : [],
      skillsWanted: Array.isArray(data.skillsWanted) ? data.skillsWanted : [],
      swapsCompleted:
        typeof data.swapsCompleted === "number" ? data.swapsCompleted : 0,
      swapsPending:
        typeof data.swapsPending === "number" ? data.swapsPending : 0,
    };
  });
}

export default async function AdminUserDetailsPage() {
  const users = await fetchUsersFromFirestore();
  return (
    <AdminLayoutWrapper activePage="users">
      <div className="w-full max-w-7xl mx-auto">
        <Card className="mb-6 lg:mb-8 p-4 lg:p-6 shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2 tracking-tight">
            User Overview
          </h1>
          <p className="text-sm lg:text-base text-gray-600">
            Manage, verify, and ban users. Use the filters below to view users
            by status.
          </p>
        </Card>
        <div className="mb-6 lg:mb-8">
          <UserListClient users={users} />
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
