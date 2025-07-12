'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

export default function CreateRequestPage() {
  // Simulated data (replace with real data from context or props later)
  const yourOfferedSkills = ['React', 'UI/UX Design', 'JavaScript'];
  const theirWantedSkills = ['Photography', 'Public Speaking', 'Cooking'];

  const [yourSkill, setYourSkill] = useState('');
  const [theirSkill, setTheirSkill] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (!yourSkill || !theirSkill || !message.trim()) {
      alert('Please complete all fields.');
      return;
    }

    // You would typically call your backend API here
    alert(`Request sent!\n\nYou will teach: ${yourSkill}\nYou want to learn: ${theirSkill}\nMessage: ${message}`);
    setYourSkill('');
    setTheirSkill('');
    setMessage('');
  };

  return (
    <main className="container max-w-xl mx-auto px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Create a Skill Swap Request</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Your Offered Skill */}
          <div>
            <Label htmlFor="yourSkill" className="block mb-1">Select a skill you can teach</Label>
            <Select value={yourSkill} onValueChange={setYourSkill}>
              <SelectTrigger id="yourSkill">
                <SelectValue placeholder="Choose your offered skill" />
              </SelectTrigger>
              <SelectContent>
                {yourOfferedSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Their Wanted Skill */}
          <div>
            <Label htmlFor="theirSkill" className="block mb-1">Select a skill you want to learn</Label>
            <Select value={theirSkill} onValueChange={setTheirSkill}>
              <SelectTrigger id="theirSkill">
                <SelectValue placeholder="Choose their wanted skill" />
              </SelectTrigger>
              <SelectContent>
                {theirWantedSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Message */}
          <div>
            <Label htmlFor="message" className="block mb-1">Message</Label>
            <Textarea
              id="message"
              placeholder="Write a message to introduce yourself or explain your request..."
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
            />
          </div>

          {/* Send Button */}
          <Button onClick={handleSubmit} className="w-full" disabled={!yourSkill || !theirSkill || !message.trim()}>
            Send Request
          </Button>
        </CardContent>
      </Card>
    </main>
  );
}
