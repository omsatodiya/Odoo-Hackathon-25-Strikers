'use client';

import React, { useState } from 'react';
import { Card} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock } from 'lucide-react';

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

const users: User[] = [
  {
    id: '1',
    name: 'Alex Example',
    location: 'Placeholder City',
    availability: 'Weekends',
    bio: 'Enthusiastic learner and passionate about sharing skills.',
    verified: true,
    banned: false,
    skillsOffered: ['Web Design', 'Public Speaking', 'Drawing'],
    skillsWanted: ['Guitar', 'Cooking', 'Video Editing'],
    swapsCompleted: 12,
    swapsPending: 2,
  },
  {
    id: '2',
    name: 'Jamie Doe',
    location: 'Remote',
    availability: 'Evenings',
    bio: 'Always exploring new hobbies and skills.',
    verified: false,
    banned: false,
    skillsOffered: ['Writing', 'UI Design'],
    skillsWanted: ['Coding', 'Photography'],
    swapsCompleted: 3,
    swapsPending: 5,
  },
  {
    id: '3',
    name: 'Taylor Swift',
    location: 'Offline City',
    availability: 'Weekdays',
    bio: 'Loves sharing creative ideas.',
    verified: false,
    banned: true,
    skillsOffered: ['Music Theory'],
    skillsWanted: ['Dancing'],
    swapsCompleted: 0,
    swapsPending: 0,
  },
];

export default function AdminUserDetailsPage() {
  const [filter, setFilter] = useState<'all' | 'verified' | 'unverified' | 'banned'>('all');

  const filteredUsers = users.filter((u) => {
    if (filter === 'all') return true;
    if (filter === 'verified') return u.verified && !u.banned;
    if (filter === 'unverified') return !u.verified && !u.banned;
    if (filter === 'banned') return u.banned;
    return true;
  });

  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">User Overview</h1>

      <div className="flex gap-3 mb-4">
        <Button variant={filter === 'all' ? 'default' : 'outline'} onClick={() => setFilter('all')}>
          All
        </Button>
        <Button variant={filter === 'verified' ? 'default' : 'outline'} onClick={() => setFilter('verified')}>
          Verified
        </Button>
        <Button variant={filter === 'unverified' ? 'default' : 'outline'} onClick={() => setFilter('unverified')}>
          Unverified
        </Button>
        <Button variant={filter === 'banned' ? 'default' : 'outline'} onClick={() => setFilter('banned')}>
          Banned
        </Button>
      </div>

      <div className="space-y-6">
        {filteredUsers.map((user) => (
          <Card key={user.id} className="p-6 flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile */}
            <div className="flex-shrink-0">
              <Avatar className="h-20 w-20 ring-2 ring-gray-100">
                <AvatarImage src="" alt={user.name} />
                <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
                  {user.name[0]}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Info */}
            <div className="flex-1 w-full space-y-3">
              <div className="flex flex-wrap items-center justify-between">
                <h3 className="font-semibold text-xl">{user.name}</h3>
                <div className="flex gap-2">
                  {user.banned && <Badge variant="destructive">Banned</Badge>}
                  {user.verified && <Badge className="bg-green-100 text-green-800">Verified</Badge>}
                  {!user.verified && !user.banned && <Badge variant="outline">Unverified</Badge>}
                </div>
              </div>

              <div className="flex text-sm text-gray-500 space-x-4">
                <span className="flex items-center">
                  <MapPin className="w-4 h-4 mr-1" />
                  {user.location}
                </span>
                <span className="flex items-center">
                  <Clock className="w-4 h-4 mr-1" />
                  {user.availability}
                </span>
              </div>

              <p className="text-sm text-gray-700">{user.bio}</p>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Skills Offered</h4>
                <div className="flex flex-wrap gap-2">
                  {user.skillsOffered.map((skill) => (
                    <Badge key={skill} className="bg-green-50 text-green-700 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-1">Skills Wanted</h4>
                <div className="flex flex-wrap gap-2">
                  {user.skillsWanted.map((skill) => (
                    <Badge key={skill} variant="outline" className="text-blue-700 border-blue-200 text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-4 mt-4 text-sm text-gray-600">
                <span>Swaps Completed: <strong>{user.swapsCompleted}</strong></span>
                <span>Pending Swaps: <strong>{user.swapsPending}</strong></span>
              </div>
            </div>

            {/* Admin actions */}
            <div className="mt-4 md:mt-0 flex flex-col gap-2 md:ml-auto">
              {!user.verified && !user.banned && (
                <Button size="sm" onClick={() => alert(`Verified ${user.name}`)}>
                  Verify
                </Button>
              )}
              {!user.banned ? (
                <Button size="sm" variant="destructive" onClick={() => alert(`Banned ${user.name}`)}>
                  Ban
                </Button>
              ) : (
                <Button size="sm" disabled>
                  Already Banned
                </Button>
              )}
            </div>
          </Card>
        ))}
      </div>
    </main>
  );
}
