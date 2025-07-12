'use client';

import { useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import RequestDialog from '@/components/request/RequestDialog';
import { getFirestore, addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { app } from '@/lib/firebase';
import {
  MapPin,
  Clock,
  User,
  Mail,
  Shield,
  MessageSquare,
  Handshake,
} from 'lucide-react';

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
  availability?: string | {
    timeSlots: TimeSlot[];
    days: string[];
  };
  isProfilePublic?: boolean | string | number;
  bio?: string;
}

interface ProfileContentProps {
  user: User;
}

export default function ProfileContent({ user }: ProfileContentProps) {
  const router = useRouter();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const getUserInitials = () => {
    const firstName = user.firstName || '';
    const lastName = user.lastName || '';
    const email = user.email || '';
    if (firstName && lastName) return `${firstName[0]}${lastName[0]}`.toUpperCase();
    if (firstName) return firstName[0].toUpperCase();
    if (email) return email[0].toUpperCase();
    return 'U';
  };

  const getLocation = () => {
    const parts = [];
    if (user.city) parts.push(user.city);
    if (user.state) parts.push(user.state);
    return parts.length > 0 ? parts.join(', ') : null;
  };

  const getAvailabilityText = () => {
    if (!user.availability) return null;
    if (typeof user.availability === 'string') return user.availability;
    if (
      typeof user.availability === 'object' &&
      Array.isArray(user.availability.timeSlots) &&
      Array.isArray(user.availability.days)
    ) {
      const days = user.availability.days.join(', ');
      const times = user.availability.timeSlots
        .map((slot: TimeSlot) => `${slot.start} - ${slot.end}`)
        .join(', ');
      return `${days} at ${times}`;
    }
    return null;
  };

  const isPublic =
    user.isProfilePublic === true ||
    user.isProfilePublic === 'true' ||
    user.isProfilePublic === 1;

  const handleRequestSubmit = async (data: { skillOffered: string; skillWanted: string; message: string }) => {
    try {
      const db = getFirestore(app);
      await addDoc(collection(db, 'requests'), {
        senderId: 'user1', // TODO: Replace with actual logged-in user ID
        senderName: 'Current User', // TODO: Replace with actual user name
        receiverId: user.id,
        receiverName: `${user.firstName} ${user.lastName}`,
        skillOffered: data.skillOffered,
        skillWanted: data.skillWanted,
        message: data.message,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
      
      setIsDialogOpen(false);
      // TODO: Show success notification
    } catch (error) {
      console.error('Error creating request:', error);
      // TODO: Show error notification
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="overflow-hidden shadow-xl border-0 bg-white/80 backdrop-blur-sm">
          <CardHeader className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white pb-8">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                <Avatar className="h-28 w-28 ring-4 ring-white/20 shadow-lg">
                  <AvatarImage
                    src={user.avatarUrl || ''}
                    alt={`${user.firstName || ''} ${user.lastName || ''}`}
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
                <h1 className="text-3xl font-bold tracking-tight">
                  {user.firstName} {user.lastName}
                </h1>
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
                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5" 
                    onClick={() => router.push(`/chat/${user.id}`)}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Message
                  </Button>
                  <Button
                    variant="outline"
                    className="flex-1 border-green-600 text-green-600 hover:bg-green-50 font-medium py-2.5"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    <Handshake className="w-4 h-4 mr-2" />
                    Request Skill Swap
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

        <RequestDialog
          isOpen={isDialogOpen}
          onClose={() => setIsDialogOpen(false)}
          onSubmit={handleRequestSubmit}
          userSkills={user.skillsOffered || []}
          recipientSkills={user.skillsWanted || []}
        />
      </div>
    </div>
  );
}