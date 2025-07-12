'use client';

import { useState } from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Clock } from "lucide-react";
import Link from "next/link";
import { getFirestore, addDoc, collection, serverTimestamp } from "firebase/firestore";
import { app } from "@/lib/firebase";
import RequestDialog from "@/components/request/RequestDialog";

interface UserCardProps {
  id: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  location: string;
  availability: string;
  skillsOffered: string[];
  skillsWanted: string[];
}

export default function UserCard({
  id,
  firstName,
  lastName,
  avatar,
  location,
  availability,
  skillsOffered,
  skillsWanted,
}: UserCardProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getInitials = () => {
    const firstInitial = firstName?.charAt(0) || '';
    const lastInitial = lastName?.charAt(0) || '';
    return firstInitial + lastInitial || 'U';
  };

  const handleRequestSubmit = async (data: { skillOffered: string; skillWanted: string; message: string }) => {
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
    <>
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-300 bg-white/80 backdrop-blur-sm border-0">
        <CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <Link href={`/profile/${id}`} className="flex items-center space-x-3 group">
              <Avatar className="h-12 w-12 border-2 border-white shadow-md group-hover:border-blue-100 transition-colors duration-300">
                <AvatarImage src={avatar} />
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {`${firstName || ''} ${lastName || ''}`}
                </h3>
                <div className="flex items-center space-x-2 text-sm text-gray-600">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>{location}</span>
                  <span className="text-gray-300">•</span>
                  <Clock className="w-3.5 h-3.5" />
                  <span>{availability}</span>
                </div>
              </div>
            </Link>
            <Button
              variant="outline"
              className="border-green-600 text-green-600 hover:bg-green-50"
              onClick={() => setIsDialogOpen(true)}
            >
              Request
            </Button>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills to Share</h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsOffered.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-blue-50 text-blue-700 hover:bg-blue-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-2">Skills to Learn</h4>
              <div className="flex flex-wrap gap-1.5">
                {skillsWanted.map((skill) => (
                  <Badge key={skill} variant="secondary" className="bg-green-50 text-green-700 hover:bg-green-100">
                    {skill}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <RequestDialog
        isOpen={isDialogOpen}
        onClose={() => setIsDialogOpen(false)}
        onSubmit={handleRequestSubmit}
        userSkills={skillsOffered}
        recipientSkills={skillsWanted}
      />
    </>
  );
}
