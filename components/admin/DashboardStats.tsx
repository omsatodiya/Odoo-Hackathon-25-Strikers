"use client";

import { useEffect } from "react";
import StatsCard from "./StatsCard";
import { DashboardData } from "@/types/admin";
import { useGSAP } from "@/hooks/useGSAP";

interface DashboardStatsProps {
  data: Pick<
    DashboardData,
    "totalUsers" | "verifiedUsers" | "bannedUsers" | "unverifiedUsers"
  >;
}

export default function DashboardStats({ data }: DashboardStatsProps) {
  const { animateStagger } = useGSAP();

  // Animate stats cards when component mounts or data changes
  useEffect(() => {
    animateStagger(".stats-card", { delay: 0.3, stagger: 0.1 });
  }, [data, animateStagger]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6">
      <div className="stats-card">
        <StatsCard title="Total Users" value={data.totalUsers} />
      </div>
      <div className="stats-card">
        <StatsCard
          title="Verified Users"
          value={data.verifiedUsers}
          color="green"
        />
      </div>
      <div className="stats-card">
        <StatsCard
          title="Unverified Users"
          value={data.unverifiedUsers}
          color="yellow"
        />
      </div>
      <div className="stats-card">
        <StatsCard title="Banned Users" value={data.bannedUsers} color="red" />
      </div>
    </div>
  );
}
