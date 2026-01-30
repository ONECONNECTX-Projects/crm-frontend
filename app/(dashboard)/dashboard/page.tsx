"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from "recharts";
import { Building2, Contact, TrendingUp, User } from "lucide-react";

export function Card({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl shadow p-4 bg-white ${className || ""}`}>
      {children}
    </div>
  );
}

export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return <div className={className}>{children}</div>;
}
// ----------------------- Dummy Data -----------------------
const transactionData = [
  { month: "Jan", value: 4500 },
  { month: "Feb", value: 5000 },
  { month: "Mar", value: 7000 },
  { month: "Apr", value: 5500 },
  { month: "May", value: 6500 },
  { month: "Jun", value: 9000 },
  { month: "Jul", value: 12000 },
  { month: "Aug", value: 21000 },
  { month: "Sep", value: 23000 },
  { month: "Oct", value: 17000 },
  { month: "Nov", value: 16500 },
  { month: "Dec", value: 35000 },
];

const ticketStatus = [
  { name: "Closed", value: 10 },
  { name: "In-progress", value: 7 },
  { name: "Need information", value: 5 },
  { name: "Open", value: 12 },
  { name: "Pending", value: 4 },
  { name: "Resolved", value: 9 },
];

const COLORS = [
  "#ef4444",
  "#ec4899",
  "#CC6118",
  "#01558C",
  "#8b5cf6",
  "#22c55e",
]; // red, pink, accent-orange, brand-blue, purple, green

const recentQuotes = [
  "Cloud Migration",
  "Website Redesign",
  "Annual Support Package",
  "Hello",
];

const contacts = [
  { name: "Sara Khan", email: "sara.khan@greenfields.example" },
  { name: "Carlos Mendez", email: "carlos.mendez@technova.example" },
  { name: "Aisha Rahman", email: "aisha.rahman@omega-solutions.example" },
  { name: "John Doe", email: "example@gmail.com" },
];

// ----------------------- Dashboard Component -----------------------
export default function Dashboard() {
  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-600">Dashboard</h1>
      <p className="text-gray-600">
        Track your business metrics and performance
      </p>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-4">
        {[
          {
            title: "Total Leads",
            count: 4,
            subtitle: "Active Leads",
            color: "from-brand-400 to-brand-600",
            icon: <User className="w-7 h-7 text-white" />,
          },
          {
            title: "Total Contact",
            count: 4,
            subtitle: "Registered Contacts",
            color: "from-purple-500 to-purple-700",
            icon: <Contact className="w-7 h-7 text-white" />,
          },
          {
            title: "Total Company",
            count: 4,
            subtitle: "Registered Companies",
            color: "from-accent-brand-400 to-accent-brand-600",
            icon: <Building2 className="w-7 h-7 text-white" />,
          },
          {
            title: "Opportunities",
            count: 1,
            subtitle: "Open Opportunities",
            color: "from-pink-500 to-pink-700",
            icon: <TrendingUp className="w-7 h-7 text-white" />,
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Card
              className={`bg-gradient-to-r ${item.color} text-white rounded-2xl p-4 shadow-lg`}
            >
              <CardContent className="relative">
                {/* ICON */}
                <div className="absolute top-4 right-4 bg-white/20 p-2 rounded-xl">
                  {item.icon}
                </div>

                <h2 className="text-sm opacity-80">{item.title}</h2>
                <p className="text-4xl font-bold mt-2">{item.count}</p>
                <p className="text-sm opacity-80 mt-1">{item.subtitle}</p>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Sales + Ticket Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Sales Overview */}
        <Card className="rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-600">
            Sales Overview
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={transactionData}>
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="value" fill="#01558C" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        {/* Ticket Status */}
        <Card className="rounded-2xl p-4">
          <h3 className="text-lg font-semibold mb-4 text-gray-600">
            Ticket Status
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />

              <Pie
                data={ticketStatus}
                dataKey="value"
                nameKey="name"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                labelLine={false}
                label={({ percent }) =>
                  percent ? `${(percent * 100).toFixed(0)}%` : "0%"
                }
              >
                {ticketStatus.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index]} />
                ))}
              </Pie>

              {/* LEGEND BELOW */}
              <Legend
                verticalAlign="bottom"
                align="center"
                layout="horizontal"
                iconType="circle"
                wrapperStyle={{
                  paddingTop: "20px",
                  fontSize: "14px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Quotes + Contacts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Recent Quotes */}
        <Card className="rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-600">
              Recent Quotes
            </h3>
            <button className="text-brand-500">View All →</button>
          </div>

          <div className="mt-4 space-y-4">
            {recentQuotes.map((item, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{item}</p>
                  <p className="text-sm text-gray-500">demo</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Recent Contacts */}
        <Card className="rounded-2xl p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-600">
              Recent Contacts
            </h3>
            <button className="text-brand-500">View All →</button>
          </div>

          <div className="mt-4 space-y-4">
            {contacts.map((user, index) => (
              <div
                key={index}
                className="p-4 rounded-xl bg-gray-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{user.name}</p>
                  <p className="text-sm text-gray-500">{user.email}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}
