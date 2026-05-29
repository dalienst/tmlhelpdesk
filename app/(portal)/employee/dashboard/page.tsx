"use client";

import { Ticket, Plus, Clock, CheckCircle2, AlertCircle, FileText, ChevronRight } from "lucide-react";
import Link from "next/link";

export default function EmployeeDashboard() {
  // Placeholder data for demonstration
  const recentTickets = [
    { id: "TKT-1024", subject: "Laptop won't connect to office Wi-Fi", status: "Open", date: "Oct 24, 2023", priority: "Medium" },
    { id: "TKT-1021", subject: "Request for new Adobe Creative Cloud license", status: "In Progress", date: "Oct 22, 2023", priority: "Low" },
    { id: "TKT-0985", subject: "Printer on 3rd floor is out of toner", status: "Resolved", date: "Oct 15, 2023", priority: "Medium" },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl text-textBold text-gray-900 tracking-tight">My Workspace</h1>
          <p className="text-sm text-gray-500 mt-1">Submit requests and track your IT support tickets.</p>
        </div>
        <button className="bg-primary-blue hover:bg-primary-blue/95 text-white px-5 py-2.5 rounded-xl text-sm text-textBold transition-colors shadow-sm flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 shrink-0">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 text-textBold">Total Tickets</p>
            <p className="text-2xl text-textBold text-gray-900 leading-none mt-1">12</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 text-textBold">Open / Pending</p>
            <p className="text-2xl text-textBold text-gray-900 leading-none mt-1">2</p>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <p className="text-sm text-gray-500 text-textBold">Resolved</p>
            <p className="text-2xl text-textBold text-gray-900 leading-none mt-1">10</p>
          </div>
        </div>
      </div>

      {/* Recent Tickets Table */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex items-center justify-between">
          <h2 className="text-lg text-textBold text-gray-900">Recent Tickets</h2>
          <Link href="#" className="text-sm text-primary-blue text-textBold hover:underline flex items-center gap-1">
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100 text-xs uppercase tracking-wider text-gray-500 text-textBold">
                <th className="px-5 py-4 font-medium">Ticket ID</th>
                <th className="px-5 py-4 font-medium">Subject</th>
                <th className="px-5 py-4 font-medium">Status</th>
                <th className="px-5 py-4 font-medium">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentTickets.map((ticket) => (
                <tr key={ticket.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-4">
                    <span className="text-sm text-textBold text-gray-900">{ticket.id}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">{ticket.subject}</span>
                  </td>
                  <td className="px-5 py-4">
                    {ticket.status === 'Open' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-blue-50 text-blue-600 text-[10px] text-textBold uppercase tracking-wider"><AlertCircle className="w-3 h-3" /> Open</span>}
                    {ticket.status === 'In Progress' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 text-[10px] text-textBold uppercase tracking-wider"><Clock className="w-3 h-3" /> In Progress</span>}
                    {ticket.status === 'Resolved' && <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-600 text-[10px] text-textBold uppercase tracking-wider"><CheckCircle2 className="w-3 h-3" /> Resolved</span>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-500">{ticket.date}</span>
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