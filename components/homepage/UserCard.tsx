"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { MapPin, CheckCircle } from "lucide-react";
import Link from "next/link";
import {
  getFirestore,
  addDoc,
  collection,
  serverTimestamp,
} from "firebase/firestore";
import { app } from "@/lib/firebase";
import RequestDialog from "@/components/request/RequestDialog";

interface UserCardProps {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  city?: string;
  state?: string;
  availability?: string;
  profileVisibility?: boolean;
  bio?: string;
  isProfilePublic?: boolean;
  isVerified?: boolean;
}

export default function UserCard({
  id,
  firstName,
  lastName,
  avatarUrl,
  city,
  state,
  skillsOffered = [],
  skillsWanted = [],
  isProfilePublic = false,
  isVerified = false,
}: UserCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getInitials = () => {
    const firstInitial = firstName?.charAt(0) || "";
    const lastInitial = lastName?.charAt(0) || "";
    return firstInitial + lastInitial || "U";
  };

  const getLocation = () => {
    if (city && state) return `${city}, ${state}`;
    if (city) return city;
    if (state) return state;
    return "Location not specified";
  };

  const handleRequestSubmit = async (data: {
    skillOffered: string;
    skillWanted: string;
    message: string;
  }) => {
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, "requests"), {
        senderId: "user1", // TODO: Replace with actual logged-in user ID
        senderName: "Current User", // TODO: Replace with actual user name
        receiverId: id,
        receiverName: `${firstName} ${lastName}`,
        skillOffered: data.skillOffered,
        skillWanted: data.skillWanted,
        message: data.message,
        status: "pending",
        createdAt: serverTimestamp(),
      });

      setIsDialogOpen(false);
      // TODO: Show success notification
    } catch (error) {
      console.error("Error creating request:", error);
      // TODO: Show error notification
    }
  };

  return (
    <Link href={`/profile/${id}`} className="block group">
      <Card
        className={`transition-shadow duration-200 w-full flex flex-col md:flex-row items-center md:items-start p-6 gap-6 shadow-sm border border-gray-200 group-hover:shadow-xl group-hover:border-blue-400 bg-white/90 cursor-pointer relative ${
          isProfilePublic ? "ring-2 ring-blue-200" : "ring-0"
        }`}
      >
        {/* Left: Profile Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-20 w-20 ring-2 ring-gray-100 group-hover:ring-blue-400 transition">
            <AvatarImage
              src={avatarUrl || ""}
              alt={`${firstName} ${lastName}`}
            />
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
              {getInitials()}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Middle: Info */}
        <div className="flex-1 w-full space-y-2 md:space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xl text-gray-900 group-hover:text-blue-700 transition">
                {firstName} {lastName}
              </h3>
              {isVerified && (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            {isProfilePublic && (
              <span className="ml-0 md:ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                Public
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {getLocation()}
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Skills to Share
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsOffered.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-blue-50 text-blue-700 hover:bg-blue-100"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">
                Skills to Learn
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsWanted.map((skill) => (
                  <Badge
                    key={skill}
                    variant="secondary"
                    className="bg-green-50 text-green-700 hover:bg-green-100"
                  >
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Card>

      <RequestDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleRequestSubmit}
        userSkills={skillsOffered}
        recipientSkills={skillsWanted}
      />
    </Link>
  );
}
