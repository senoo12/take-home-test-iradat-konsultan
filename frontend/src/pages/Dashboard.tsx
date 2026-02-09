import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getConsoler } from "../api/consoler";
import { getEvent } from "../api/event";
import { getSalaries } from "../api/salary";
import { getAttendance } from "../api/attendance";

const Dashboard = () => {
  // Fetching data
  const { data: consolers = [] } = useQuery({ queryKey: ["consoler"], queryFn: getConsoler });
  const { data: events = [] } = useQuery({ queryKey: ["event"], queryFn: getEvent });
  const { data: attendances = [] } = useQuery({ queryKey: ["attendance"], queryFn: getAttendance });
  const { data: salaries = [] } = useQuery({ queryKey: ["salaries"], queryFn: getSalaries });

  // Mapping data statistik menggunakan Emoji sebagai pengganti Lucide Icons
  const stats = [
    {
      label: "Total Consolers",
      value: consolers.length,
      icon: "👥",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
    },
    {
      label: "Total Events",
      value: events.length,
      icon: "📅",
      bgColor: "bg-purple-50",
      textColor: "text-purple-600",
    },
    {
      label: "Total Attendances",
      value: attendances.length,
      icon: "📝",
      bgColor: "bg-emerald-50",
      textColor: "text-emerald-600",
    },
    {
      label: "Pending Salaries",
      value: salaries.filter((s: any) => s.status === "PENDING").length,
      icon: "💰",
      bgColor: "bg-orange-50",
      textColor: "text-orange-600",
    },
  ];

  return (
    <div className="p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
        <p className="text-gray-500 text-sm">Ringkasan statistik data Iradat Management.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={index}
            className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4 transition-hover hover:shadow-md"
          >
            <div className={`w-12 h-12 flex items-center justify-center rounded-lg text-2xl ${stat.bgColor}`}>
              {stat.icon}
            </div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                {stat.label}
              </p>
              <p className="text-2xl font-black text-gray-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Info List Section */}
      <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
          <div className="p-4 border-b border-gray-100 bg-gray-50">
            <h2 className="font-bold text-gray-700">Recent Consolers</h2>
          </div>
          <ul className="divide-y divide-gray-100">
            {consolers.slice(0, 5).map((c: any) => (
              <li key={c.id} className="p-4 flex justify-between items-center hover:bg-gray-50">
                <div className="flex flex-col">
                  <span className="font-semibold text-gray-800">{c.name}</span>
                  <span className="text-xs text-gray-400">{c.email}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;