import React from "react";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import MessageFormClient from "@/components/admin/MessageFormClient";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";

export default function AdminPostMessagePage() {
  return (
    <AdminLayoutWrapper activePage="message">
      <div className="w-full max-w-2xl mx-auto">
        <Card className="bg-white/90 backdrop-blur-sm border-0 shadow-lg">
          <CardHeader className="p-4 lg:p-6">
            <CardTitle className="text-lg lg:text-xl">
              Send Platform-wide Message
            </CardTitle>
          </CardHeader>
          <MessageFormClient />
        </Card>
      </div>
    </AdminLayoutWrapper>
  );
}
