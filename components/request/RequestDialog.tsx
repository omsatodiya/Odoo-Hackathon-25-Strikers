"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface RequestDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: {
    skillOffered: string;
    skillWanted: string;
    message: string;
  }) => void;
  userSkills: string[];
  recipientSkills: string[];
}

export default function RequestDialog({
  isOpen,
  onClose,
  onSubmit,
  userSkills,
  recipientSkills,
}: RequestDialogProps) {
  const [skillOffered, setSkillOffered] = useState("");
  const [skillWanted, setSkillWanted] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = () => {
    onSubmit({ skillOffered, skillWanted, message });
    setSkillOffered("");
    setSkillWanted("");
    setMessage("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create Swap Request</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="skill-offered">Skill you&apos;ll teach</Label>
            <Select value={skillOffered} onValueChange={setSkillOffered}>
              <SelectTrigger id="skill-offered">
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {userSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="skill-wanted">Skill you want to learn</Label>
            <Select value={skillWanted} onValueChange={setSkillWanted}>
              <SelectTrigger id="skill-wanted">
                <SelectValue placeholder="Select a skill" />
              </SelectTrigger>
              <SelectContent>
                {recipientSkills.map((skill) => (
                  <SelectItem key={skill} value={skill}>
                    {skill}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="message">Message (optional)</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a message to the recipient..."
            />
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!skillOffered || !skillWanted}
          >
            Send Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
