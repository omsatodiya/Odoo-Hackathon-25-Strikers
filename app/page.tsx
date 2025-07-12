"use client";

import React, { useState, useEffect } from "react";
import UserCard from "@/components/homepage/UserCard";
import SearchFilter from "@/components/homepage/SearchFilter";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Users, ArrowRight, Sparkles } from "lucide-react";
import { getFirestore, collection, getDocs, query } from "firebase/firestore";
import { auth } from "@/lib/firebase";

interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  city?: string;
  state?: string;
  availability?:
    | string
    | { timeSlots: { start: string; end: string }[]; days: string[] };
  profileVisibility?: boolean;
}

type Availability =
  | string
  | { timeSlots: { start: string; end: string }[]; days: string[] };

function normalizeAvailability(avail: unknown): Availability {
  if (!avail) return "";
  if (typeof avail === "string") return avail;
  if (
    typeof avail === "object" &&
    avail !== null &&
    Array.isArray((avail as { timeSlots?: unknown[] }).timeSlots)
  ) {
    // If already correct shape, return as is
    if (
      (avail as { timeSlots: unknown[] }).timeSlots.length === 0 ||
      typeof (avail as { timeSlots: unknown[] }).timeSlots[0] === "object"
    )
      return avail as Availability;
    // If array of strings, convert to array of { start, end }
    return {
      ...(avail as { days: string[] }),
      timeSlots: (avail as { timeSlots: string[] }).timeSlots.map(
        (slot: string) => {
          const [start, end] = slot.split("-").map((s) => s.trim());
          return { start, end };
        }
      ),
    };
  }
  return avail as Availability;
}

function getAvailabilityString(availability: Availability): string {
  if (!availability) return "Not specified";
  if (typeof availability === "string") return availability;

  const { timeSlots, days } = availability;
  if (!timeSlots?.length || !days?.length) return "Not specified";

  const timeRange = timeSlots
    .map((slot) => `${slot.start}-${slot.end}`)
    .join(", ");
  return `${days.join(", ")} at ${timeRange}`;
}

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [user, setUser] = useState<{ uid: string } | null>(null);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const db = getFirestore();
        const usersQuery = query(collection(db, "users"));
        const querySnapshot = await getDocs(usersQuery);
        const usersData: User[] = [];

        querySnapshot.forEach((doc) => {
          const data = doc.data();
          const hasCompletedProfile =
            data.firstName &&
            data.lastName &&
            data.email &&
            (data.skillsOffered?.length > 0 || data.skillsWanted?.length > 0);

          if (hasCompletedProfile) {
            usersData.push({
              id: doc.id,
              firstName: data.firstName || "",
              lastName: data.lastName || "",
              email: data.email || "",
              avatarUrl: data.avatarUrl || "",
              skillsOffered: data.skillsOffered || [],
              skillsWanted: data.skillsWanted || [],
              city: data.city || "",
              state: data.state || "",
              availability: normalizeAvailability(data.availability),
              profileVisibility: data.profileVisibility || false,
            });
          }
        });

        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter((userData) => {
    if (user && userData.id === user.uid) return false;
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    const fullName = `${userData.firstName} ${userData.lastName}`.toLowerCase();
    const skillsOffered = userData.skillsOffered?.join(" ").toLowerCase() || "";
    const skillsWanted = userData.skillsWanted?.join(" ").toLowerCase() || "";
    const location = `${userData.city} ${userData.state}`.toLowerCase();

    return (
      fullName.includes(searchLower) ||
      skillsOffered.includes(searchLower) ||
      skillsWanted.includes(searchLower) ||
      location.includes(searchLower)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 to-purple-700 text-white">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Exchange Skills,
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500">
                Build Community
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Connect with talented people in your area. Teach what you know,
              learn what you need.
            </p>
            {!user && (
              <Button
                asChild
                size="lg"
                className="bg-white text-blue-600 hover:bg-gray-100"
              >
                <Link href="/auth/login" className="flex items-center gap-2">
                  Get Started
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Section */}
        <div className="mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-2">
              <Users className="w-8 h-8 text-blue-600" />
              Discover Talented People
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Find skilled individuals ready to share their expertise and learn
              new things.
            </p>
          </div>
          <div className="max-w-2xl mx-auto">
            <SearchFilter onSearch={setSearchQuery} />
          </div>
        </div>

        {/* Users Vertical Stack */}
        {loading ? (
          <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
            {Array.from({ length: 8 }).map((_, index) => (
              <Card key={index} className="overflow-hidden w-full">
                <CardContent className="p-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <Skeleton className="h-16 w-16 rounded-full" />
                    <div className="space-y-2 flex-1">
                      <Skeleton className="h-4 w-3/4" />
                      <Skeleton className="h-3 w-1/2" />
                    </div>
                  </div>
                  <Skeleton className="h-16 w-full mb-4" />
                  <div className="space-y-2">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-2/3" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : filteredUsers.length === 0 ? (
          <Card className="max-w-md mx-auto">
            <CardContent className="p-8 text-center">
              <Sparkles className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {searchQuery ? "No matches found" : "No users available"}
              </h3>
              <p className="text-gray-500 mb-4">
                {searchQuery
                  ? "Try adjusting your search terms or filters."
                  : "Be the first to create a profile and start skill swapping!"}
              </p>
              {!user && (
                <Button asChild>
                  <Link href="/auth">Create Profile</Link>
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          <>
            <div className="flex justify-between items-center mb-6 max-w-4xl mx-auto">
              <p className="text-gray-600">
                Found {filteredUsers.length}{" "}
                {filteredUsers.length === 1 ? "person" : "people"}
                {searchQuery && ` matching "${searchQuery}"`}
              </p>
            </div>
            <div className="flex flex-col space-y-6 max-w-4xl mx-auto">
              {filteredUsers.map((userData) => (
                <UserCard
                  key={userData.id}
                  id={userData.id}
                  firstName={userData.firstName}
                  lastName={userData.lastName}
                  email={userData.email}
                  avatarUrl={userData.avatarUrl}
                  city={userData.city}
                  state={userData.state}
                  availability={getAvailabilityString(
                    userData.availability || ""
                  )}
                  skillsOffered={userData.skillsOffered || []}
                  skillsWanted={userData.skillsWanted || []}
                  isProfilePublic={userData.profileVisibility}
                />
              ))}
            </div>
          </>
        )}

        {/* CTA Section */}
        {!user && filteredUsers.length > 0 && (
          <div className="mt-16 text-center">
            <Card className="max-w-2xl mx-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold mb-4">
                  Ready to Start Swapping Skills?
                </h3>
                <p className="text-blue-100 mb-6">
                  Join our community and connect with amazing people who can
                  help you grow.
                </p>
                <Button size="lg" variant="secondary" asChild>
                  <Link href="/auth/login">Sign Up Now</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
