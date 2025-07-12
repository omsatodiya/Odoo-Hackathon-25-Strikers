import React from "react";
import { fetchDashboardData } from "@/lib/admin/dashboard";
import AdminLayoutWrapper from "@/components/admin/AdminLayoutWrapper";
import DashboardHeader from "@/components/admin/DashboardHeader";
import DashboardStats from "@/components/admin/DashboardStats";
import DashboardCharts from "@/components/admin/DashboardCharts";

export default async function AdminDashboardPage() {
  const data = await fetchDashboardData();

  return (
    <AdminLayoutWrapper activePage="dashboard">
      <DashboardHeader />
      <DashboardStats data={data} />
      <DashboardCharts
        data={{ swapStats: data.swapStats, userGrowth: data.userGrowth }}
      />
    </AdminLayoutWrapper>
  );
}
