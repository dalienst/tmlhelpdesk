"use client";

import { Inbox, Clock, CheckCircle2, Flame, AlertOctagon, Filter, LayoutGrid } from "lucide-react";

export default function TechnicianDashboard() {
  const activeQueue = [
    { id: "TKT-1089", title: "Network outage in Wing B", requester: "John Doe", priority: "High", time: "10 min ago", status: "Open" },
    { id: "TKT-1088", title: "Cannot print from HR workstation", requester: "Jane Limo", priority: "Medium", time: "1 hr ago", status: "In Progress" },
    { id: "TKT-1085", title: "Software license expired", requester: "Michael Kip", priority: "Low", time: "3 hrs ago", status: "Open" },
    { id: "TKT-1081", title: "Laptop screen flickering", requester: "Sarah Jenkins", priority: "Medium", time: "5 hrs ago", status: "In Progress" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Technician Console</h1>
          <p className="text-sm text-gray-500">Manage your active queue and resolve support tickets.</p>
        </div>
        <div className="flex gap-2">
          <button className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded transition-colors">
            <LayoutGrid className="w-4 h-4" />
          </button>
          <button className="p-2 border border-gray-200 text-gray-600 hover:bg-gray-50 rounded transition-colors">
            <Filter className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Highlight Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-technician-green/10 border border-technician-green/20 rounded p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs text-technician-green font-semibold">My Queue</p>
            <Inbox className="w-4 h-4 text-technician-green opacity-70" />
          </div>
          <p className="text-xl font-semibold text-technician-green mt-2">12</p>
        </div>
        <div className="bg-amber-50 border border-amber-200 rounded p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs text-amber-600 font-semibold">In Progress</p>
            <Clock className="w-4 h-4 text-amber-600 opacity-70" />
          </div>
          <p className="text-xl font-semibold text-amber-600 mt-2">4</p>
        </div>
        <div className="bg-red-50 border border-red-200 rounded p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs text-red-600 font-semibold">SLA Risk</p>
            <Flame className="w-4 h-4 text-red-600 opacity-70" />
          </div>
          <p className="text-xl font-semibold text-red-600 mt-2">1</p>
        </div>
        <div className="bg-emerald-50 border border-emerald-200 rounded p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs text-emerald-600 font-semibold">Resolved Today</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600 opacity-70" />
          </div>
          <p className="text-xl font-semibold text-emerald-600 mt-2">7</p>
        </div>
      </div>

      {/* Ticket Queue */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-sm font-semibold text-gray-900">Active Queue</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 font-semibold">
                <th className="px-5 py-3 font-medium">Ticket</th>
                <th className="px-5 py-3 font-medium">Requester</th>
                <th className="px-5 py-3 font-medium">Priority</th>
                <th className="px-5 py-3 font-medium">Status</th>
                <th className="px-5 py-3 font-medium">Time Logged</th>
                <th className="px-5 py-3 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {activeQueue.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50/80 transition-colors group">
                  <td className="px-5 py-3">
                    <p className="text-sm font-semibold text-gray-900">{ticket.title}</p>
                    <p className="text-[11px] text-gray-500 mt-0.5">{ticket.id}</p>
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-sm text-gray-700">{ticket.requester}</span>
                  </td>
                  <td className="px-5 py-3">
                    {ticket.priority === 'High' && <span className="inline-flex items-center gap-1 text-red-600 text-xs font-semibold"><AlertOctagon className="w-3 h-3" /> High</span>}
                    {ticket.priority === 'Medium' && <span className="inline-flex items-center gap-1 text-amber-600 text-xs font-semibold"><AlertOctagon className="w-3 h-3" /> Medium</span>}
                    {ticket.priority === 'Low' && <span className="inline-flex items-center gap-1 text-emerald-600 text-xs font-semibold"><AlertOctagon className="w-3 h-3" /> Low</span>}
                  </td>
                  <td className="px-5 py-3">
                    {ticket.status === 'Open' ? (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-100 text-gray-600 text-[10px] font-semibold uppercase tracking-wider">Open</span>
                    ) : (
                      <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-600 border border-amber-200 text-[10px] font-semibold uppercase tracking-wider">In Progress</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <span className="text-xs text-gray-500">{ticket.time}</span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button className="text-xs text-technician-green font-semibold hover:underline opacity-0 group-hover:opacity-100 transition-opacity">
                      Resolve
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
