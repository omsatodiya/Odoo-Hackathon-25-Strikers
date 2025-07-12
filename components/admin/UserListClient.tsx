"use client";

import React, { useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MapPin, Clock, CheckCircle } from "lucide-react";
import { verifyUser, banUser, unbanUser } from "@/lib/actions/admin";
import { useGSAP } from "@/hooks/useGSAP";

interface AvailabilityObj {
  days: string[];
  timeSlots: { start: string; end: string }[];
}

interface User {
  id: string;
  name: string;
  location: string;
  availability: string | AvailabilityObj;
  bio: string;
  verified: boolean;
  banned: boolean;
  skillsOffered: string[];
  skillsWanted: string[];
  swapsCompleted: number;
  swapsPending: number;
}

function getAvailabilityText(availability: string | AvailabilityObj): string {
  if (!availability) return "";
  if (typeof availability === "string") return availability;
  if (
    typeof availability === "object" &&
    Array.isArray(availability.days) &&
    Array.isArray(availability.timeSlots)
  ) {
    const days = availability.days.join(", ");
    const times = availability.timeSlots
      .map((slot) => `${slot.start} - ${slot.end}`)
      .join(", ");
    return days && times ? `${days} at ${times}` : days || times || "";
  }
  return "";
}

const UserListClient = ({ users }: { users: User[] }) => {
  const [filter, setFilter] = React.useState<
    "all" | "verified" | "unverified" | "banned"
  >("all");
  const [loadingStates, setLoadingStates] = React.useState<
    Record<string, string>
  >({});

  const { animateStagger } = useGSAP();

  const filteredUsers = users.filter((u) => {
    if (filter === "all") return true;
    if (filter === "verified") return u.verified && !u.banned;
    if (filter === "unverified") return !u.verified && !u.banned;
    if (filter === "banned") return u.banned;
    return true;
  });

  // Animate cards when users change or filter changes
  useEffect(() => {
    animateStagger(".user-card", { delay: 0.1, stagger: 0.1 });
  }, [filteredUsers, animateStagger]);

  const handleVerify = async (userId: string, userName: string) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: "verifying" }));
    const result = await verifyUser(userId);
    setLoadingStates((prev) => ({ ...prev, [userId]: "" }));

    if (result.success) {
      alert(`Successfully verified ${userName}`);
      // Refresh the page to show updated data
      window.location.reload();
    } else {
      alert(`Failed to verify ${userName}: ${result.error}`);
    }
  };

  const handleBan = async (userId: string, userName: string) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: "banning" }));
    const result = await banUser(userId);
    setLoadingStates((prev) => ({ ...prev, [userId]: "" }));

    if (result.success) {
      alert(`Successfully banned ${userName}`);
      // Refresh the page to show updated data
      window.location.reload();
    } else {
      alert(`Failed to ban ${userName}: ${result.error}`);
    }
  };

  const handleUnban = async (userId: string, userName: string) => {
    setLoadingStates((prev) => ({ ...prev, [userId]: "unbanning" }));
    const result = await unbanUser(userId);
    setLoadingStates((prev) => ({ ...prev, [userId]: "" }));

    if (result.success) {
      alert(`Successfully unbanned ${userName}`);
      // Refresh the page to show updated data
      window.location.reload();
    } else {
      alert(`Failed to unban ${userName}: ${result.error}`);
    }
  };

  return (
    <>
      {/* Responsive Filter Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          onClick={() => setFilter("all")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          All
        </Button>
        <Button
          variant={filter === "verified" ? "default" : "outline"}
          onClick={() => setFilter("verified")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          Verified
        </Button>
        <Button
          variant={filter === "unverified" ? "default" : "outline"}
          onClick={() => setFilter("unverified")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          Unverified
        </Button>
        <Button
          variant={filter === "banned" ? "default" : "outline"}
          onClick={() => setFilter("banned")}
          size="sm"
          className="text-xs sm:text-sm"
        >
          Banned
        </Button>
      </div>

      <div className="space-y-4 lg:space-y-6">
        {filteredUsers.map((user) => (
          <Card
            key={user.id}
            className="user-card p-4 lg:p-6 flex flex-col md:flex-row items-center md:items-start gap-4 lg:gap-6 bg-white/90 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Profile */}
            <div className="flex-shrink-0">
              <Avatar className="h-16 w-16 lg:h-20 lg:w-20 ring-2 ring-gray-100">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-lg lg:text-xl">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-lg lg:text-xl">
                    {user.name}
                  </h3>
                  {user.verified && (
                    <CheckCircle className="w-4 h-4 lg:w-5 lg:h-5 text-green-500 flex-shrink-0" />
                  )}
                </div>
                <div className="flex flex-wrap gap-2">
                  {user.banned && (
                    <Badge variant="destructive" className="text-xs">
                      Banned
                    </Badge>
                  )}
                  {user.verified && (
                    <Badge className="bg-green-100 text-green-800 text-xs">
                      Verified
                    </Badge>
                  )}
                  {!user.verified && !user.banned && (
                    <Badge variant="outline" className="text-xs">
                      Unverified
                    </Badge>
                  )}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row text-sm text-gray-500 gap-2 sm:gap-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {getAvailabilityText(user.availability)}
                </span>
              </div>

              <p className="text-sm text-gray-700">{user.bio}</p>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Skills Offered
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered.map((skill) => (
                    <Badge
                      key={skill}
                      className="bg-green-50 text-green-700 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Skills Wanted
                </h4>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted.map((skill) => (
                    <Badge
                      key={skill}
                      variant="outline"
                      className="text-blue-700 border-blue-200 text-xs"
                    >
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 text-sm text-gray-600">
                <span>
                  Swaps Completed: <strong>{user.swapsCompleted}</strong>
                </span>
                <span>
                  Pending Swaps: <strong>{user.swapsPending}</strong>
                </span>
              </div>
            </div>

            {/* Admin actions */}
            <div className="mt-4 md:mt-0 flex flex-row sm:flex-col gap-2 md:ml-auto w-full sm:w-auto">
              {!user.verified && !user.banned && (
                <Button
                  size="sm"
                  onClick={() => handleVerify(user.id, user.name)}
                  disabled={loadingStates[user.id] === "verifying"}
                  className="flex-1 sm:flex-none text-xs"
                >
                  {loadingStates[user.id] === "verifying"
                    ? "Verifying..."
                    : "Verify"}
                </Button>
              )}
              {!user.banned ? (
                <Button
                  size="sm"
                  variant="destructive"
                  onClick={() => handleBan(user.id, user.name)}
                  disabled={loadingStates[user.id] === "banning"}
                  className="flex-1 sm:flex-none text-xs"
                >
                  {loadingStates[user.id] === "banning" ? "Banning..." : "Ban"}
                </Button>
              ) : (
                <Button
                  size="sm"
                  onClick={() => handleUnban(user.id, user.name)}
                  disabled={loadingStates[user.id] === "unbanning"}
                  className="flex-1 sm:flex-none text-xs"
                >
                  {loadingStates[user.id] === "unbanning"
                    ? "Unbanning..."
                    : "Unban"}
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </>
  );
};

export default UserListClient;
