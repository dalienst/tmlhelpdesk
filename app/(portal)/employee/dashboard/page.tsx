"use client";

import { useState } from "react";
import {
  Ticket as TicketIcon,
  Plus,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  Loader2,
  UserCheck,
  Calendar,
  Layers,
} from "lucide-react";
import { useFetchTickets } from "@/hooks/tickets/actions";
import { Ticket as TicketType } from "@/services/tickets";
import CreateTicket from "@/forms/tickets/CreateTicket";

export default function EmployeeDashboard() {
  const { data: tickets, isLoading, error } = useFetchTickets({ my_tickets: true });
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);

  const totalTickets = tickets?.length || 0;
  const openPendingTickets =
    tickets?.filter((t) =>
      ["OPEN", "IN_PROGRESS", "PENDING"].includes(t.status?.toUpperCase())
    ).length || 0;
  const resolvedTickets =
    tickets?.filter((t) =>
      ["RESOLVED", "CLOSED"].includes(t.status?.toUpperCase())
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
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-semibold uppercase tracking-wider border border-blue-200">
            <AlertCircle className="w-3 h-3" /> Open
          </span>
        );
      case "IN_PROGRESS":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold uppercase tracking-wider border border-amber-200">
            <Clock className="w-3 h-3" /> In Progress
          </span>
        );
      case "PENDING":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-purple-50 text-purple-600 text-[10px] font-semibold uppercase tracking-wider border border-purple-200">
            <Clock className="w-3 h-3" /> Pending
          </span>
        );
      case "RESOLVED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-semibold uppercase tracking-wider border border-emerald-200">
            <CheckCircle2 className="w-3 h-3" /> Resolved
          </span>
        );
      case "CLOSED":
        return (
          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-gray-100 text-gray-700 text-[10px] font-semibold uppercase tracking-wider border border-gray-200">
            <CheckCircle2 className="w-3 h-3" /> Closed
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded bg-gray-50 text-gray-600 text-[10px] font-semibold uppercase tracking-wider border border-gray-200">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">My Workspace</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Submit requests and track your service tickets across all departments.
          </p>
        </div>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-1.5 rounded text-xs font-semibold transition shadow-sm flex items-center justify-center gap-1.5"
        >
          <Plus className="w-4 h-4" /> New Ticket
        </button>
      </div>

      {/* Live Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Total Tickets</p>
            <p className="text-xl font-semibold text-gray-900 mt-0.5">{totalTickets}</p>
          </div>
          <div className="w-9 h-9 rounded bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
            <TicketIcon className="w-4 h-4" />
          </div>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex items-center justify-between">
          <div>
            <p className="text-xs text-gray-500 font-medium">Open / Pending</p>
            <p className="text-xl font-semibold text-amber-600 mt-0.5">{openPendingTickets}</p>
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
      </div>

      {/* Real Tickets Table */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden">
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xs font-semibold text-gray-900">My Raised Tickets</h2>
          <span className="text-[11px] text-gray-400">
            {tickets?.length ? `${tickets.length} ticket(s)` : "Live Queue"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <p className="text-xs">Loading your tickets...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-xs">
            Failed to load your tickets. Please check your connection.
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <TicketIcon className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-semibold text-gray-700">No tickets raised yet</p>
            <p className="text-[11px] text-gray-400 mt-0.5 mb-3">
              Need assistance with payroll, IT, maintenance, or any department?
            </p>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition"
            >
              <Plus className="w-3.5 h-3.5" /> Raise Your First Ticket
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                  <th className="px-4 py-2.5 font-semibold">Ticket ID</th>
                  <th className="px-4 py-2.5 font-semibold">Subject &amp; Issue</th>
                  <th className="px-4 py-2.5 font-semibold">Department</th>
                  <th className="px-4 py-2.5 font-semibold">Assigned To</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Date Raised</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr
                    key={ticket.id}
                    onClick={() => setSelectedTicket(ticket)}
                    className="hover:bg-gray-50/70 transition-colors cursor-pointer"
                  >
                    <td className="px-4 py-2.5 font-mono text-[11px] font-semibold text-gray-900">
                      {ticket.ticket_number || ticket.reference?.slice(0, 8)}
                    </td>
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-gray-900">{ticket.subject}</p>
                      <p className="text-[11px] text-gray-400">{ticket.issue_name}</p>
                    </td>
                    <td className="px-4 py-2.5 text-gray-700 font-medium">
                      {ticket.department_name}
                    </td>
                    <td className="px-4 py-2.5 text-gray-600">
                      {ticket.assigned_to_name ? (
                        <div className="flex items-center gap-1">
                          <UserCheck className="w-3 h-3 text-red-600" />
                          <span>{ticket.assigned_to_name}</span>
                        </div>
                      ) : (
                        <span className="text-gray-400 italic">Department Queue</span>
                      )}
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

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div>
                <span className="font-mono text-[11px] font-semibold text-red-600">
                  {selectedTicket.ticket_number}
                </span>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5">
                  {selectedTicket.subject}
                </h3>
              </div>
              <button
                onClick={() => setSelectedTicket(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-2 bg-gray-50 p-2.5 rounded border border-gray-100 text-gray-700">
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Department</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.department_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Service / Issue</span>
                  <span className="font-semibold text-gray-900">{selectedTicket.issue_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Handler In Charge</span>
                  <span className="font-semibold text-gray-900">
                    {selectedTicket.assigned_to_name || "Department HOD"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 text-[10px] block font-medium">Status & Priority</span>
                  <div className="flex items-center gap-1 mt-0.5">
                    {getStatusBadge(selectedTicket.status)}
                    <span className="text-[10px] text-gray-500 font-semibold">({selectedTicket.priority})</span>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-[11px] font-semibold text-gray-600 uppercase tracking-wider mb-1">
                  Description
                </h4>
                <div className="bg-gray-50/50 p-2.5 rounded border border-gray-100 text-gray-800 leading-relaxed whitespace-pre-wrap">
                  {selectedTicket.description}
                </div>
              </div>

              {selectedTicket.resolution_notes && (
                <div className="bg-emerald-50/60 p-2.5 rounded border border-emerald-200 text-emerald-950">
                  <h4 className="text-[11px] font-semibold text-emerald-800 uppercase tracking-wider mb-0.5">
                    Resolution Notes
                  </h4>
                  <p className="leading-relaxed">{selectedTicket.resolution_notes}</p>
                </div>
              )}
            </div>

            <div className="flex items-center justify-end px-4 py-2.5 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-3 py-1.5 bg-white border border-gray-200 text-gray-700 rounded text-xs font-semibold hover:bg-gray-50 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* New Ticket Modal */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-lg overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50 sticky top-0 bg-white z-10">
              <h3 className="text-xs font-semibold text-gray-700">Submit New Request</h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4">
              <CreateTicket
                onSuccess={() => setIsCreateModalOpen(false)}
                onCancel={() => setIsCreateModalOpen(false)}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
