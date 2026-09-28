"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Ticket,
  Clock,
  CheckCircle2,
  AlertCircle,
  Plus,
  Loader2,
  RefreshCw,
  Search,
  UserCheck,
  ChevronRight,
  Building2,
  Layers,
} from "lucide-react";
import { useFetchTickets } from "@/hooks/tickets/actions";

export default function EmployeeDashboard() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const { data: tickets, isLoading, error, refetch, isFetching } = useFetchTickets({
    my_tickets: true,
  });

  const totalTickets = tickets?.length || 0;
  const openTickets =
    tickets?.filter((t) => ["OPEN", "IN_PROGRESS", "PENDING"].includes(t.status?.toUpperCase())).length || 0;
  const resolvedTickets =
    tickets?.filter((t) => ["RESOLVED", "CLOSED"].includes(t.status?.toUpperCase())).length || 0;

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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-700 text-[10px] font-semibold border border-amber-200">
            <AlertCircle className="w-3 h-3 text-amber-500" />
            Open
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-semibold border border-blue-200">
            <Clock className="w-3 h-3 text-blue-500" />
            In Progress
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-700 text-[10px] font-semibold border border-purple-200">
            <Clock className="w-3 h-3 text-purple-500" />
            Pending
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            Resolved
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold border border-gray-200">
            Closed
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

  const filteredTickets = tickets?.filter((t) => {
    const term = searchTerm.toLowerCase();
    const matchesSearch =
      t.subject?.toLowerCase().includes(term) ||
      t.ticket_number?.toLowerCase().includes(term) ||
      t.issue_name?.toLowerCase().includes(term) ||
      t.department_name?.toLowerCase().includes(term);

    const matchesStatus =
      statusFilter === "ALL" || t.status?.toUpperCase() === statusFilter;

    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-5 pb-8 max-w-7xl mx-auto">
      {/* Top Header Card */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded border border-gray-200 shadow-sm">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-primary-blue/10 flex items-center justify-center text-primary-blue">
              <Ticket className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-semibold text-gray-900 tracking-tight">
              My Support Requests
            </h1>
          </div>
          <p className="text-xs text-gray-500 mt-1 max-w-xl">
            Track your requests, check SLA resolution timelines, and download fulfillment documents (e.g. generated LPOs).
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <button
            onClick={() => refetch()}
            disabled={isFetching}
            className="p-2 bg-gray-50 hover:bg-gray-100 text-gray-600 rounded border border-gray-200 text-xs font-semibold transition flex items-center gap-1 shadow-sm"
            title="Refresh tickets"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isFetching ? "animate-spin" : ""}`} />
            <span className="hidden sm:inline">Refresh</span>
          </button>

          {/* Full Page Ticket Raising Button */}
          <Link
            href="/tickets/new"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-blue hover:bg-primary-blue/95 text-white rounded text-xs font-semibold transition shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Raise a Request</span>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Raised Requests</p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">{totalTickets}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">All time submissions</p>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <Ticket className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-amber-600 font-medium">In Progress &amp; Open</p>
            <p className="text-xl font-semibold text-amber-700 mt-0.5 flex items-center gap-2">
              {openTickets}
              {openTickets > 0 && (
                <span className="inline-block w-2 h-2 rounded bg-amber-500 animate-ping" />
              )}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">Currently being fulfilled</p>
          </div>
          <div className="w-9 h-9 rounded bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between shadow-sm">
          <div>
            <p className="text-xs text-emerald-600 font-medium">Resolved / Completed</p>
            <p className="text-xl font-semibold text-emerald-700 mt-0.5">{resolvedTickets}</p>
            <p className="text-[11px] text-gray-400 mt-0.5">Ready for review</p>
          </div>
          <div className="w-9 h-9 rounded bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-3.5 rounded border border-gray-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-2.5">
        <div className="relative w-full sm:w-80">
          <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search tickets by subject, #, issue..."
            className="w-full pl-9 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-2.5 py-1.5 bg-gray-50 border border-gray-200 rounded text-xs outline-none focus:border-primary-blue focus:bg-white transition text-gray-700 font-medium"
          >
            <option value="ALL">All Statuses</option>
            <option value="OPEN">Open</option>
            <option value="IN_PROGRESS">In Progress</option>
            <option value="PENDING">Pending</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>
        </div>
      </div>

      {/* Requests Table */}
      <div className="bg-white border border-gray-200 rounded shadow-sm overflow-hidden">
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xs font-semibold text-gray-900">Your Tickets List</h2>
          <span className="text-[11px] text-gray-500">
            Showing <strong className="text-gray-900 font-semibold">{filteredTickets?.length || 0}</strong> of{" "}
            {totalTickets} ticket(s)
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-primary-blue" />
            <p className="text-xs">Loading your tickets...</p>
          </div>
        ) : error ? (
          <div className="py-12 text-center text-primary-red text-xs">
            Failed to load tickets. Please check your connection and refresh.
          </div>
        ) : !filteredTickets || filteredTickets.length === 0 ? (
          <div className="py-16 text-center text-gray-400">
            <Ticket className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-semibold text-gray-700">No support requests found</p>
            <p className="text-[11px] text-gray-400 mt-0.5 mb-3">
              Need assistance with payroll, IT, purchasing, or maintenance?
            </p>
            <Link
              href="/tickets/new"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-primary-blue text-white rounded text-xs font-semibold hover:bg-primary-blue/95 transition shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" /> Raise Your First Ticket
            </Link>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-200 text-gray-600 font-semibold uppercase text-[11px]">
                  <th className="px-4 py-3">Ticket ID &amp; Subject</th>
                  <th className="px-4 py-3">Department &amp; Service</th>
                  <th className="px-4 py-3">Assigned Handler</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3">Date Raised</th>
                  <th className="px-4 py-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredTickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => router.push(`/tickets/${ticket.reference}`)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer group"
                  >
                    <td className="px-4 py-3">
                      <p className="font-semibold text-gray-900 group-hover:text-primary-blue transition-colors">
                        {ticket.subject}
                      </p>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="font-mono text-[10px] text-primary-red font-semibold bg-red-50 px-1.5 py-0.2 rounded border border-red-100">
                          {ticket.ticket_number}
                        </span>
                        {ticket.unit_name && (
                          <span className="text-[10px] text-gray-400">
                            {ticket.unit_name}
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="px-4 py-3 text-gray-700">
                      <span className="font-medium text-gray-900">{ticket.issue_name}</span>
                      <p className="text-[10px] text-gray-400">
                        {ticket.category_name} ({ticket.department_name})
                      </p>
                    </td>

                    <td className="px-4 py-3 text-gray-600">
                      {ticket.assigned_to_name ? (
                        <div className="flex items-center gap-1 text-gray-900 font-semibold">
                          <UserCheck className="w-3.5 h-3.5 text-technician-green shrink-0" />
                          <span>{ticket.assigned_to_name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Department Queue</span>
                      )}
                    </td>

                    <td className="px-4 py-3">{getStatusBadge(ticket.status)}</td>

                    <td className="px-4 py-3 text-gray-500 whitespace-nowrap">
                      <p>{formatDate(ticket.created_at)}</p>
                      <p className="text-[10px] text-gray-400">{ticket.sla_hours}h SLA</p>
                    </td>

                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/tickets/${ticket.reference}`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded bg-gray-50 text-gray-700 hover:text-primary-blue hover:bg-primary-blue/5 border border-gray-200 transition"
                      >
                        <span>View</span>
                        <ChevronRight className="w-3 h-3" />
                      </Link>
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
