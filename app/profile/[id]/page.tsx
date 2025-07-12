import { notFound } from "next/navigation";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  MapPin,
  Clock,
  User,
  Mail,
  Shield,
  CheckCircle,
  MessageSquare,
  Handshake,
} from "lucide-react";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { app } from "@/lib/firebase";
import Link from "next/link";

interface TimeSlot {
  start: string;
  end: string;
}

interface User {
  id: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  avatarUrl?: string;
  skillsOffered?: string[];
  skillsWanted?: string[];
  city?: string;
  state?: string;
  availability?:
    | string
    | {
        timeSlots: TimeSlot[];
        days: string[];
      };
  isProfilePublic?: boolean | string | number;
  bio?: string;
  isVerified?: boolean;
}

async function getUserProfile(id: string): Promise<User | null> {
  try {
    const db = getFirestore(app);
    const userRef = doc(db, "users", id);
    const userSnap = await getDoc(userRef);

    if (!userSnap.exists()) {
      return null;
    }

    return {
      id: userSnap.id,
      ...(userSnap.data() as Omit<User, "id">),
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { id } = await params;
  const user = await getUserProfile(id);
  if (!user) return notFound();

  const getUserInitials = () => {
    const firstName = user.firstName || "";
    const lastName = user.lastName || "";
    const email = user.email || "";
    if (firstName && lastName)
      return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return "U";
  };

  const getLocation = () => {
    const parts = [];
    if (user.city) parts.push(user.city);
    if (user.state) parts.push(user.state);
    return parts.length > 0 ? parts.join(", ") : null;
  };

  const getAvailabilityText = () => {
    if (!user.availability) return null;
    if (typeof user.availability === "string") return user.availability;
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

  const isPublic =
    user.isProfilePublic === true ||
    user.isProfilePublic === "true" ||
    user.isProfilePublic === 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-28 w-28 ring-4 ring-white/20 shadow-lg">
                  <AvatarImage
                    src={user.avatarUrl || ""}
                    alt={`${user.firstName || ""} ${user.lastName || ""}`}
                  />
                  <AvatarFallback className="bg-white/20 text-white text-3xl font-semibold">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                {!isPublic && (
                  <div className="absolute -top-2 -right-2 bg-amber-500 text-white p-1 rounded-full">
                    <Shield className="w-4 h-4" />
                  </div>
                )}
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center gap-2">
                  <h1 className="text-3xl font-bold tracking-tight">
                    {user.firstName} {user.lastName}
                  </h1>
                  {user.isVerified && (
                    <CheckCircle className="w-6 h-6 text-green-300 flex-shrink-0" />
                  )}
                </div>
                {user.email && (
                  <div className="flex items-center justify-center gap-2 mt-2 text-blue-100">
                    <Mail className="w-4 h-4" />
                    <span className="text-sm">{user.email}</span>
                  </div>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8">
            {isPublic ? (
              <div className="space-y-6">
                {/* Action Buttons */}
                <div className="flex gap-3 pt-2">
                  <Button
                    asChild
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
                  >
                    <Link href={`/chat/${user.id}`}>
                      <MessageSquare className="w-4 h-4 mr-2" />
                      Message
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="outline"
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-50 font-medium py-2.5"
                  >
                    <Link href="/send-request">
                      <Handshake className="w-4 h-4 mr-2" />
                      Request Skill Swap
                    </Link>
                  </Button>
                </div>

                {/* Location */}
                {getLocation() && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      {getLocation()}
                    </span>
                  </div>
                )}

                {/* Availability */}
                {getAvailabilityText() && (
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <Clock className="w-5 h-5 text-gray-500 flex-shrink-0" />
                    <span className="text-gray-700 font-medium">
                      {getAvailabilityText()}
                    </span>
                  </div>
                )}

                {/* Bio */}
                {user.bio && (
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-gray-900 mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed">{user.bio}</p>
                  </div>
                )}

                {/* Skills to Share */}
                {user.skillsOffered && user.skillsOffered.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <User className="w-5 h-5 text-blue-600" />
                      Skills to Share
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsOffered.map((skill) => (
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
                )}

                {/* Skills to Learn */}
                {user.skillsWanted && user.skillsWanted.length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                      <Handshake className="w-5 h-5 text-green-600" />
                      Skills to Learn
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsWanted.map((skill) => (
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
                )}
              </div>
            ) : (
              <div className="text-center py-8">
                <Shield className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Private Profile
                </h3>
                <p className="text-gray-600">
                  This profile is private and not available for viewing.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
