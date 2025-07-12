import { getFirestore, collection, getDocs } from "firebase/firestore";
import { app } from "@/lib/firebase";
import { UserData, MonthData, DashboardData } from "@/types/admin";

export function generateUserGrowthData(users: UserData[]) {
  const now = new Date();
  const months: MonthData[] = [];

  // Generate last 6 months
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const monthName = date.toLocaleDateString("en-US", { month: "short" });
    months.push({ month: monthName, date, users: 0 });
  }

  // Count users by month based on createdAt
  users.forEach((user) => {
    let userDate: Date;

    if (user.createdAt) {
      // Handle Firestore timestamp or string date
      if (typeof user.createdAt === "string") {
        userDate = new Date(user.createdAt);
      } else if (user.createdAt.toDate) {
        // Firestore timestamp
        userDate = user.createdAt.toDate();
      } else {
        // Fallback to current date
        userDate = new Date();
      }
    } else {
      // If no createdAt, distribute randomly across last 6 months
      const randomDaysAgo = Math.floor(Math.random() * 180); // 6 months
      userDate = new Date(now.getTime() - randomDaysAgo * 24 * 60 * 60 * 1000);
    }

    // Find the corresponding month and increment count
    const monthIndex = months.findIndex(
      (m) =>
        m.date.getMonth() === userDate.getMonth() &&
        m.date.getFullYear() === userDate.getFullYear()
    );

    if (monthIndex !== -1) {
      months[monthIndex].users++;
    }
  });

  // Calculate cumulative growth
  let cumulative = 0;
  return months.map((month) => {
    cumulative += month.users;
    return {
      month: month.month,
      users: cumulative,
    };
  });
}

export async function fetchDashboardData(): Promise<DashboardData> {
  const db = getFirestore(app);

  try {
    // Fetch users data
    const usersSnapshot = await getDocs(collection(db, "users"));
    const users = usersSnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt || doc.data().created_at || null,
    })) as UserData[];

    // Count verified and banned users
    const verifiedUsers = users.filter((user) => user.isVerified).length;
    const bannedUsers = users.filter((user) => user.isBanned).length;
    const totalUsers = users.length;
    const unverifiedUsers = totalUsers - verifiedUsers - bannedUsers;

    // Mock swap data (replace with actual swaps collection when available)
    const swapStats = [
      { name: "Pending", count: 12, color: "#FFC107" },
      { name: "Accepted", count: 45, color: "#4CAF50" },
      { name: "Completed", count: 30, color: "#2196F3" },
      { name: "Rejected", count: 8, color: "#F44336" },
    ];

    // Generate real-time user growth data
    const userGrowth = generateUserGrowthData(users);

    return {
      swapStats,
      userGrowth,
      totalUsers,
      verifiedUsers,
      bannedUsers,
      unverifiedUsers,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return {
      swapStats: [],
      userGrowth: [],
      totalUsers: 0,
      verifiedUsers: 0,
      bannedUsers: 0,
      unverifiedUsers: 0,
    };
  }
} 