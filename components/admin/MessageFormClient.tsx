"use client";

import React, { useState, useEffect } from "react";
import { CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useGSAP } from "@/hooks/useGSAP";

export default function MessageFormClient() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { animateStagger } = useGSAP();

  // Animate form elements when component mounts
  useEffect(() => {
    animateStagger(".form-element", { delay: 0.2, stagger: 0.1 });
  }, [animateStagger]);

  const handlePostMessage = async () => {
    if (!title.trim() || !body.trim()) {
      toast.error("Both title and message body are required.");
      return;
    }

    setSubmitting(true);

    try {
      // Replace this with your actual backend call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("Message sent to all users!");
      setTitle("");
      setBody("");
    } catch (err) {
      toast.error("Failed to send message." + err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <CardContent className="space-y-4 p-4 lg:p-6">
        <div className="form-element">
          <label htmlFor="title" className="text-sm font-medium block mb-2">
            Title
          </label>
          <Input
            id="title"
            placeholder="e.g. Scheduled Maintenance"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
            className="w-full"
          />
        </div>

        <div className="form-element">
          <label htmlFor="body" className="text-sm font-medium block mb-2">
            Message Body
          </label>
          <Textarea
            id="body"
            placeholder="Write your message here..."
            rows={5}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            disabled={submitting}
            className="w-full resize-none"
          />
        </div>
      </CardContent>

      <CardFooter className="flex justify-end p-4 lg:p-6 pt-0">
        <div className="form-element">
          <Button
            onClick={handlePostMessage}
            disabled={submitting}
            className="w-full sm:w-auto"
          >
            {submitting ? "Sending..." : "Send Message"}
          </Button>
        </div>
      </CardFooter>
    </>
  );
}
