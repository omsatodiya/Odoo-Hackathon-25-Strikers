'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface Swap {
  id: string;
  fromUser: {
    name: string;
    avatar?: string;
    skill: string;
  };
  toUser: {
    name: string;
    avatar?: string;
    skill: string;
  };
  status: 'pending' | 'accepted' | 'completed' | 'rejected';
  createdAt: Date;
}

const swapData: Swap[] = [
  {
    id: '1',
    fromUser: {
      name: 'Alice',
      skill: 'Graphic Design',
    },
    toUser: {
      name: 'Bob',
      skill: 'React.js',
    },
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hrs ago
  },
  {
    id: '2',
    fromUser: {
      name: 'Charlie',
      skill: 'Photography',
    },
    toUser: {
      name: 'Diana',
      skill: 'Guitar',
    },
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: '3',
    fromUser: {
      name: 'Eli',
      skill: 'Cooking',
    },
    toUser: {
      name: 'Fiona',
      skill: 'Yoga',
    },
    status: 'accepted',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hrs ago
  },
];

const formatTimeAgo = (date: Date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 3600000);
  return diff < 24 ? `${diff} hour${diff === 1 ? '' : 's'} ago` : `${Math.floor(diff / 24)} day${diff / 24 === 1 ? '' : 's'} ago`;
};

const getStatusBadge = (status: Swap['status']) => {
  const statusMap = {
    pending: { text: 'Pending', color: 'bg-yellow-100 text-yellow-700', icon: Clock },
    accepted: { text: 'Accepted', color: 'bg-blue-100 text-blue-700', icon: RefreshCw },
    completed: { text: 'Completed', color: 'bg-green-100 text-green-700', icon: CheckCircle },
    rejected: { text: 'Rejected', color: 'bg-red-100 text-red-700', icon: XCircle },
  };

  const { text, color, icon: Icon } = statusMap[status];
  return (
    <Badge className={`flex items-center gap-1 ${color}`}>
      <Icon className="w-3 h-3" />
      {text}
    </Badge>
  );
};

export default function AdminSwapsPage() {
  return (
    <main className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">All Skill Swaps</h1>

      <div className="space-y-6">
        {swapData.map((swap) => (
          <Card key={swap.id} className="p-6 shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">Swap ID: {swap.id}</CardTitle>
                {getStatusBadge(swap.status)}
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* From User */}
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-indigo-500 text-white">
                        {swap.fromUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{swap.fromUser.name}</p>
                      <p className="text-sm text-gray-500">Offered: {swap.fromUser.skill}</p>
                    </div>
                  </div>
                </div>

                {/* To User */}
                <div className="border rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-10 w-10">
                      <AvatarFallback className="bg-purple-500 text-white">
                        {swap.toUser.name[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold">{swap.toUser.name}</p>
                      <p className="text-sm text-gray-500">Requested: {swap.toUser.skill}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-sm text-gray-500">
                Created: {formatTimeAgo(swap.createdAt)}
              </div>

              {/* Optional Admin Actions */}
              <div className="flex gap-3">
                {swap.status === 'pending' && (
                  <Button size="sm" variant="outline">
                    Cancel Swap
                  </Button>
                )}
                {swap.status === 'accepted' && (
                  <Button size="sm" variant="default">
                    Mark as Completed
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  );
}
