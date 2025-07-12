"use client";

import { Request } from "@/types";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";

interface RequestCardProps {
  request: Request;
  type: "sent" | "received";
  onAccept?: () => void;
  onReject?: () => void;
  onDelete?: () => void;
}

export default function RequestCard({
  request,
  type,
  onAccept,
  onReject,
  onDelete,
}: RequestCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
        return "bg-green-500";
      case "rejected":
        return "bg-red-500";
      default:
        return "bg-yellow-500";
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-4">
            <Avatar>
              <AvatarImage
                src={
                  type === "sent"
                    ? request.receiverAvatar
                    : request.senderAvatar
                }
              />
              <AvatarFallback>
                {type === "sent"
                  ? request.receiverName.charAt(0)
                  : request.senderName.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold">
                {type === "sent" ? request.receiverName : request.senderName}
              </h3>
              <div className="mt-1 text-sm text-gray-500">
                <p>Offering: {request.skillOffered}</p>
                <p>Requesting: {request.skillWanted}</p>
                {request.message && (
                  <p className="mt-2 italic">Message: {request.message}</p>
                )}
              </div>
            </div>
          </div>
          <Badge className={getStatusColor(request.status)}>
            {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
          </Badge>
        </div>
        {type === "received" && request.status === "pending" && (
          <div className="mt-4 flex justify-end space-x-2">
            <Button variant="outline" onClick={onReject}>
              Reject
            </Button>
            <Button onClick={onAccept}>Accept</Button>
          </div>
        )}
        {type === "sent" && request.status === "pending" && (
          <div className="mt-4 flex justify-end">
            <Button variant="destructive" onClick={onDelete}>
              Delete Request
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
