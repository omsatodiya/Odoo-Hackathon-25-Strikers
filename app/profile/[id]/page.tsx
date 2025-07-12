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

interface Availability {
  timeSlots: TimeSlot[];
  days: string[];
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
  availability?: string | Availability;
  isProfilePublic?: boolean | string | number;
  bio?: string;
  isVerified?: boolean;
}

interface ProfilePageProps {
  params: Promise<{ id: string }>;
}

async function getUserProfile(id: string): Promise<User | null> {
  const db = getFirestore(app);
  const userDoc = await getDoc(doc(db, "users", id));
  if (!userDoc.exists()) return null;
  return { id: userDoc.id, ...(userDoc.data() as Omit<User, "id">) };
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

                {/* Skills Offered */}
                {user.skillsOffered && user.skillsOffered.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      Skills Offered
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsOffered.map((skill: string, idx: number) => (
                        <Badge
                          key={idx}
                          className="px-3 py-1 text-sm font-medium bg-green-100 text-green-800 border border-green-200 hover:bg-green-200 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Skills Wanted */}
                {user.skillsWanted && user.skillsWanted.length > 0 && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      Skills Wanted
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {user.skillsWanted.map((skill: string, idx: number) => (
                        <Badge
                          key={idx}
                          variant="outline"
                          className="px-3 py-1 text-sm font-medium border-blue-300 text-blue-700 hover:bg-blue-50 transition-colors"
                        >
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Bio */}
                {user.bio && (
                  <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <User className="w-5 h-5 text-gray-600" />
                      About
                    </h3>
                    <div className="p-4 bg-gray-50 rounded-lg">
                      <p className="text-gray-700 leading-relaxed">
                        {user.bio}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="w-8 h-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Private Profile
                </h3>
                <p className="text-gray-600">
                  This user has chosen to keep their profile private.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
