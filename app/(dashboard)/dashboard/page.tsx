"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { Building2, Contact, TrendingUp, User, Loader2 } from "lucide-react";
import {
  DashboardData,
  getDashboardSummary,
} from "@/app/services/dashboard/dashboard.service";

const COLORS = [
  "#01558C",
  "#22c55e",
  "#8b5cf6",
  "#CC6118",
  "#ec4899",
  "#ef4444",
];

// Look-up table to fix Tailwind Purging
const bgGradients: Record<string, string> = {
  "Total Leads": "from-blue-400 to-blue-600",
  "Total Contact": "from-purple-500 to-purple-700",
  "Total Company": "from-orange-400 to-orange-600",
  Opportunities: "from-pink-500 to-pink-700",
};

export default function Dashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await getDashboardSummary();
        if (response.isSuccess) {
          setData(response.data || null);
        }
      } catch (error) {
        console.error("Dashboard Load Error:", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6  bg-white min-h-screen">
      <div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800">
          Dashboard
        </h1>
        <p className="text-sm sm:text-base text-gray-500">
          Track your business metrics and performance
        </p>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
        {data?.stats?.map((item, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative overflow-hidden rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-lg text-white bg-gradient-to-r ${bgGradients[item.title] || "from-gray-400 to-gray-600"}`}
          >
            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-xs sm:text-sm font-medium opacity-80">
                    {item.title}
                  </p>
                  <h3 className="text-2xl sm:text-3xl font-bold mt-1">
                    {item.count}
                  </h3>
                </div>
                <div className="bg-white/20 p-1.5 sm:p-2 rounded-lg">
                  {item.title.includes("Lead") && (
                    <User className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                  {item.title.includes("Contact") && (
                    <Contact className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                  {item.title.includes("Company") && (
                    <Building2 className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                  {item.title.includes("Opp") && (
                    <TrendingUp className="w-5 h-5 sm:w-6 sm:h-6" />
                  )}
                </div>
              </div>
              <p className="text-xs mt-3 sm:mt-4 opacity-70">{item.subtitle}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        {/* Task Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Task Status Distribution
          </h3>
          <ResponsiveContainer
            width="100%"
            height={200}
            className="sm:!h-[250px]"
          >
            <PieChart>
              <Pie
                data={data?.taskStatusDistribution?.map((item) => ({
                  ...item,
                }))}
                dataKey="value"
                nameKey="name"
                innerRadius={50}
                outerRadius={70}
                paddingAngle={5}
              >
                {data?.taskStatusDistribution?.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend verticalAlign="bottom" height={36} />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Ticket Chart */}
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Ticket Status
          </h3>
          <ResponsiveContainer
            width="100%"
            height={200}
            className="sm:!h-[250px]"
          >
            {data?.ticketStatusDistribution &&
              data.ticketStatusDistribution.some((item) => item.value > 0) ? (
              <PieChart>
                <Tooltip />
                <Pie
                  data={data.ticketStatusDistribution?.map((item) => ({
                    ...item,
                  }))}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={50}
                  outerRadius={70}
                  paddingAngle={5}
                >
                  {data.ticketStatusDistribution.map((_, i) => (
                    <Cell key={i} fill={COLORS[(i + 2) % COLORS.length]} />
                  ))}
                </Pie>
                <Legend verticalAlign="bottom" iconType="circle" />
              </PieChart>
            ) : (
              /* Fallback UI when no data is found */
              <div className="flex flex-col items-center justify-center h-full space-y-2">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full border-4 border-dashed border-gray-200 flex items-center justify-center">
                  <span className="text-gray-300 text-xs">0%</span>
                </div>
                <p className="text-gray-400 text-sm font-medium">
                  No Data Found
                </p>
              </div>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-4 md:gap-6">
        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Recent Quotes
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {data?.recentQuotes?.map((quote: any, i: number) => (
              <div
                key={i}
                className="flex justify-between items-center p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl"
              >
                <span className="font-medium text-sm sm:text-base text-gray-700 truncate mr-2">
                  {quote.name}
                </span>
                <span className="text-blue-600 font-bold text-sm sm:text-base whitespace-nowrap">
                  ${quote.total_amount}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-4 sm:p-6 rounded-xl sm:rounded-2xl shadow-sm border border-gray-100">
          <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3 sm:mb-4">
            Recent Contacts
          </h3>
          <div className="space-y-2 sm:space-y-3">
            {data?.recentContacts?.map((contact: any, i: number) => (
              <div
                key={i}
                className="p-2.5 sm:p-3 bg-gray-50 rounded-lg sm:rounded-xl"
              >
                <p className="font-medium text-sm sm:text-base text-gray-700">
                  {contact.first_name} {contact.last_name}
                </p>
                <p className="text-xs text-gray-500 truncate">
                  {contact.email}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
