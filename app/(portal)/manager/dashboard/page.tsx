"use client";

import {
  Briefcase,
  Users,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Loader2,
  Ticket as TicketIcon,
  UserCheck,
} from "lucide-react";
import { useFetchTickets } from "@/hooks/tickets/actions";
import { useFetchDepartments } from "@/hooks/departments/actions";

export default function ManagerDashboard() {
  const { data: tickets, isLoading, error } = useFetchTickets();
  const { data: departments } = useFetchDepartments();

  const totalTickets = tickets?.length || 0;
  const openTickets =
    tickets?.filter((t) =>
      ["OPEN", "IN_PROGRESS", "PENDING"].includes(t.status?.toUpperCase())
    ).length || 0;
  const resolvedTickets =
    tickets?.filter((t) =>
      ["RESOLVED", "CLOSED"].includes(t.status?.toUpperCase())
    ).length || 0;
  const criticalTickets =
    tickets?.filter(
      (t) =>
        t.priority?.toUpperCase() === "CRITICAL" &&
        !["RESOLVED", "CLOSED"].includes(t.status?.toUpperCase())
    ).length || 0;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "-";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status?.toUpperCase()) {
      case "OPEN":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-semibold border border-blue-200">
            Open
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold border border-amber-200">
            In Progress
          </span>
        );
      case "RESOLVED":
      case "CLOSED":
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-semibold border border-emerald-200">
            Resolved
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-[10px] font-semibold border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Department Overview</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Oversee team performance, track open requests, and monitor SLA turnarounds.
          </p>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Department Tickets</p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">{totalTickets}</p>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <TicketIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Open / Pending</p>
            <p className="text-xl font-semibold text-amber-600 mt-0.5">{openTickets}</p>
          </div>
          <div className="w-9 h-9 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Resolved</p>
            <p className="text-xl font-semibold text-emerald-600 mt-0.5">{resolvedTickets}</p>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Critical / High Risk</p>
            <p className="text-xl font-semibold text-red-600 mt-0.5">{criticalTickets}</p>
          </div>
          <div className="w-9 h-9 rounded bg-red-50 border border-red-100 flex items-center justify-center text-red-600 shrink-0">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Live Department Tickets Stream */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xs font-semibold text-gray-900">Department Requests Queue</h2>
          <span className="text-[11px] text-gray-400">
            {tickets?.length ? `${tickets.length} total request(s)` : "Live Queue"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <p className="text-xs">Loading department requests...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-xs">
            Failed to load department requests.
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <TicketIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-semibold text-gray-700">No requests in queue</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Incoming service tickets will appear here for oversight and escalation.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                  <th className="px-4 py-2.5">Ticket ID &amp; Subject</th>
                  <th className="px-4 py-2.5">Requester</th>
                  <th className="px-4 py-2.5">Service / Issue</th>
                  <th className="px-4 py-2.5">Assigned Handler</th>
                  <th className="px-4 py-2.5">Priority</th>
                  <th className="px-4 py-2.5">Status</th>
                  <th className="px-4 py-2.5">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-gray-900">{ticket.subject}</p>
                      <p className="font-mono text-[10px] text-red-600 font-medium mt-0.5">
                        {ticket.ticket_number}
                      </p>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">
                      <p className="font-medium text-gray-900">{ticket.requester_name || ticket.requester}</p>
                      {ticket.requester_payroll_no && (
                        <p className="text-[10px] text-gray-400">Payroll: {ticket.requester_payroll_no}</p>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-700">
                      <span className="font-medium text-gray-900">{ticket.issue_name}</span>
                      <p className="text-[10px] text-gray-400">{ticket.category_name}</p>
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {ticket.assigned_to_name ? (
                        <div className="flex items-center gap-1 text-gray-900 font-medium">
                          <UserCheck className="w-3 h-3 text-red-600" />
                          <span>{ticket.assigned_to_name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Department Queue</span>
                      )}
                    </td>
                    <td className="px-4 py-2.5">
                      <span
                        className={`inline-block px-1.5 py-0.5 rounded text-[10px] font-semibold ${
                          ticket.priority === "CRITICAL"
                            ? "bg-red-100 text-red-800"
                            : ticket.priority === "HIGH"
                              ? "bg-orange-100 text-orange-800"
                              : ticket.priority === "MEDIUM"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-gray-100 text-gray-700"
                        }`}
                      >
                        {ticket.priority}
                      </span>
                    </td>
                    <td className="px-4 py-2.5">
                      {getStatusBadge(ticket.status)}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">
                      {formatDate(ticket.created_at)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
