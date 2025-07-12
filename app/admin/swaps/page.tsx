import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Clock, CheckCircle, XCircle } from "lucide-react";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

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
  status: "pending" | "accepted" | "completed" | "rejected";
  createdAt: Date;
}

const swapData: Swap[] = [
  {
    id: "1",
    fromUser: {
      name: "Alice",
      skill: "Graphic Design",
    },
    toUser: {
      name: "Bob",
      skill: "React.js",
    },
    status: "pending",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5), // 5 hrs ago
  },
  {
    id: "2",
    fromUser: {
      name: "Charlie",
      skill: "Photography",
    },
    toUser: {
      name: "Diana",
      skill: "Guitar",
    },
    status: "completed",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), // 2 days ago
  },
  {
    id: "3",
    fromUser: {
      name: "Eli",
      skill: "Cooking",
    },
    toUser: {
      name: "Fiona",
      skill: "Yoga",
    },
    status: "accepted",
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8), // 8 hrs ago
  },
];

const formatTimeAgo = (date: Date) => {
  const diff = Math.floor((Date.now() - date.getTime()) / 3600000);
  return diff < 24
    ? `${diff} hour${diff === 1 ? "" : "s"} ago`
    : `${Math.floor(diff / 24)} day${diff / 24 === 1 ? "" : "s"} ago`;
};

const getStatusBadge = (status: Swap["status"]) => {
  const statusMap = {
    pending: {
      text: "Pending",
      color: "bg-yellow-100 text-yellow-700",
      icon: Clock,
    },
    accepted: {
      text: "Accepted",
      color: "bg-blue-100 text-blue-700",
      icon: Clock,
    },
    completed: {
      text: "Completed",
      color: "bg-green-100 text-green-700",
      icon: CheckCircle,
    },
    rejected: {
      text: "Rejected",
      color: "bg-red-100 text-red-700",
      icon: XCircle,
    },
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
    <AdminLayoutWrapper activePage="swaps">
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-6">
          All Skill Swaps
        </h1>

        <div className="space-y-4 lg:space-y-6">
          {swapData.map((swap) => (
            <Card
              key={swap.id}
              className="p-4 lg:p-6 shadow-sm bg-white/90 backdrop-blur-sm border-0"
            >
              <CardHeader className="pb-3 lg:pb-4">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <CardTitle className="text-base lg:text-lg">
                    Swap ID: {swap.id}
                  </CardTitle>
                  {getStatusBadge(swap.status)}
                </div>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
                  {/* From User */}
                  <div className="border rounded-lg p-3 lg:p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                        <AvatarFallback className="bg-indigo-500 text-white text-sm lg:text-base">
                          {swap.fromUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm lg:text-base">
                          {swap.fromUser.name}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-500">
                          Offered: {swap.fromUser.skill}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* To User */}
                  <div className="border rounded-lg p-3 lg:p-4 space-y-2">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-8 w-8 lg:h-10 lg:w-10">
                        <AvatarFallback className="bg-purple-500 text-white text-sm lg:text-base">
                          {swap.toUser.name[0]}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm lg:text-base">
                          {swap.toUser.name}
                        </p>
                        <p className="text-xs lg:text-sm text-gray-500">
                          Requested: {swap.toUser.skill}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="text-xs lg:text-sm text-gray-500">
                  Created: {formatTimeAgo(swap.createdAt)}
                </div>

                {/* Optional Admin Actions */}
                <div className="flex gap-2 lg:gap-3">
                  {swap.status === "pending" && (
                    <Button
                      size="sm"
                      variant="outline"
                      className="text-xs lg:text-sm"
                    >
                      Cancel Swap
                    </Button>
                  )}
                  {swap.status === "accepted" && (
                    <Button
                      size="sm"
                      variant="default"
                      className="text-xs lg:text-sm"
                    >
                      Mark as Completed
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AdminLayoutWrapper>
  );
}
