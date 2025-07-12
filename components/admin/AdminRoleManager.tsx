"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import {
  setUserAsAdmin,
  removeUserAdminRole,
  checkUserAdminRole,
} from "@/lib/admin/roleManagement";
import { Shield, UserCheck, UserX } from "lucide-react";

export default function AdminRoleManager() {
  const [userId, setUserId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [currentRole, setCurrentRole] = useState<"admin" | "user" | null>(null);

  const checkRole = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    setIsLoading(true);
    try {
      const result = await checkUserAdminRole(userId);
      if (result.error) {
        toast.error(result.error);
        setCurrentRole(null);
      } else {
        setCurrentRole(result.isAdmin ? "admin" : "user");
        toast.success(`User role: ${result.isAdmin ? "Admin" : "User"}`);
      }
    } catch {
      toast.error("Failed to check user role");
      setCurrentRole(null);
    } finally {
      setIsLoading(false);
    }
  };

  const grantAdmin = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    setIsLoading(true);
    try {
      const result = await setUserAsAdmin(userId);
      if (result.success) {
        toast.success("Admin role granted successfully");
        setCurrentRole("admin");
      } else {
        toast.error(result.error || "Failed to grant admin role");
      }
    } catch {
      toast.error("Failed to grant admin role");
    } finally {
      setIsLoading(false);
    }
  };

  const removeAdmin = async () => {
    if (!userId.trim()) {
      toast.error("Please enter a user ID");
      return;
    }

    setIsLoading(true);
    try {
      const result = await removeUserAdminRole(userId);
      if (result.success) {
        toast.success("Admin role removed successfully");
        setCurrentRole("user");
      } else {
        toast.error(result.error || "Failed to remove admin role");
      }
    } catch {
      toast.error("Failed to remove admin role");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Shield className="w-5 h-5" />
          Admin Role Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <label htmlFor="userId" className="text-sm font-medium block mb-2">
            User ID
          </label>
          <Input
            id="userId"
            placeholder="Enter user ID to manage"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            disabled={isLoading}
          />
        </div>

        {currentRole && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Current Role:</span>
            <Badge variant={currentRole === "admin" ? "default" : "secondary"}>
              {currentRole === "admin" ? "Admin" : "User"}
            </Badge>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <Button
            onClick={checkRole}
            disabled={isLoading || !userId.trim()}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            Check Role
          </Button>
          <Button
            onClick={grantAdmin}
            disabled={isLoading || !userId.trim() || currentRole === "admin"}
            size="sm"
            className="flex-1"
          >
            <UserCheck className="w-4 h-4 mr-2" />
            Grant Admin
          </Button>
          <Button
            onClick={removeAdmin}
            disabled={isLoading || !userId.trim() || currentRole === "user"}
            variant="destructive"
            size="sm"
            className="flex-1"
          >
            <UserX className="w-4 h-4 mr-2" />
            Remove Admin
          </Button>
        </div>

        <div className="text-xs text-gray-500 mt-4">
          <p className="font-medium mb-1">Instructions:</p>
          <ul className="space-y-1">
            <li>• Enter a user ID to check their current role</li>
            <li>• Grant admin access to trusted users only</li>
            <li>• Remove admin access if needed</li>
            <li>• Changes take effect immediately</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
