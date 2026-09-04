"use client";

import { useState } from "react";
import {
  Inbox,
  Clock,
  CheckCircle2,
  AlertOctagon,
  Loader2,
  X,
  UserCheck,
  Calendar,
  Layers,
  Edit2,
} from "lucide-react";
import { useFetchTickets, useUpdateTicket } from "@/hooks/tickets/actions";
import { Ticket as TicketType } from "@/services/tickets";
import toast from "react-hot-toast";

export default function TechnicianDashboard() {
  const { data: tickets, isLoading, error, refetch } = useFetchTickets({ my_assigned: true });
  const { mutateAsync: updateTicket } = useUpdateTicket();

  const [selectedTicket, setSelectedTicket] = useState<TicketType | null>(null);
  const [resolveNotes, setResolveNotes] = useState("");
  const [targetStatus, setTargetStatus] = useState<"IN_PROGRESS" | "RESOLVED" | "CLOSED">("RESOLVED");
  const [isUpdating, setIsUpdating] = useState(false);

  const totalInQueue = tickets?.length || 0;
  const inProgressTickets =
    tickets?.filter((t) => t.status?.toUpperCase() === "IN_PROGRESS").length || 0;
  const openTickets =
    tickets?.filter((t) => t.status?.toUpperCase() === "OPEN").length || 0;
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

  const handleUpdateStatus = async () => {
    if (!selectedTicket) return;
    setIsUpdating(true);
    try {
      await updateTicket({
        reference: selectedTicket.reference,
        data: {
          status: targetStatus,
          resolution_notes: resolveNotes || undefined,
        },
      });
      await refetch();
      toast.success(`Ticket marked as ${targetStatus}!`);
      setSelectedTicket(null);
      setResolveNotes("");
    } catch {
      toast.error("Failed to update ticket status.");
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 tracking-tight">Technician Console</h1>
          <p className="text-xs text-gray-500 mt-0.5">
            Manage your assigned support requests and resolve staff tickets.
          </p>
        </div>
      </div>

      {/* Live Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <div className="bg-white border border-gray-200 rounded p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-500 font-medium">My Queue</p>
            <Inbox className="w-4 h-4 text-blue-600" />
          </div>
          <p className="text-xl font-semibold text-gray-900 mt-2">{totalInQueue}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-500 font-medium">New / Unopened</p>
            <Clock className="w-4 h-4 text-blue-500" />
          </div>
          <p className="text-xl font-semibold text-blue-600 mt-2">{openTickets}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-500 font-medium">In Progress</p>
            <Clock className="w-4 h-4 text-amber-600" />
          </div>
          <p className="text-xl font-semibold text-amber-600 mt-2">{inProgressTickets}</p>
        </div>

        <div className="bg-white border border-gray-200 rounded p-4 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-xs text-gray-500 font-medium">Resolved</p>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <p className="text-xl font-semibold text-emerald-600 mt-2">{resolvedTickets}</p>
        </div>
      </div>

      {/* Active Queue Table */}
      <div className="bg-white border border-gray-200 rounded overflow-hidden shadow-sm">
        <div className="p-3.5 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
          <h2 className="text-xs font-semibold text-gray-900">Tickets Assigned To Me</h2>
          <span className="text-[11px] text-gray-400">
            {tickets?.length ? `${tickets.length} assigned` : "Live Queue"}
          </span>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-12 text-gray-400 gap-2">
            <Loader2 className="w-6 h-6 animate-spin text-red-600" />
            <p className="text-xs">Loading assigned tickets...</p>
          </div>
        ) : error ? (
          <div className="py-8 text-center text-red-500 text-xs">
            Failed to load assigned tickets.
          </div>
        ) : !tickets || tickets.length === 0 ? (
          <div className="py-12 text-center text-gray-400">
            <Inbox className="w-8 h-8 mx-auto mb-2 text-gray-300" />
            <p className="text-xs font-semibold text-gray-700">No tickets currently in your queue</p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Tickets routed to your issue categories will appear here automatically.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-gray-600 font-semibold">
                  <th className="px-4 py-2.5 font-semibold">Ticket ID &amp; Subject</th>
                  <th className="px-4 py-2.5 font-semibold">Requester</th>
                  <th className="px-4 py-2.5 font-semibold">Category &amp; Issue</th>
                  <th className="px-4 py-2.5 font-semibold">Priority</th>
                  <th className="px-4 py-2.5 font-semibold">Status</th>
                  <th className="px-4 py-2.5 font-semibold">Date</th>
                  <th className="px-4 py-2.5 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="px-4 py-2.5">
                      <p className="font-semibold text-gray-900">{ticket.subject}</p>
                      <p className="font-mono text-[10px] text-red-600 font-medium mt-0.5">
                        {ticket.ticket_number || ticket.reference?.slice(0, 8)}
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
                      <p className="text-[10px] text-gray-400">{ticket.category_name} ({ticket.department_name})</p>
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
                      {ticket.status === "OPEN" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-50 text-blue-600 text-[10px] font-semibold border border-blue-200">
                          Open
                        </span>
                      )}
                      {ticket.status === "IN_PROGRESS" && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-amber-50 text-amber-600 text-[10px] font-semibold border border-amber-200">
                          In Progress
                        </span>
                      )}
                      {["RESOLVED", "CLOSED"].includes(ticket.status) && (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-emerald-50 text-emerald-600 text-[10px] font-semibold border border-emerald-200">
                          Resolved
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-2.5 text-gray-500">
                      {formatDate(ticket.created_at)}
                    </td>
                    <td className="px-4 py-2.5 text-right">
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setResolveNotes(ticket.resolution_notes || "");
                          setTargetStatus(ticket.status === "OPEN" ? "IN_PROGRESS" : "RESOLVED");
                        }}
                        className="inline-flex items-center gap-1 px-2.5 py-1 text-red-600 hover:bg-red-50 rounded border border-red-200 text-xs font-semibold transition"
                      >
                        <Edit2 className="w-3 h-3" /> Update
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Ticket Action / Resolution Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="bg-white rounded shadow-xl w-full max-w-md overflow-hidden border border-gray-200 animate-in fade-in zoom-in-95">
            <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 bg-gray-50/50">
              <div>
                <span className="font-mono text-[11px] font-semibold text-red-600">
                  {selectedTicket.ticket_number}
                </span>
                <h3 className="text-xs font-semibold text-gray-900 mt-0.5">
                  Update Ticket Status
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
              <div className="bg-gray-50 p-2.5 rounded border border-gray-100 space-y-1">
                <p className="font-semibold text-gray-900">{selectedTicket.subject}</p>
                <p className="text-[11px] text-gray-500">
                  From: {selectedTicket.requester_name || selectedTicket.requester}
                </p>
                <p className="text-[11px] text-gray-600 pt-1 border-t border-gray-200/60">
                  {selectedTicket.description}
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Change Status
                </label>
                <select
                  value={targetStatus}
                  onChange={(e) => setTargetStatus(e.target.value as any)}
                  className="w-full px-3 py-1.5 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600 bg-white"
                >
                  <option value="IN_PROGRESS">In Progress (Currently Working On It)</option>
                  <option value="RESOLVED">Resolved (Work Completed / Document Sent)</option>
                  <option value="CLOSED">Closed (Archived)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Resolution Notes / Feedback to Requester
                </label>
                <textarea
                  rows={3}
                  value={resolveNotes}
                  onChange={(e) => setResolveNotes(e.target.value)}
                  placeholder="e.g., P9 tax certificate has been generated and emailed to your staff email..."
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded focus:outline-none focus:ring-1 focus:ring-red-600 focus:border-red-600"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 px-4 py-2.5 bg-gray-50 border-t border-gray-100">
              <button
                onClick={() => setSelectedTicket(null)}
                className="px-3 py-1.5 text-gray-600 hover:bg-gray-100 rounded text-xs font-medium transition"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateStatus}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-red-600 text-white rounded text-xs font-semibold hover:bg-red-700 transition disabled:opacity-50"
              >
                {isUpdating ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                Save Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
