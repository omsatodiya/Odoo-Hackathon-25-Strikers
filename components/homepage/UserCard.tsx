"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock } from "lucide-react";

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

interface UserCardProps {
  user: User;
}

export default function UserCard({ user }: UserCardProps) {
  const getUserInitials = () => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const email = user.email || "";

    if (firstName && lastName) {
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    }
    if (firstName) {
      return firstName[0].toUpperCase();
    }
    if (email) {
      return email[0].toUpperCase();
    }
    return "U";
  };

  const getLocation = () => {
    const parts = [];
    if (user.city) parts.push(user.city);
    if (user.state) parts.push(user.state);
    return parts.length > 0 ? parts.join(", ") : "Location not specified";
  };

  const getAvailabilityText = () => {
    if (!user.availability) return null;

    if (typeof user.availability === "string") {
      return user.availability;
    }

    if (
      typeof user.availability === "object" &&
      Array.isArray(user.availability.timeSlots) &&
      Array.isArray(user.availability.days)
    ) {
      const days = user.availability.days.join(", ");
      const times = user.availability.timeSlots
        .map((slot) => `${slot.start} - ${slot.end}`)
        .join(", ");
      return `${days} at ${times}`;
    }

    return null;
  };

  const availabilityText = getAvailabilityText();

  return (
    <Card className="w-full flex flex-col md:flex-row items-center md:items-start p-6 gap-6 shadow-sm">
      {/* Left: Profile Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="h-20 w-20 ring-2 ring-gray-100">
          <AvatarImage
            src={user.avatarUrl || ""}
            alt={`${user.firstName} ${user.lastName}`}
          />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
            {getUserInitials()}
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Middle: Info */}
      <div className="flex-1 w-full space-y-3">
        <div>
          <h3 className="font-semibold text-xl text-gray-900">
            {user.firstName} {user.lastName}
          </h3>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {getLocation()}
          </div>
          {availabilityText && (
            <div className="text-sm text-gray-500 flex items-center mt-1">
              <Clock className="w-4 h-4 mr-1" />
              {availabilityText}
            </div>
          )}
        </div>

        <p className="text-sm text-gray-600">
          Enthusiastic learner and passionate about sharing skills with the
          community.
        </p>

        {user.skillsOffered && user.skillsOffered.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Skills Offered
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsOffered.map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-green-50 text-green-700 hover:bg-green-100"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}

        {user.skillsWanted && user.skillsWanted.length > 0 && (
          <div>
            <h4 className="text-sm font-medium text-gray-700 mb-1">
              Skills Wanted
            </h4>
            <div className="flex flex-wrap gap-2">
              {user.skillsWanted.map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Right: Request Button */}
      <div className="mt-4 md:mt-0 md:ml-auto">
        <Button variant="default">Request</Button>
      </div>
    </Card>
  );
}
