'use client';

import React from 'react';
import Link from 'next/link';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from '@/components/ui/card';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts';

const swapStats = [
  { name: 'Pending', count: 12 },
  { name: 'Accepted', count: 45 },
  { name: 'Completed', count: 30 },
  { name: 'Rejected', count: 8 },
];

const userGrowth = [
  { month: 'Jan', users: 10 },
  { month: 'Feb', users: 25 },
  { month: 'Mar', users: 40 },
  { month: 'Apr', users: 60 },
  { month: 'May', users: 85 },
  { month: 'Jun', users: 110 },
];

const COLORS = ['#FFC107', '#4CAF50', '#2196F3', '#F44336'];

export default function AdminDashboardPage() {
  return (
    <main className="flex">
      {/* Sidebar */}
      <aside className="w-60 border-r h-screen sticky top-0 p-6 bg-gray-50">
        <h2 className="text-lg font-semibold mb-6">Admin Panel</h2>
        <nav className="space-y-4">
          <Link
            href="/admin/users"
            className="block text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            👥 Manage Users
          </Link>
          <Link
            href="/admin/swaps"
            className="block text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            🔄 Monitor Swaps
          </Link>
          <Link
            href="/admin/message"
            className="block text-sm font-medium text-gray-700 hover:text-blue-600"
          >
            📢 Send Message
          </Link>
        </nav>
      </aside>

      {/* Main Content */}
      <section className="flex-1 p-8 space-y-8">
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {swapStats.map((stat) => (
            <Card key={stat.name} className="text-center">
              <CardHeader>
                <CardTitle className="text-xl">{stat.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <span className="text-3xl font-bold">{stat.count}</span>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>User Growth (Last 6 Months)</CardTitle>
            </CardHeader>
            <CardContent style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={userGrowth}>
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="users" fill="#3B82F6" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Swap Request Breakdown</CardTitle>
            </CardHeader>
            <CardContent style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={swapStats}
                    dataKey="count"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {swapStats.map((entry, index) => (
                      <Cell
                        key={entry.name}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}
