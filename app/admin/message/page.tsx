'use client';

import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

export default function AdminPostMessagePage() {
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handlePostMessage = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error('Both title and message body are required.');
      return;
    }

    setSubmitting(true);

    try {
      // Replace this with your actual backend call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success('Message sent to all users!');
      setTitle('');
      setBody('');
    } catch (err) {
      toast.error('Failed to send message.' + err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="container max-w-2xl mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">Send Platform-wide Message</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label htmlFor="title" className="text-sm font-medium">
              Title
            </label>
            <Input
              id="title"
              placeholder="e.g. Scheduled Maintenance"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              disabled={submitting}
            />
          </div>

          <div>
            <label htmlFor="body" className="text-sm font-medium">
              Message Body
            </label>
            <Textarea
              id="body"
              placeholder="Write your message here..."
              rows={5}
              value={body}
              onChange={(e) => setBody(e.target.value)}
              disabled={submitting}
            />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={handlePostMessage} disabled={submitting}>
            {submitting ? 'Sending...' : 'Send Message'}
          </Button>
        </CardFooter>
      </Card>
    </main>
  );
}
