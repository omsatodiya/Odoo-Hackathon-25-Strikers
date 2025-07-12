'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

import { ArrowLeft, Send } from 'lucide-react';
import { useRouter, useParams } from 'next/navigation';
import React from 'react';

const dummyReceiver = {
  id: 'user123',
  name: 'Jordan Smith',
  avatarUrl: '',
  initials: 'JS',
};

const dummyMessages = [
  { id: 1, sender: 'me', text: 'Hey Jordan! Are you still up for the skill swap this weekend?' },
  { id: 2, sender: 'them', text: 'Yes, definitely! I’m excited to learn from you.' },
  { id: 3, sender: 'me', text: 'Awesome! I’ll send you the calendar invite.' },
];

export default function ChatPage() {
  const router = useRouter();
  const params = useParams(); // ✅ get the `id` from route
  const userId = params.id;   // e.g. /chat/[id]

  return (
    <div className="flex flex-col h-screen bg-muted">
      {/* Header */}
      <div className="flex items-center px-4 py-3 bg-white border-b shadow-sm">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => router.back()}
          className="mr-2"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <Avatar className="h-10 w-10 mr-3">
          <AvatarImage src={dummyReceiver.avatarUrl} alt={dummyReceiver.name} />
          <AvatarFallback>{dummyReceiver.initials}</AvatarFallback>
        </Avatar>
        <div>
          <div className="font-medium">{dummyReceiver.name}</div>
          <div className="text-xs text-gray-500">Online</div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 bg-background">
        {dummyMessages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`px-4 py-2 rounded-lg max-w-xs text-sm ${
                msg.sender === 'me'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input */}
      <div className="border-t bg-white p-4">
        <form className="flex items-center gap-2">
          <Input
            type="text"
            placeholder="Type your message..."
            className="flex-1"
          />
          <Button type="submit" size="icon">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
