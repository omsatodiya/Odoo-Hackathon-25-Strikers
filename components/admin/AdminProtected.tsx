"use client";

import { useAdminAuth } from "@/hooks/useAdminAuth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Shield, AlertTriangle } from "lucide-react";

interface AdminProtectedProps {
  children: React.ReactNode;
}

export default function AdminProtected({ children }: AdminProtectedProps) {
  const { isAdmin, isLoading, error } = useAdminAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl">Verifying Admin Access</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            </div>
            <p className="text-gray-600">
              Please wait while we verify your admin privileges...
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4 bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="text-center">
            <div className="flex justify-center mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-6 h-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-xl text-red-600">
              Access Denied
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <Alert className="mb-4">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                {error || "You do not have permission to access this area."}
              </AlertDescription>
            </Alert>
            <p className="text-gray-600 text-sm">
              This area is restricted to administrators only. Please contact
              your system administrator if you believe this is an error.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
}
