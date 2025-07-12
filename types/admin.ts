export interface UserData {
  id: string;
  isVerified?: boolean;
  isBanned?: boolean;
  createdAt?: string | any;
  [key: string]: any;
}

export interface MonthData {
  month: string;
  date: Date;
  users: number;
}

export interface SwapStat {
  name: string;
  count: number;
  color: string;
}

export interface UserGrowthData {
  month: string;
  users: number;
}

export interface DashboardData {
  swapStats: SwapStat[];
  userGrowth: UserGrowthData[];
  totalUsers: number;
  verifiedUsers: number;
  bannedUsers: number;
  unverifiedUsers: number;
} 