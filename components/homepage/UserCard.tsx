"use client";

import React from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import Link from "next/link";

interface TimeSlot {
  start: string;
  end: string;
}

interface Availability {
  timeSlots: TimeSlot[];
  days: string[];
}

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
  availability?: string | Availability;
  profileVisibility?: boolean;
  bio?: string;
  isProfilePublic?: boolean | string | number;
  isVerified?: boolean;
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
        .map((slot: TimeSlot) => `${slot.start} - ${slot.end}`)
        .join(", ");
      return `${days} at ${times}`;
    }
    return null;
  };

  const availabilityText = getAvailabilityText();
  const isPublic =
    user.isProfilePublic === true ||
    user.isProfilePublic === "true" ||
    user.isProfilePublic === 1;

  return (
    <Link href={`/profile/${user.id}`} className="block group">
      <Card
        className={`transition-shadow duration-200 w-full flex flex-col md:flex-row items-center md:items-start p-6 gap-6 shadow-sm border border-gray-200 group-hover:shadow-xl group-hover:border-blue-400 bg-white/90 cursor-pointer relative ${
          isPublic ? "ring-2 ring-blue-200" : "ring-0"
        }`}
      >
        {/* Left: Profile Avatar */}
        <div className="flex-shrink-0">
          <Avatar className="h-20 w-20 ring-2 ring-gray-100 group-hover:ring-blue-400 transition">
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
        <div className="flex-1 w-full space-y-2 md:space-y-3">
          <div className="flex flex-col md:flex-row md:items-center md:gap-3">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-xl text-gray-900 group-hover:text-blue-700 transition">
                {user.firstName} {user.lastName}
              </h3>
              {user.isVerified && (
                <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
              )}
            </div>
            {isPublic && (
              <span className="ml-0 md:ml-2 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-700 border border-blue-200">
                Public
              </span>
            )}
          </div>
          <div className="text-sm text-gray-500 flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            {getLocation()}
          </div>
          {availabilityText && (
            <div className="text-xs text-blue-700 flex items-center gap-2">
              <Clock className="w-4 h-4" />
              {availabilityText}
            </div>
          )}
          {/* Short bio/description if available */}
          {user.bio && (
            <p className="text-gray-600 text-sm line-clamp-2 italic mt-1">
              {user.bio}
            </p>
          )}
        </div>

        {/* Right: Skills and Request Button */}
        <div className="flex flex-col gap-2 items-end min-w-[120px]">
          {user.skillsOffered && user.skillsOffered.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {user.skillsOffered.slice(0, 3).map((skill, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="text-xs bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
                >
                  {skill}
                </Badge>
              ))}
              {user.skillsOffered.length > 3 && (
                <span className="text-xs text-gray-400 ml-1">
                  +{user.skillsOffered.length - 3} more
                </span>
              )}
            </div>
          )}
          {user.skillsWanted && user.skillsWanted.length > 0 && (
            <div className="flex flex-wrap gap-1 justify-end">
              {user.skillsWanted.slice(0, 2).map((skill, index) => (
                <Badge
                  key={index}
                  variant="outline"
                  className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50"
                >
                  {skill}
                </Badge>
              ))}
              {user.skillsWanted.length > 2 && (
                <span className="text-xs text-gray-400 ml-1">
                  +{user.skillsWanted.length - 2} more
                </span>
              )}
            </div>
          )}
          <Button
            variant="default"
            className="mt-4 md:mt-auto"
            onClick={(e) => {
              e.stopPropagation();
              // TODO: Implement request logic/modal here
              alert(`Request sent to ${user.firstName} ${user.lastName}`);
            }}
          >
            Request
          </Button>
        </div>
        {/* Click overlay for accessibility */}
        <span
          className="absolute inset-0"
          aria-label={`View profile of ${user.firstName} ${user.lastName}`}
        ></span>
      </Card>
    </Link>
  );
}
