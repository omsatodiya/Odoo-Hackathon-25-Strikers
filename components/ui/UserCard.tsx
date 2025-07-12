'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { MapPin, Clock } from 'lucide-react';

export default function UserCard() {
  return (
    <Card className="w-full flex flex-col md:flex-row items-center md:items-start p-6 gap-6 shadow-sm">
      {/* Left: Profile Avatar */}
      <div className="flex-shrink-0">
        <Avatar className="h-20 w-20 ring-2 ring-gray-100">
          <AvatarImage src="" alt="User" />
          <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-xl">
            A
          </AvatarFallback>
        </Avatar>
      </div>

      {/* Middle: Info */}
      <div className="flex-1 w-full space-y-3">
        <div>
          <h3 className="font-semibold text-xl text-gray-900">Alex Example</h3>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            Placeholder City
          </div>
          <div className="text-sm text-gray-500 flex items-center mt-1">
            <Clock className="w-4 h-4 mr-1" />
            Weekends
          </div>
        </div>

        <p className="text-sm text-gray-600">
          Enthusiastic learner and passionate about sharing skills with the community.
        </p>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Skills Offered</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 hover:bg-green-100">Web Design</Badge>
            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 hover:bg-green-100">Public Speaking</Badge>
            <Badge variant="secondary" className="text-xs bg-green-50 text-green-700 hover:bg-green-100">Drawing</Badge>
          </div>
        </div>

        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-1">Skills Wanted</h4>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50">Guitar</Badge>
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50">Cooking</Badge>
            <Badge variant="outline" className="text-xs border-blue-200 text-blue-700 hover:bg-blue-50">Video Editing</Badge>
          </div>
        </div>
      </div>

      {/* Right: Request Button */}
      <div className="mt-4 md:mt-0 md:ml-auto">
        <Button variant="default">Request</Button>
      </div>
    </Card>
  );
}
