'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';

export default function UserDetailPage() {
  // Dummy user data to display
  const user = {
    id: 'user123',
    name: 'Alice Johnson',
    avatarInitials: 'AJ',
    bio: "Hi! I'm Alice, a passionate React developer and designer. Looking to exchange skills and collaborate!",
    skillsCanTeach: ['React', 'UI/UX Design', 'TypeScript'],
    skillsWantToLearn: ['Photography', 'Public Speaking'],
  };

  // Dialog state to show "Request" form/modal
  const [requestDialogOpen, setRequestDialogOpen] = useState(false);
  const [message, setMessage] = useState('');

  // For now, just a dummy submit handler
  const handleRequestSubmit = () => {
    alert(`Request sent to ${user.name} with message: "${message}"`);
    setRequestDialogOpen(false);
    setMessage('');
  };

  return (
    <main className="container max-w-3xl mx-auto px-4 py-8">
      <Card>
        <CardHeader className="flex items-center space-x-6">
          <Avatar className="h-20 w-20">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white text-3xl font-bold">
              {user.avatarInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">{user.name}</CardTitle>
            <CardDescription className="mt-1 text-gray-600">{user.bio}</CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Skills I Can Teach</h3>
            <ul className="list-disc list-inside space-y-1 text-green-700">
              {user.skillsCanTeach.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Skills I Want to Learn</h3>
            <ul className="list-disc list-inside space-y-1 text-blue-700">
              {user.skillsWantToLearn.map((skill) => (
                <li key={skill}>{skill}</li>
              ))}
            </ul>
          </div>

          <Dialog open={requestDialogOpen} onOpenChange={setRequestDialogOpen}>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full">
                Request Skill Swap
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Send a Request to {user.name}</DialogTitle>
              </DialogHeader>
              <Textarea
                placeholder="Write a message to introduce yourself or explain your request"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
              />
              <DialogFooter>
                <Button onClick={handleRequestSubmit} disabled={!message.trim()}>
                  Send Request
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardContent>
      </Card>
    </main>
  );
}
